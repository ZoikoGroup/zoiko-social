import { Injectable, Logger } from '@nestjs/common'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ConfigService } from '../config/config.service'

/**
 * Copies an article's cover image into our own storage.
 *
 * Why copy rather than hotlink: the app's Content-Security-Policy allows images
 * only from our own hosts, and next/image serves only allow-listed remotes.
 * Publishers are arbitrary hosts, so displaying their images directly would mean
 * opening both to the whole web — which drops a real XSS mitigation and turns
 * the image optimiser into an open proxy anyone can route traffic through.
 *
 * Copying once at ingest costs one fetch per article ever, serves from our own
 * CDN, and survives the publisher moving or deleting the file.
 *
 * The catch is that this fetches a URL chosen by a third party, so the address
 * checks below are not optional.
 */

const BUCKET = 'news-covers'
const MAX_BYTES = 3 * 1024 * 1024
const FETCH_TIMEOUT_MS = 10_000

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/**
 * Addresses the server must never be pointed at.
 *
 * Same defence as the push-subscription endpoints: loopback, private ranges,
 * link-local and — the one that actually matters on a cloud host — the metadata
 * address, which hands out credentials to anything that can reach it.
 */
const BLOCKED_HOST = [
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^\[?::1\]?$/,
  // IPv6 unique-local (fc00::/7). The hex-then-colon is load-bearing: matching
  // "starts with fc" alone also matches hosts like fcm.googleapis.com.
  /^\[?f[cd][0-9a-f]{0,2}:/i,
]

function isBlocked(host: string): boolean {
  return BLOCKED_HOST.some((re) => re.test(host))
}

@Injectable()
export class NewsCoverService {
  private readonly logger = new Logger(NewsCoverService.name)
  private readonly client: SupabaseClient | null

  constructor(private readonly config: ConfigService) {
    const url = this.config.supabaseUrl
    const key = this.config.supabaseServiceRoleKey
    this.client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
    if (!this.client) {
      this.logger.warn('Supabase storage not configured — news covers will not be mirrored')
    }
  }

  /**
   * Downloads a remote cover and returns OUR url for it, or null.
   *
   * Null is a perfectly good answer: an article without a picture is still an
   * article, and the card already has a no-cover state. Nothing here is allowed
   * to fail an ingest.
   */
  async mirror(remoteUrl: string, articleId: string): Promise<string | null> {
    if (!this.client) return null

    let parsed: URL
    try {
      parsed = new URL(remoteUrl)
    } catch {
      return null
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    if (isBlocked(parsed.hostname)) {
      this.logger.warn(`Refused cover from a blocked host: ${parsed.hostname}`)
      return null
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(parsed.toString(), {
        signal: controller.signal,
        // `redirect: 'follow'` is the default and is why the host is re-checked
        // below: a publisher URL that 302s to the metadata address would
        // otherwise walk straight past the check above.
        headers: { 'User-Agent': 'ZoikoSocialBot/1.0 (+https://zoikosocial.com)' },
      })
      if (!res.ok) return null

      const finalHost = new URL(res.url).hostname
      if (isBlocked(finalHost)) {
        this.logger.warn(`Refused cover after redirect to a blocked host: ${finalHost}`)
        return null
      }

      const type = (res.headers.get('content-type') ?? '').split(';')[0]?.trim().toLowerCase() ?? ''
      const ext = ALLOWED_TYPES[type]
      // Trusting the extension in the URL would let a publisher serve HTML as
      // "cover.jpg"; the declared type is what the browser will act on.
      if (!ext) return null

      const declared = Number(res.headers.get('content-length') ?? '0')
      if (declared > MAX_BYTES) return null

      const buffer = Buffer.from(await res.arrayBuffer())
      // Re-checked after download: content-length is a claim, not a guarantee.
      if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) return null

      const key = `${articleId}.${ext}`
      const { error } = await this.client.storage.from(BUCKET).upload(key, buffer, {
        contentType: type,
        // Re-ingesting the same article should replace its cover rather than
        // fail on a name that already exists.
        upsert: true,
        cacheControl: '2592000',
      })
      if (error) {
        this.logger.warn(`Cover upload failed for ${articleId}: ${error.message}`)
        return null
      }

      return this.client.storage.from(BUCKET).getPublicUrl(key).data.publicUrl
    } catch (e) {
      this.logger.warn(`Cover fetch failed: ${e instanceof Error ? e.message : 'unknown'}`)
      return null
    } finally {
      clearTimeout(timer)
    }
  }

  /** Removes a mirrored cover when its article goes. */
  async remove(articleId: string): Promise<void> {
    if (!this.client) return
    const keys = Object.values(ALLOWED_TYPES).map((ext) => `${articleId}.${ext}`)
    // Deleting a key that is not there is not an error, so one call covers
    // whichever extension the cover happened to use.
    await this.client.storage.from(BUCKET).remove(keys).catch(() => undefined)
  }
}
