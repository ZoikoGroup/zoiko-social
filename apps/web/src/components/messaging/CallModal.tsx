'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PhoneOff, Mic, MicOff, Volume2, VolumeX,
  Maximize2, Minimize2, X,
} from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'

interface CallModalProps {
  open: boolean
  type: 'audio' | 'video'
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  isOnline: boolean
  onClose: () => void
}

type CallState = 'ringing' | 'connecting' | 'connected' | 'ended'

export function CallModal({
  open,
  type,
  displayName,
  avatarUrl,
  isVerified,
  isOnline,
  onClose,
}: CallModalProps): React.JSX.Element | null {
  const [callState, setCallState] = useState<CallState>('ringing')
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)

  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ringingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      setCallState('ringing')
      setIsMuted(false)
      setIsSpeaker(false)
      setIsFullscreen(false)
      setCallDuration(0)
      setShowOverlay(false)
    }, 0)

    // Simulate connecting after a short ring
    ringingRef.current = setTimeout(() => {
      setCallState('connecting')
      // Simulate connection success
      setTimeout(() => {
        setCallState('connected')
      }, 1200)
    }, 2000)

    return () => {
      clearTimeout(timer)
      if (ringingRef.current) clearTimeout(ringingRef.current)
    }
  }, [open])

  // Track call duration when connected
  useEffect(() => {
    if (callState === 'connected') {
      durationRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (durationRef.current) {
        clearInterval(durationRef.current)
        durationRef.current = null
      }
    }
    return () => {
      if (durationRef.current) {
        clearInterval(durationRef.current)
        durationRef.current = null
      }
    }
  }, [callState])

  const handleEndCall = useCallback(() => {
    if (callState !== 'ended') {
      setCallState('ended')
      // Auto-close after showing ended state
      setTimeout(() => {
        setShowOverlay(true)
      }, 300)
    }
  }, [callState])

  const handleClose = useCallback(() => {
    if (durationRef.current) {
      clearInterval(durationRef.current)
      durationRef.current = null
    }
    if (ringingRef.current) {
      clearTimeout(ringingRef.current)
      ringingRef.current = null
    }
    onClose()
  }, [onClose])

  // Auto-close overlay click
  useEffect(() => {
    if (!showOverlay) return
    const t = setTimeout(() => {
      handleClose()
    }, 2000)
    return () => clearTimeout(t)
  }, [showOverlay, handleClose])

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!open) return null

  const isActive = callState === 'connected'
  const isRinging = callState === 'ringing'
  const isEnded = callState === 'ended'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isEnded ? 'bg-black/60' : isFullscreen ? 'bg-black' : 'bg-black/80'
        }`}
        onClick={() => { if (isEnded) handleClose() }}
      >
        {/* Close button (top-right) */}
        {!isEnded && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Fullscreen toggle */}
        {isActive && (
          <button
            onClick={() => setIsFullscreen((s) => !s)}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        )}

        {/* End overlay — shown after call ends */}
        {showOverlay && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 animate-in fade-in duration-300">
            <div className="text-center">
              <p className="text-white/60 text-label-md mb-1">Call ended</p>
              <p className="text-white/40 text-[11px]">
                Duration: <span className="text-white/60 font-semibold">{formatDuration(callDuration)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Avatar / video placeholder */}
          <div className={`transition-all duration-500 ${isFullscreen ? 'scale-75 translate-y-[-20%]' : ''}`}>
            {type === 'video' && isActive ? (
              <div className="relative w-72 h-96 md:w-96 md:h-[28rem] rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high overflow-hidden shadow-2xl border border-white/10">
                {/* Simulated video background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <UserAvatar name={displayName} image={avatarUrl ?? undefined} size="xl" verified={isVerified} />
                    <p className="text-white text-label-md font-semibold mt-3">{displayName}</p>
                    <p className="text-white/60 text-[11px] mt-1">Connected</p>
                  </div>
                </div>
                {/* Self-view pip */}
                <div className="absolute bottom-4 right-4 w-24 h-36 rounded-lg bg-surface-container-low border border-white/20 overflow-hidden shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-surface-container flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <UserAvatar name="" size="sm" />
                    </div>
                  </div>
                </div>
                {/* Video label */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] text-white/50 font-medium bg-black/30 px-2 py-1 rounded-md">
                    {isMuted ? <MicOff className="w-3 h-3 inline mr-1" /> : <Mic className="w-3 h-3 inline mr-1" />}
                    {formatDuration(callDuration)}
                  </span>
                </div>
              </div>
            ) : (
              <div className={`text-center transition-all duration-500 ${isEnded ? 'scale-90 opacity-50' : ''}`}>
                <div className={`relative ${isRinging ? 'animate-pulse' : ''}`}>
                  <div className={`${isRinging ? 'ringing-ring' : ''}`}>
                    <UserAvatar name={displayName} image={avatarUrl ?? undefined} size="xl" verified={isVerified} />
                  </div>
                  {isRinging && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
                  )}
                </div>
                <h2 className="text-white text-headline-md font-semibold mt-5">{displayName}</h2>
                <p className="text-white/60 text-label-sm mt-1.5">
                  {isEnded
                    ? 'Call ended'
                    : isRinging
                      ? isOnline
                        ? 'Ringing…'
                        : 'Calling…'
                      : callState === 'connecting'
                        ? 'Connecting…'
                        : formatDuration(callDuration)}
                </p>
                {isRinging && (
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:0s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Control buttons */}
          {!isEnded && (
            <div className={`flex items-center gap-4 md:gap-6 mt-8 md:mt-12 transition-all duration-300 ${isFullscreen ? 'translate-y-8' : ''}`}>
              {/* Mute */}
              <button
                onClick={() => setIsMuted((s) => !s)}
                className={`p-4 rounded-full transition-all duration-200 cursor-pointer ${
                  isMuted
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                }`}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* End call / Hang up */}
              {isActive ? (
                <button
                  onClick={handleEndCall}
                  className="p-4 md:p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="End call"
                >
                  <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="p-4 md:p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="End call"
                >
                  <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}

              {/* Speaker */}
              <button
                onClick={() => setIsSpeaker((s) => !s)}
                className={`p-4 rounded-full transition-all duration-200 cursor-pointer ${
                  isSpeaker
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                }`}
                aria-label={isSpeaker ? 'Speaker off' : 'Speaker'}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
