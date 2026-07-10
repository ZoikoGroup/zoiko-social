'use client'

import { useEffect, useRef } from 'react'
import {
  PhoneOff, Phone, Mic, MicOff, Video, VideoOff,
} from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { useCall } from '@/hooks/use-call'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * Global call UI, driven entirely by the CallProvider (useCall). Renders nothing
 * when idle. Handles outgoing, incoming, connecting, connected and ended states
 * for 1:1 audio/video calls, attaching real LiveKit tracks to media elements.
 */
export function CallModal(): React.JSX.Element | null {
  const {
    status, callInfo, endReason, isMuted, isCameraOff, duration,
    localVideoTrack, remoteVideoTrack, remoteAudioTrack,
    acceptCall, rejectCall, endCall, dismiss, toggleMute, toggleCamera,
  } = useCall()

  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)

  // Attach/detach LiveKit media tracks to the DOM elements.
  useEffect(() => {
    const el = remoteVideoRef.current
    if (!remoteVideoTrack || !el) return undefined
    remoteVideoTrack.attach(el)
    return () => { remoteVideoTrack.detach(el) }
  }, [remoteVideoTrack])

  useEffect(() => {
    const el = localVideoRef.current
    if (!localVideoTrack || !el) return undefined
    localVideoTrack.attach(el)
    return () => { localVideoTrack.detach(el) }
  }, [localVideoTrack])

  useEffect(() => {
    const el = remoteAudioRef.current
    if (!remoteAudioTrack || !el) return undefined
    remoteAudioTrack.attach(el)
    return () => { remoteAudioTrack.detach(el) }
  }, [remoteAudioTrack])

  // Auto-dismiss the ended screen.
  useEffect(() => {
    if (status !== 'ended') return
    const t = setTimeout(() => dismiss(), 2200)
    return () => clearTimeout(t)
  }, [status, dismiss])

  if (status === 'idle' || !callInfo) return null

  const isVideo = callInfo.callType === 'video'
  const isIncoming = status === 'incoming'
  const isRinging = status === 'outgoing'
  const isConnecting = status === 'connecting'
  const isConnected = status === 'connected'
  const isEnded = status === 'ended'

  const statusText = isEnded
    ? (endReason ?? 'Call ended')
    : isIncoming
      ? `Incoming ${isVideo ? 'video' : 'voice'} call`
      : isRinging
        ? 'Calling…'
        : isConnecting
          ? 'Connecting…'
          : formatDuration(duration)

  const showRemoteVideo = isVideo && isConnected && remoteVideoTrack

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Remote audio (always mounted while a remote audio track exists) */}
      <audio ref={remoteAudioRef} autoPlay />

      {/* Remote video fills the screen when connected */}
      {showRemoteVideo && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Dark gradient scrim over video for control legibility */}
      {showRemoteVideo && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      )}

      {/* Self-view pip (video calls, once we have a local track) */}
      {isVideo && (isConnected || isConnecting) && localVideoTrack && !isCameraOff && (
        <div className="absolute top-4 right-4 z-10 w-24 h-36 md:w-32 md:h-44 rounded-xl overflow-hidden border border-white/20 bg-surface-container-low shadow-lg">
          <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover -scale-x-100" />
        </div>
      )}

      {/* Centre content: avatar + name + status (hidden behind remote video only when connected video) */}
      {!showRemoteVideo && (
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className={isRinging || isIncoming ? 'ringing-ring' : ''}>
            <UserAvatar name={callInfo.peerName} image={callInfo.peerAvatar ?? undefined} size="xl" />
          </div>
          <h2 className="text-white text-headline-md font-semibold mt-5">{callInfo.peerName}</h2>
          <p className="text-white/60 text-label-sm mt-1.5">{statusText}</p>
          {(isRinging || isIncoming) && !isEnded && (
            <div className="flex items-center justify-center gap-1 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:0.3s]" />
            </div>
          )}
        </div>
      )}

      {/* Name + duration overlay for connected video calls */}
      {showRemoteVideo && (
        <div className="absolute top-5 left-0 right-0 z-10 flex flex-col items-center">
          <h2 className="text-white text-label-lg font-semibold drop-shadow">{callInfo.peerName}</h2>
          <p className="text-white/70 text-[11px] mt-0.5 drop-shadow">{formatDuration(duration)}</p>
        </div>
      )}

      {/* Controls */}
      {!isEnded && (
        <div className="absolute bottom-10 md:bottom-14 left-0 right-0 z-10 flex items-center justify-center gap-4 md:gap-6">
          {isIncoming ? (
            <>
              <button
                onClick={rejectCall}
                className="p-4 md:p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Decline call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                onClick={acceptCall}
                className="p-4 md:p-5 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Accept call"
              >
                <Phone className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              {/* Mute */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all cursor-pointer ${
                  isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                }`}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Camera toggle (video calls only) */}
              {isVideo && (
                <button
                  onClick={toggleCamera}
                  className={`p-4 rounded-full transition-all cursor-pointer ${
                    isCameraOff ? 'bg-white/15 text-white/60 hover:bg-white/25' : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                  }`}
                  aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
                >
                  {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              {/* End / hang up */}
              <button
                onClick={endCall}
                className="p-4 md:p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="End call"
              >
                <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
