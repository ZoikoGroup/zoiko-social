'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  PhoneOff, Phone, Mic, MicOff, Video, VideoOff, Loader2, Users,
} from 'lucide-react'
import type { RemoteAudioTrack } from 'livekit-client'
import { UserAvatar } from '@/components/UserAvatar'
import { useCall, type RemoteParticipantState } from '@/hooks/use-call'

/** mm:ss, or h:mm:ss once the call passes an hour (WhatsApp-style). */
function formatDuration(totalSeconds: number): string {
  const s = totalSeconds % 60
  const m = Math.floor(totalSeconds / 60) % 60
  const h = Math.floor(totalSeconds / 3600)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/** Hidden audio sink for one remote participant. */
function RemoteAudio({ track }: { track: RemoteAudioTrack }): React.JSX.Element {
  const ref = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    track.attach(el)
    return () => { track.detach(el) }
  }, [track])
  return <audio ref={ref} autoPlay />
}

/** One participant tile in the connected-video grid. */
function VideoTile({ participant }: { participant: RemoteParticipantState }): React.JSX.Element {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    const track = participant.videoTrack
    if (!el || !track) return undefined
    track.attach(el)
    return () => { track.detach(el) }
  }, [participant.videoTrack])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/5">
      {participant.videoTrack ? (
        <video ref={ref} autoPlay playsInline className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <UserAvatar name={participant.name} size="lg" />
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        {participant.name}
      </span>
    </div>
  )
}

/** Grid template by participant count. */
function gridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (count <= 4) return 'grid-cols-2'
  return 'grid-cols-2 sm:grid-cols-3'
}

/** Round control button used across the call bar. */
function ControlButton({
  onClick, active, danger, label, children,
}: {
  onClick: () => void
  active?: boolean
  danger?: boolean
  label: string
  children: React.ReactNode
}): React.JSX.Element {
  const tone = danger
    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
    : active
      ? 'bg-white text-[#07171b] hover:bg-white/90'
      : 'bg-white/15 text-white hover:bg-white/25'
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        aria-label={label}
        className={`flex size-[54px] items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90 ${tone}`}
      >
        {children}
      </button>
      <span className="text-[10.5px] font-medium text-white/60">{label}</span>
    </div>
  )
}

/**
 * Global call UI, driven entirely by the CallProvider (useCall). Renders nothing
 * when idle. WhatsApp-style layout (Zoiko theme): blurred-avatar backdrop for
 * audio, full-bleed video with a draggable self-view for video. Handles
 * outgoing / incoming / connecting / connected / ended for 1:1 AND group calls.
 */
