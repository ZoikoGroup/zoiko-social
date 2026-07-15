'use client'

import { useEffect, useRef } from 'react'
import {
  PhoneOff, Phone, Mic, MicOff, Video, VideoOff, Loader2, Users,
} from 'lucide-react'
import type { RemoteAudioTrack } from 'livekit-client'
import { UserAvatar } from '@/components/UserAvatar'
import { useCall, type RemoteParticipantState } from '@/hooks/use-call'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
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

/**
 * Global call UI, driven entirely by the CallProvider (useCall). Renders nothing
 * when idle. Handles outgoing, incoming, connecting, connected and ended states
 * for 1:1 AND group audio/video calls, attaching real LiveKit tracks.
 */
export function CallModal(): React.JSX.Element | null {
  const {
    status, callInfo, endReason, isMuted, isCameraOff, duration,
    localVideoTrack, remoteParticipants,
    acceptCall, rejectCall, endCall, dismiss, toggleMute, toggleCamera,
  } = useCall()

  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = localVideoRef.current
    if (!localVideoTrack || !el) return undefined
    localVideoTrack.attach(el)
    return () => { localVideoTrack.detach(el) }
  }, [localVideoTrack])

  // Auto-dismiss the ended screen.
  useEffect(() => {
    if (status !== 'ended') return
    const t = setTimeout(() => dismiss(), 2600)
    return () => clearTimeout(t)
  }, [status, dismiss])

  if (status === 'idle' || !callInfo) return null

  const isVideo = callInfo.callType === 'video'
  const isGroup = callInfo.isGroup
  const isIncoming = status === 'incoming'
  const isRinging = status === 'outgoing'
  const isConnecting = status === 'connecting'
  const isConnected = status === 'connected'
  const isEnded = status === 'ended'

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

  const showVideoGrid = isVideo && isConnected && remoteParticipants.length > 0

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#0a2328] via-[#07171b] to-[#040c0e]">
      {/* Ambient glow behind the avatar */}
      {!showVideoGrid && (
        <div className="pointer-events-none absolute left-1/2 top-[36%] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[110px]" />
      )}

      {/* Per-participant audio sinks (always mounted while tracks exist) */}
      {remoteParticipants.map((p) => (p.audioTrack ? <RemoteAudio key={p.id} track={p.audioTrack} /> : null))}

      {/* Connected video: participant grid */}
      {showVideoGrid && (
        <div className={`absolute inset-0 grid ${gridClass(remoteParticipants.length)} gap-2 p-3 pt-[calc(env(safe-area-inset-top)+4.25rem)] pb-[calc(env(safe-area-inset-bottom)+7.5rem)]`}>
          {remoteParticipants.map((p) => <VideoTile key={p.id} participant={p} />)}
        </div>
      )}

      {/* Self-view pip (video calls, once we have a local track) */}
      {isVideo && (isConnected || isConnecting) && localVideoTrack && !isCameraOff && (
        <div className="absolute right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-20 h-40 w-28 overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-2xl md:h-48 md:w-36">
          <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full -scale-x-100 object-cover" />
        </div>
      )}

      {/* Top bar — call type + status pill */}
      <div className="relative z-10 mt-[calc(env(safe-area-inset-top)+1.25rem)] flex flex-col items-center">
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/85 backdrop-blur-md">
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
        {showVideoGrid && (
          <h2 className="mt-2 text-[15px] font-bold text-white drop-shadow">{callInfo.peerName}</h2>
        )}
      </div>

      {/* Centre: avatar(s) + name + status */}
      {!showVideoGrid && (
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Pulsing rings while ringing */}
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
                  <div className="flex size-24 items-center justify-center rounded-full bg-primary/15 sm:size-28">
                    <Users className="size-11 text-primary" />
                  </div>
                ) : (
                  <UserAvatar name={callInfo.peerName} image={callInfo.peerAvatar ?? undefined} size="xl" />
                )}
              </div>
            </div>
          </div>

          <h2 className="mt-7 text-[26px] font-bold tracking-tight text-white">{callInfo.peerName}</h2>
          <p className={`mt-2 flex items-center gap-2 text-[14px] font-medium ${isEnded ? 'text-white/50' : 'text-primary-foreground/70'}`}>
            {isConnecting && <Loader2 className="size-4 animate-spin" />}
            <span className={isConnected ? 'tabular-nums text-[17px] text-white/90' : ''}>{statusText}</span>
          </p>

          {/* Connected group/audio: who's here */}
          {isConnected && remoteParticipants.length > 0 && (
            <div className="mt-5 flex max-w-sm flex-wrap items-center justify-center gap-2">
              {remoteParticipants.map((p) => (
                <span key={p.id} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 py-1 pl-1 pr-3 backdrop-blur-sm">
                  <UserAvatar name={p.name} size="xs" />
                  <span className="text-[12px] font-medium text-white/85">{p.name}</span>
                </span>
              ))}
            </div>
          )}

          {/* Ended summary */}
          {isEnded && duration > 0 && (
            <p className="mt-1 text-[12.5px] text-white/40 tabular-nums">Duration {formatDuration(duration)}</p>
          )}

          {/* Voice-activity dots while connected on audio calls */}
          {isConnected && !isVideo && (
            <div className="mt-5 flex items-end gap-1">
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
      )}
      {showVideoGrid && <div />}

      {/* Bottom control bar */}
      <div className="relative z-10 mb-[calc(env(safe-area-inset-bottom)+2rem)] flex flex-col items-center">
        {isEnded ? (
          <button
            onClick={dismiss}
            className="rounded-full border border-white/15 bg-white/10 px-8 py-3 text-[14px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
          >
            Close
          </button>
        ) : isIncoming ? (
          <div className="flex items-center gap-16">
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
                className="relative flex size-16 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/40 transition-all hover:bg-green-600 active:scale-90"
                aria-label="Accept call"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-green-500/40 [animation-duration:1.6s]" />
                <Phone className="relative size-7" />
              </button>
              <span className="text-[12px] font-medium text-white/60">{isGroup ? 'Join' : 'Accept'}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
            {/* Mute */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={toggleMute}
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all active:scale-90 ${
                  isMuted ? 'bg-white text-[#07171b]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="size-[22px]" /> : <Mic className="size-[22px]" />}
              </button>
              <span className="text-[10.5px] font-medium text-white/55">{isMuted ? 'Unmute' : 'Mute'}</span>
            </div>

            {/* Camera toggle (video calls only) */}
            {isVideo && (
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={toggleCamera}
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all active:scale-90 ${
                    isCameraOff ? 'bg-white text-[#07171b]' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
                >
                  {isCameraOff ? <VideoOff className="size-[22px]" /> : <Video className="size-[22px]" />}
                </button>
                <span className="text-[10.5px] font-medium text-white/55">Camera</span>
              </div>
            )}

            {/* End / leave */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={endCall}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-600 active:scale-90"
                aria-label={isGroup && isConnected ? 'Leave call' : 'End call'}
              >
                <PhoneOff className="size-[22px]" />
              </button>
              <span className="text-[10.5px] font-medium text-white/55">{isGroup && isConnected ? 'Leave' : 'End'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
