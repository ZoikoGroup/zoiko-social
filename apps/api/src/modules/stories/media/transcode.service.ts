import { Injectable, Logger } from '@nestjs/common'
import { spawn, execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { PrismaService } from '../../prisma/prisma.service'

// ── Rendition specs (matching §4.2) ──────────────────────────────────────────

export interface VideoRendition {
  label: string        // '1080' | '720' | '480'
  width: number
  height: number
  bitrate: string      // ffmpeg bitrate string, e.g. '3000k'
  audioBitrate: string // e.g. '128k'
}

export const HLS_RENDITIONS: VideoRendition[] = [
  { label: '1080', width: 1920, height: 1080, bitrate: '3000k', audioBitrate: '128k' },
  { label: '720',  width: 1280, height: 720,  bitrate: '2000k', audioBitrate: '96k' },
  { label: '480',  width: 854,  height: 480,  bitrate: '1000k', audioBitrate: '64k' },
]

export interface VideoProbeResult {
  durationMs: number
  width: number
  height: number
  codec: string
  fps: number
  hasAudio: boolean
}

export interface TranscodeResult {
  hlsUrl: string
  mp4FallbackUrl: string
  thumbnailUrl: string
  previewUrl: string
  renditions: Record<string, string>  // { '1080': 'path', '720': 'path', '480': 'path' }
  durationMs: number
  /**
   * Local output directory containing the full transcode tree
   * (master.m3u8, {label}/index.m3u8 + seg-*.ts, fallback.mp4, poster.jpg,
   * preview.webp). The caller uploads this tree to storage and then deletes
   * it. Undefined in the degraded (no-ffmpeg) path.
   */
  localDir?: string
}

const MAX_SEGMENT_SECONDS = 15
const TEMP_DIR = path.join(os.tmpdir(), 'zoiko-transcode')

/**
 * TranscodeService — orchestrates ffmpeg video processing for stories.
 *
 * All operations execute ffmpeg/ffprobe as child processes. When the binaries
 * are not available the service degrades gracefully — callers always receive
 * a valid result, but with fewer renditions.
 *
 * The worker pod (dedicated, with ffmpeg installed) runs the real transcode.
 * API pods fall back to a no-op that marks the story ready with the raw
 * uploaded file as-is.
 *
 * @see docs/stories-architecture.md §4
 */
@Injectable()
export class TranscodeService {
  private readonly logger = new Logger(TranscodeService.name)
  readonly ffmpegAvailable: boolean
  readonly ffprobeAvailable: boolean

  constructor(private readonly prisma: PrismaService) {
    this.ffmpegAvailable = this.checkBinary('ffmpeg')
    this.ffprobeAvailable = this.checkBinary('ffprobe')

    if (!this.ffmpegAvailable || !this.ffprobeAvailable) {
      this.logger.warn(
        `ffmpeg available=${this.ffmpegAvailable}, ffprobe available=${this.ffprobeAvailable} — ` +
        'video transcoding will be degraded (raw files served as-is). ' +
        'Install ffmpeg on the worker pod for full HLS + segmentation pipeline.',
      )
    }

    // Ensure temp directory exists
    if (this.ffmpegAvailable) {
      try { fs.mkdirSync(TEMP_DIR, { recursive: true }) } catch { /* best-effort */ }
    }
  }

  // ── PROBE ──────────────────────────────────────────────────────────────────

  /**
   * Probe a video file to extract metadata. Falls back to reasonable defaults
   * when ffprobe is unavailable.
   */
  async probeMedia(inputPath: string): Promise<VideoProbeResult> {
    if (!this.ffprobeAvailable) {
      return { durationMs: 5_000, width: 720, height: 1280, codec: 'unknown', fps: 30, hasAudio: true }
    }

    try {
      const stdout = execSync(
        `ffprobe -v quiet -print_format json -show_format -show_streams "${inputPath}"`,
        { timeout: 10_000, encoding: 'utf-8' },
      )
      const data = JSON.parse(stdout) as {
        format?: { duration?: string }
        streams?: Array<{ codec_type: string; codec_name: string; width?: number; height?: number; r_frame_rate?: string }>
      }

      const videoStream = data.streams?.find((s) => s.codec_type === 'video')
      const audioStream = data.streams?.find((s) => s.codec_type === 'audio')
      const durationSec = data.format?.duration ? parseFloat(data.format.duration) : 5

      // Parse frame rate like "30000/1001"
      let fps = 30
      if (videoStream?.r_frame_rate) {
        const parts = videoStream.r_frame_rate.split('/')
        if (parts.length === 2) fps = Math.round(parseInt(parts[0]!) / parseInt(parts[1]!))
      }

      return {
        durationMs: Math.round(durationSec * 1000),
        width: videoStream?.width ?? 720,
        height: videoStream?.height ?? 1280,
        codec: videoStream?.codec_name ?? 'unknown',
        fps,
        hasAudio: !!audioStream,
      }
    } catch (err) {
      this.logger.warn(`ffprobe failed for ${inputPath}: ${(err as Error).message}`)
      return { durationMs: 5_000, width: 720, height: 1280, codec: 'unknown', fps: 30, hasAudio: true }
    }
  }

  // ── SEGMENTATION ───────────────────────────────────────────────────────────

  /**
   * Segment a >15s video into N × 15s parts by creating additional story rows
   * sharing the same `segmentGroupId`. Returns all story IDs in the group
   * (including the original).
   *
   * Each segment becomes its own story row so analytics, views, and reactions
   * are tracked per-segment. The player chains them automatically.
   */
  async segmentVideo(
    originalStoryId: string,
    authorId: string,
    probe: VideoProbeResult,
  ): Promise<string[]> {
    if (!this.ffmpegAvailable || probe.durationMs <= MAX_SEGMENT_SECONDS * 1000) {
      return [originalStoryId]
    }

    const segmentCount = Math.ceil(probe.durationMs / (MAX_SEGMENT_SECONDS * 1000))
    const segmentGroupId = crypto.randomUUID()
    const outputDir = path.join(TEMP_DIR, segmentGroupId)

    try { fs.mkdirSync(outputDir, { recursive: true }) } catch { /* best-effort */ }

    // Fetch the original story to get the media path
    const original = await this.prisma.story.findUnique({
      where: { id: originalStoryId },
      include: { media: true },
    })
    if (!original) return [originalStoryId]

    const originalMedia = original.media?.[0]
    if (!originalMedia?.imageUrl) return [originalStoryId]

    // Set segment group on the original story
    await this.prisma.story.update({
      where: { id: originalStoryId },
      data: { segmentGroupId, segmentIndex: 0, durationMs: MAX_SEGMENT_SECONDS * 1000 },
    })

    const storyIds = [originalStoryId]

    // Create additional story rows for segments 1..N
    for (let i = 1; i < segmentCount; i++) {
      const mediaId = crypto.randomUUID()
      const segment = await this.prisma.story.create({
        data: {
          authorId,
          type: 'video',
          status: 'processing',
          privacy: original.privacy,
          segmentIndex: i,
          segmentGroupId,
          caption: i > 0 ? undefined : original.caption,
          durationMs: MAX_SEGMENT_SECONDS * 1000,
          publishedAt: new Date(),
          expiresAt: original.expiresAt,
          allowReplies: original.allowReplies,
          allowReactions: original.allowReactions,
          media: {
            create: {
              id: mediaId,
              type: 'video',
              imageUrl: originalMedia.imageUrl,
              width: originalMedia.width,
              height: originalMedia.height,
              blurhash: originalMedia.blurhash,
            },
          },
        },
        select: { id: true },
      })
      storyIds.push(segment.id)
    }

    this.logger.log(`Segmented story ${originalStoryId} into ${segmentCount} parts (group ${segmentGroupId})`)

    return storyIds
  }

  // ── HLS TRANSCODE ──────────────────────────────────────────────────────────

  /**
   * Transcode a video to HLS renditions + mp4 fallback.
   * When ffmpeg is unavailable, the file is served as-is from the upload path.
   */
  async transcodeToHLS(
    inputPath: string,
    outputBaseName: string,
    audioTrackPath?: string,
    audioOptions?: { volume?: number; fadeIn?: boolean; fadeOut?: boolean },
  ): Promise<TranscodeResult> {
    // Return a degraded result when ffmpeg is unavailable
    if (!this.ffmpegAvailable) {
      return {
        hlsUrl: inputPath,
        mp4FallbackUrl: inputPath,
        thumbnailUrl: inputPath,
        previewUrl: inputPath,
        renditions: { '720': inputPath },
        durationMs: 5_000,
      }
    }

    const workDir = path.join(TEMP_DIR, outputBaseName)
    try { fs.mkdirSync(workDir, { recursive: true }) } catch { /* best-effort */ }

    const renditionPaths: Record<string, string> = {}
    const playlistEntries: string[] = []

    // Transcode each rendition
    for (const rend of HLS_RENDITIONS) {
      const segDir = path.join(workDir, rend.label)
      try { fs.mkdirSync(segDir, { recursive: true }) } catch { /* best-effort */ }

      const playlistPath = path.join(segDir, 'index.m3u8')
      const segmentPattern = path.join(segDir, 'seg-%03d.ts')

      let audioFilterArgs: string[] = []
      if (audioOptions?.volume !== undefined && audioOptions.volume < 100) {
        const vol = audioOptions.volume / 100
        const filterExpr = `volume=${vol}${audioOptions.fadeIn ? ',afade=t=in:ss=0:d=1' : ''}${audioOptions.fadeOut ? ',afade=t=out:st=' + Math.floor(MAX_SEGMENT_SECONDS - 1) + ':d=1' : ''}`
        audioFilterArgs = ['-af', filterExpr]
      }

      const args = [
        '-i', inputPath,
        ...(audioTrackPath ? ['-i', audioTrackPath] : []),
        '-vf', `scale=${rend.width}:${rend.height}:force_original_aspect_ratio=decrease,pad=${rend.width}:${rend.height}:(ow-iw)/2:(oh-ih)/2`,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '23',
        '-b:v', rend.bitrate,
        '-maxrate', rend.bitrate,
        '-bufsize', String(parseInt(rend.bitrate) * 2) + 'k',
        ...audioFilterArgs,
        ...(audioTrackPath ? ['-c:a', 'aac', '-b:a', rend.audioBitrate, '-shortest'] : ['-c:a', 'aac', '-b:a', rend.audioBitrate]),
        '-f', 'hls',
        '-hls_time', '4',
        '-hls_list_size', '0',
        '-hls_segment_filename', segmentPattern,
        '-progress', '-',
        '-y',
        playlistPath,
      ]

      await this.runFfmpeg(args)

      renditionPaths[rend.label] = playlistPath
      playlistEntries.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(rend.bitrate) * 1000},RESOLUTION=${rend.width}x${rend.height}`,
        `${rend.label}/index.m3u8`,
      )
    }

    // Generate master playlist
    const masterPlaylist = [
      '#EXTM3U',
      '#EXT-X-VERSION:3',
      ...playlistEntries,
    ].join('\n')
    const masterPath = path.join(workDir, 'master.m3u8')
    fs.writeFileSync(masterPath, masterPlaylist)

    // Generate mp4 fallback (best rendition)
    const mp4Path = path.join(workDir, 'fallback.mp4')
    await this.runFfmpeg([
      '-i', inputPath,
      ...(audioTrackPath ? ['-i', audioTrackPath, '-shortest'] : []),
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      '-y',
      mp4Path,
    ])

    // Generate poster thumbnail (first frame)
    const thumbnailPath = path.join(workDir, 'poster.jpg')
    await this.runFfmpeg([
      '-i', inputPath,
      '-vframes', '1',
      '-vf', 'scale=1080:1080:force_original_aspect_ratio=decrease',
      '-q:v', '3',
      '-y',
      thumbnailPath,
    ])

    // Generate preview (short animated webp for tray)
    const previewPath = path.join(workDir, 'preview.webp')
    await this.runFfmpeg([
      '-i', inputPath,
      '-vf', 'scale=480:480:force_original_aspect_ratio=decrease,fps=10',
      '-vframes', '20',
      '-loop', '0',
      '-y',
      previewPath,
    ])

    return {
      hlsUrl: masterPath,
      mp4FallbackUrl: mp4Path,
      thumbnailUrl: thumbnailPath,
      previewUrl: previewPath,
      renditions: renditionPaths,
      durationMs: 0, // will be set from probe result
      localDir: workDir,
    }
  }

  /**
   * Recursively list every file under a directory, returning paths relative to
   * that directory (POSIX separators — suitable for storage keys). Used by the
   * media worker to upload the full HLS output tree.
   */
  listOutputFiles(rootDir: string): string[] {
    const out: string[] = []
    const walk = (dir: string, prefix: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name
        if (entry.isDirectory()) walk(path.join(dir, entry.name), rel)
        else out.push(rel)
      }
    }
    try { walk(rootDir, '') } catch { /* dir gone — nothing to upload */ }
    return out
  }

  /** Best-effort recursive cleanup of a local transcode directory. */
  cleanupDir(dir: string): void {
    try { fs.rmSync(dir, { recursive: true, force: true }) } catch { /* best-effort */ }
  }

  /** Map a rendition/asset file extension to its Content-Type. */
  static contentTypeFor(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'm3u8': return 'application/vnd.apple.mpegurl'
      case 'ts':   return 'video/mp2t'
      case 'mp4':  return 'video/mp4'
      case 'jpg':
      case 'jpeg': return 'image/jpeg'
      case 'webp': return 'image/webp'
      case 'png':  return 'image/png'
      default:     return 'application/octet-stream'
    }
  }

  // ── THUMBNAIL GENERATION ──────────────────────────────────────────────────

  /**
   * Extract a single poster frame from a video for the tray ring.
   * Degrades to a placeholder when ffmpeg is unavailable.
   */
  async extractPoster(inputPath: string): Promise<{ thumbnailUrl: string; previewUrl: string }> {
    if (!this.ffmpegAvailable) {
      return { thumbnailUrl: inputPath, previewUrl: inputPath }
    }

    const outputBase = path.join(TEMP_DIR, `poster-${crypto.randomUUID()}`)
    const thumbnailPath = `${outputBase}.jpg`
    const previewPath = `${outputBase}.webp`

    await this.runFfmpeg([
      '-i', inputPath,
      '-vframes', '1',
      '-vf', 'scale=480:480:force_original_aspect_ratio=decrease',
      '-q:v', '3',
      '-y',
      thumbnailPath,
    ])

    await this.runFfmpeg([
      '-i', inputPath,
      '-vf', 'scale=320:320:force_original_aspect_ratio=decrease,fps=10',
      '-vframes', '15',
      '-loop', '0',
      '-y',
      previewPath,
    ])

    return { thumbnailUrl: thumbnailPath, previewUrl: previewPath }
  }

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

  private checkBinary(name: string): boolean {
    try {
      const cmd = process.platform === 'win32' ? `where ${name}` : `which ${name}`
      execSync(cmd, { stdio: 'ignore', timeout: 2_000 })
      return true
    } catch {
      return false
    }
  }

  private async runFfmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] })
      let stderr = ''

      proc.stderr?.on('data', (chunk: Buffer) => { stderr += chunk.toString() })
      proc.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`))
      })
      proc.on('error', (err) => reject(new Error(`ffmpeg spawn failed: ${err.message}`)))
    })
  }
}