export function CallModal(): React.JSX.Element | null {
  const {
    status, callInfo, endReason, isMuted, isCameraOff, duration,
    localVideoTrack, remoteParticipants,
    acceptCall, rejectCall, endCall, dismiss, toggleMute, toggleCamera,
  } = useCall()

  const localVideoRef = useRef<HTMLVideoElement>(null)

  // Auto-dismiss the ended screen.
  useEffect(() => {
    if (status !== 'ended') return
    const t = setTimeout(() => dismiss(), 2600)
    return () => clearTimeout(t)
  }, [status, dismiss])

  // ── Draggable self-view PIP position (null = default corner) ────────────────
  const [pip, setPip] = useState<{ x: number; y: number } | null>(null)
  const pipRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null)

  const onPipDown = useCallback((e: React.PointerEvent) => {
    const el = pipRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    dragOffset.current = { dx: e.clientX - r.left, dy: e.clientY - r.top }
    el.setPointerCapture(e.pointerId)
  }, [])
  const onPipMove = useCallback((e: React.PointerEvent) => {
    const d = dragOffset.current
    const el = pipRef.current
    if (!d || !el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const x = Math.min(Math.max(8, e.clientX - d.dx), window.innerWidth - w - 8)
    const y = Math.min(Math.max(8, e.clientY - d.dy), window.innerHeight - h - 8)
    setPip({ x, y })
  }, [])
  const onPipUp = useCallback((e: React.PointerEvent) => {
    dragOffset.current = null
    pipRef.current?.releasePointerCapture(e.pointerId)
  }, [])

  // Derived flags (safe before the early return via optional chaining below).
  const isVideo = callInfo?.callType === 'video'
  const isGroup = !!callInfo?.isGroup
  const isIncoming = status === 'incoming'
  const isRinging = status === 'outgoing'
  const isConnecting = status === 'connecting'
  const isConnected = status === 'connected'
  const isEnded = status === 'ended'

  const showVideoGrid = isVideo && isConnected && remoteParticipants.length > 0
  const showSelfCam = isVideo && !!localVideoTrack && !isCameraOff && !isIncoming && !isEnded
  // While ringing / connecting / connected-with-no-remote-yet, the self-cam
  // fills the screen (WhatsApp shows your own camera while the call connects).
  const selfFullscreen = showSelfCam && !showVideoGrid
  // Placement key so the attach effect re-runs when the element moves between
  // full-screen and PIP (same track reference, different DOM node).
  const localPlacement = !showSelfCam ? 'none' : selfFullscreen ? 'full' : 'pip'

  useEffect(() => {
    const el = localVideoRef.current
    if (!localVideoTrack || !el || localPlacement === 'none') return undefined
    localVideoTrack.attach(el)
    return () => { localVideoTrack.detach(el) }
  }, [localVideoTrack, localPlacement])

  if (status === 'idle' || !callInfo) return null

  const hasPhoto = !!callInfo.peerAvatar && !isGroup
  const callKindLabel = `${isGroup ? 'Group ' : ''}${isVideo ? 'video' : 'voice'} call`
  const statusText = isEnded
    ? (endReason ?? 'Call ended')
    : isIncoming
      ? `Incoming ${callKindLabel}…`
      : isRinging
        ? 'Ringing…'
        : isConnecting
          ? 'Connecting…'
          : formatDuration(duration)

  // The avatar/name overlay is hidden once we're showing full-bleed video.
  const showOverlayInfo = !showVideoGrid && !selfFullscreen

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-between overflow-hidden bg-[#040c0e] text-white">
      {/* ── Backdrop ── */}
      {selfFullscreen ? null : hasPhoto ? (
        <>
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl brightness-[0.35]"
            style={{ backgroundImage: `url("${callInfo.peerAvatar}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/80" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2328] via-[#07171b] to-[#040c0e]" />
      )}

      {/* Per-participant audio sinks (always mounted while tracks exist) */}
      {remoteParticipants.map((p) => (p.audioTrack ? <RemoteAudio key={p.id} track={p.audioTrack} /> : null))}

      {/* Connected video: remote participant grid */}
      {showVideoGrid && (
        <div className={`absolute inset-0 grid ${gridClass(remoteParticipants.length)} gap-2 bg-black p-2 pb-28`}>
          {remoteParticipants.map((p) => <VideoTile key={p.id} participant={p} />)}
        </div>
      )}

      {/* Self-view video: full-screen while connecting, draggable PIP once connected */}
      {showSelfCam && (
        <div
          ref={pipRef}
          onPointerDown={selfFullscreen ? undefined : onPipDown}
          onPointerMove={selfFullscreen ? undefined : onPipMove}
          onPointerUp={selfFullscreen ? undefined : onPipUp}
          className={
            selfFullscreen
              ? 'absolute inset-0 z-0 bg-black'
              : 'absolute z-20 h-40 w-28 cursor-grab touch-none overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-2xl active:cursor-grabbing md:h-48 md:w-36'
          }
          style={
            selfFullscreen
              ? undefined
              : pip
                ? { left: pip.x, top: pip.y }
                : { right: '1rem', top: 'calc(env(safe-area-inset-top) + 1rem)' }
          }
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full -scale-x-100 object-cover ${selfFullscreen ? '' : 'pointer-events-none'}`}
          />
        </div>
      )}

      {/* When self-cam is full-screen, a soft top/bottom scrim keeps text legible */}
      {selfFullscreen && (
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      )}

      {/* ── Top bar: call kind + live timer ── */}
      <div className="relative z-10 mt-[calc(env(safe-area-inset-top)+1.25rem)] flex flex-col items-center px-6 text-center">
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-1.5 text-[12px] font-semibold text-white/85 backdrop-blur-md">
          {isGroup ? <Users className="size-3.5" /> : isVideo ? <Video className="size-3.5" /> : <Phone className="size-3.5" />}
          {callKindLabel.charAt(0).toUpperCase() + callKindLabel.slice(1)}
          {isConnected && (
            <>
              <span className="size-1 rounded-full bg-white/40" />
              <span className="tabular-nums">{formatDuration(duration)}</span>
              {isGroup && (
                <>
                  <span className="size-1 rounded-full bg-white/40" />
                  <span>{remoteParticipants.length + 1} in call</span>
                </>
              )}
            </>
          )}
        </span>
        {/* Name + status shown on the top bar whenever the centre avatar is hidden */}
        {!showOverlayInfo && (
          <>
            <h2 className="mt-2 text-[16px] font-bold text-white drop-shadow">{callInfo.peerName}</h2>
            {!isConnected && (
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-white/75">
                {isConnecting && <Loader2 className="size-3.5 animate-spin" />}
                {statusText}
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Centre: avatar + name + status (audio / not-yet-video) ── */}
      {showOverlayInfo ? (
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <div className="relative flex items-center justify-center">
            {(isRinging || isIncoming) && (
              <>
                <span className="absolute size-40 animate-ping rounded-full bg-primary/25 [animation-duration:2s]" />
                <span className="absolute size-56 animate-ping rounded-full bg-primary/10 [animation-duration:2s] [animation-delay:0.4s]" />
              </>
            )}
            <div className={`relative rounded-full p-1.5 ${isConnected ? 'bg-gradient-to-br from-primary/70 to-emerald-400/50' : 'bg-white/10'}`}>
              <div className="rounded-full bg-[#07171b] p-1">
                {isGroup && !callInfo.peerAvatar ? (
                  <div className="flex size-28 items-center justify-center rounded-full bg-primary/15 sm:size-32">
                    <Users className="size-12 text-primary" />
                  </div>
                ) : (
                  <UserAvatar name={callInfo.peerName} image={callInfo.peerAvatar ?? undefined} size="xl" />
                )}
              </div>
            </div>
          </div>

          <h2 className="mt-7 text-[27px] font-bold tracking-tight text-white drop-shadow-sm">{callInfo.peerName}</h2>
          <p className={`mt-2 flex items-center gap-2 text-[14px] font-medium ${isEnded ? 'text-white/50' : 'text-white/75'}`}>
            {isConnecting && <Loader2 className="size-4 animate-spin" />}
            <span className={isConnected ? 'tabular-nums text-[17px] text-white/90' : ''}>{statusText}</span>
          </p>

          {isConnected && remoteParticipants.length > 0 && isGroup && (
            <div className="mt-5 flex max-w-sm flex-wrap items-center justify-center gap-2">
              {remoteParticipants.map((p) => (
                <span key={p.id} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 py-1 pl-1 pr-3 backdrop-blur-sm">
                  <UserAvatar name={p.name} size="xs" />
                  <span className="text-[12px] font-medium text-white/85">{p.name}</span>
                </span>
              ))}
            </div>
          )}

          {isEnded && duration > 0 && (
            <p className="mt-1 text-[12.5px] text-white/40 tabular-nums">Duration {formatDuration(duration)}</p>
          )}

          {isConnected && !isVideo && (
            <div className="mt-6 flex items-end gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1 animate-pulse rounded-full bg-primary/80"
                  style={{ height: `${10 + (i % 3) * 8}px`, animationDelay: `${i * 0.18}s`, animationDuration: '1.1s' }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div />
      )}

      {/* ── Bottom controls ── */}
      <div className="relative z-10 mb-[calc(env(safe-area-inset-bottom)+2rem)] flex flex-col items-center">
        {isEnded ? (
          <button
            onClick={dismiss}
            className="rounded-full border border-white/15 bg-white/10 px-8 py-3 text-[14px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
          >
            Close
          </button>
        ) : isIncoming ? (
          <div className="flex items-end gap-16">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={rejectCall}
                className="flex size-16 items-center justify-center rounded-full bg-red-500 text-white shadow-xl shadow-red-500/30 transition-all hover:bg-red-600 active:scale-90"
                aria-label="Decline call"
              >
                <PhoneOff className="size-7" />
              </button>
              <span className="text-[12px] font-medium text-white/60">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={acceptCall}
                className="relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 transition-all hover:brightness-110 active:scale-90"
                aria-label="Accept call"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:1.6s]" />
                {isVideo ? <Video className="relative size-7" /> : <Phone className="relative size-7" />}
              </button>
              <span className="text-[12px] font-medium text-white/60">{isGroup ? 'Join' : 'Accept'}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-4 rounded-[28px] border border-white/10 bg-black/35 px-5 py-3.5 shadow-2xl backdrop-blur-xl">
            <ControlButton onClick={toggleMute} active={isMuted} label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <MicOff className="size-[22px]" /> : <Mic className="size-[22px]" />}
            </ControlButton>

            {isVideo && (
              <ControlButton onClick={toggleCamera} active={isCameraOff} label={isCameraOff ? 'Camera on' : 'Camera off'}>
                {isCameraOff ? <VideoOff className="size-[22px]" /> : <Video className="size-[22px]" />}
              </ControlButton>
            )}

            <ControlButton onClick={endCall} danger label={isGroup && isConnected ? 'Leave' : 'End'}>
              <PhoneOff className="size-[22px]" />
            </ControlButton>
          </div>
        )}
      </div>
    </div>
  )
}
