'use client'

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ReactNode,
} from 'react'
import {
  Room, RoomEvent, Track,
  type RemoteTrack, type RemoteTrackPublication, type RemoteParticipant,
  type LocalVideoTrack, type RemoteVideoTrack, type RemoteAudioTrack,
} from 'livekit-client'
import { getSocket } from '@/lib/socket'
import { getAuthToken } from '@/lib/auth'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

// ── Types ────────────────────────────────────────────────────────────────────

export type CallType = 'audio' | 'video'
export type CallStatus = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'connected' | 'ended'

export interface CallInfo {
  conversationId: string
  peerUserId: string
  peerName: string
  peerAvatar: string | null
  callType: CallType
  roomName: string
  /** true when we initiated the call, false when we're the callee */
  isCaller: boolean
}

/** Signaling payload relayed by the messaging gateway. */
interface CallSignal {
  conversationId: string
  callType: CallType
  roomName: string
  fromUserId: string
  fromDisplayName?: string
  fromAvatarUrl?: string | null
  reason?: string
}

interface CallContextValue {
  status: CallStatus
  callInfo: CallInfo | null
  endReason: string | null
  isMuted: boolean
  isCameraOff: boolean
  duration: number
  localVideoTrack: LocalVideoTrack | null
  remoteVideoTrack: RemoteVideoTrack | null
  remoteAudioTrack: RemoteAudioTrack | null
  startCall: (args: { conversationId: string; peerUserId: string; peerName: string; peerAvatar: string | null; callType: CallType }) => void
  acceptCall: () => void
  rejectCall: () => void
  endCall: () => void
  dismiss: () => void
  toggleMute: () => void
  toggleCamera: () => void
}

const CallContext = createContext<CallContextValue | null>(null)

const API_URL = process.env.NEXT_PUBLIC_API_URL
const RING_TIMEOUT_MS = 30_000

// ── Provider ─────────────────────────────────────────────────────────────────

export function CallProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { user, profile, isAuthenticated } = useAuth()
  const { error: toastError } = useToast()

  const [status, setStatus] = useState<CallStatus>('idle')
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null)
  const [endReason, setEndReason] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [duration, setDuration] = useState(0)
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<RemoteVideoTrack | null>(null)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<RemoteAudioTrack | null>(null)

  const roomRef = useRef<Room | null>(null)
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Mirror live state for use inside stable socket callbacks (avoids stale closures).
  const infoRef = useRef<CallInfo | null>(null)
  const statusRef = useRef<CallStatus>('idle')
  useEffect(() => {
    infoRef.current = callInfo
    statusRef.current = status
  }, [callInfo, status])

  // ── Signaling helpers ──────────────────────────────────────────────────────

  const emitSignal = useCallback((event: string, info: CallInfo, extra?: { reason?: string }) => {
    void getSocket().then((s) => s?.emit(event, {
      conversationId: info.conversationId,
      toUserId: info.peerUserId,
      callType: info.callType,
      roomName: info.roomName,
      fromDisplayName: profile?.displayName,
      fromAvatarUrl: profile?.avatarUrl ?? null,
      ...extra,
    }))
  }, [profile?.displayName, profile?.avatarUrl])

  // ── Teardown ────────────────────────────────────────────────────────────────

  const clearRingTimer = useCallback(() => {
    if (ringTimerRef.current) {
      clearTimeout(ringTimerRef.current)
      ringTimerRef.current = null
    }
  }, [])

  const teardownRoom = useCallback(() => {
    const room = roomRef.current
    roomRef.current = null
    if (room) {
      room.removeAllListeners()
      void room.disconnect()
    }
    setLocalVideoTrack(null)
    setRemoteVideoTrack(null)
    setRemoteAudioTrack(null)
  }, [])

  /** Fully reset back to idle (called after the ended screen is dismissed). */
  const reset = useCallback(() => {
    clearRingTimer()
    teardownRoom()
    setStatus('idle')
    setCallInfo(null)
    setEndReason(null)
    setIsMuted(false)
    setIsCameraOff(false)
    setDuration(0)
  }, [clearRingTimer, teardownRoom])

  /** Move to the ended state (keeps callInfo so the modal can show a summary). */
  const finishCall = useCallback((reason: string) => {
    clearRingTimer()
    teardownRoom()
    setEndReason(reason)
    setStatus('ended')
  }, [clearRingTimer, teardownRoom])

  // ── LiveKit connection ───────────────────────────────────────────────────────

  const attachRoomEvents = useCallback((room: Room) => {
    const syncConnected = () => {
      if (room.remoteParticipants.size > 0) setStatus('connected')
    }

    room
      .on(RoomEvent.ParticipantConnected, () => {
        setStatus('connected')
      })
      .on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub: RemoteTrackPublication, _p: RemoteParticipant) => {
        if (track.kind === Track.Kind.Video) setRemoteVideoTrack(track as RemoteVideoTrack)
        else if (track.kind === Track.Kind.Audio) setRemoteAudioTrack(track as RemoteAudioTrack)
      })
      .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        if (track.kind === Track.Kind.Video) setRemoteVideoTrack((cur) => (cur === track ? null : cur))
        else if (track.kind === Track.Kind.Audio) setRemoteAudioTrack((cur) => (cur === track ? null : cur))
      })
      .on(RoomEvent.ParticipantDisconnected, () => {
        // Remote party left the room → the call is over.
        finishCall('Call ended')
      })
      .on(RoomEvent.Disconnected, () => {
        if (statusRef.current !== 'ended') finishCall('Call ended')
      })

    syncConnected()
  }, [finishCall])

  const connectRoom = useCallback(async (info: CallInfo) => {
    if (!API_URL) throw new Error('API URL not configured')
    const authToken = await getAuthToken()
    const res = await fetch(`${API_URL}/api/v1/livekit/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ conversationId: info.conversationId }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? body?.error?.message ?? `Token error (${res.status})`)
    }
    const { token, url } = await res.json() as { token: string; url: string }

    const room = new Room({ adaptiveStream: true, dynacast: true })
    roomRef.current = room
    attachRoomEvents(room)
    await room.connect(url, token)

    await room.localParticipant.setMicrophoneEnabled(true)
    if (info.callType === 'video') {
      await room.localParticipant.setCameraEnabled(true)
      const pub = room.localParticipant.getTrackPublication(Track.Source.Camera)
      setLocalVideoTrack((pub?.videoTrack as LocalVideoTrack | undefined) ?? null)
    }
  }, [attachRoomEvents])

  // ── Public actions ─────────────────────────────────────────────────────────

  const startCall = useCallback((args: { conversationId: string; peerUserId: string; peerName: string; peerAvatar: string | null; callType: CallType }) => {
    if (statusRef.current !== 'idle') return
    const info: CallInfo = {
      conversationId: args.conversationId,
      peerUserId: args.peerUserId,
      peerName: args.peerName,
      peerAvatar: args.peerAvatar,
      callType: args.callType,
      roomName: `call:${args.conversationId}`,
      isCaller: true,
    }
    setCallInfo(info)
    setStatus('outgoing')

    void (async () => {
      try {
        await connectRoom(info)
        emitSignal('call:invite', info)
        // Auto-cancel if unanswered.
        ringTimerRef.current = setTimeout(() => {
          if (statusRef.current === 'outgoing') {
            emitSignal('call:cancel', info, { reason: 'no_answer' })
            finishCall('No answer')
          }
        }, RING_TIMEOUT_MS)
      } catch (err) {
        toastError('Call failed', err instanceof Error ? err.message : 'Could not start the call')
        finishCall('Call failed')
      }
    })()
  }, [connectRoom, emitSignal, finishCall, toastError])

  const acceptCall = useCallback(() => {
    const info = infoRef.current
    if (!info || statusRef.current !== 'incoming') return
    clearRingTimer()
    setStatus('connecting')
    void (async () => {
      try {
        await connectRoom(info)
        emitSignal('call:accept', info)
        // Caller is already in the room; reflect connected immediately.
        if (roomRef.current && roomRef.current.remoteParticipants.size > 0) setStatus('connected')
      } catch (err) {
        toastError('Call failed', err instanceof Error ? err.message : 'Could not join the call')
        emitSignal('call:reject', info, { reason: 'error' })
        finishCall('Call failed')
      }
    })()
  }, [connectRoom, emitSignal, clearRingTimer, finishCall, toastError])

  const rejectCall = useCallback(() => {
    const info = infoRef.current
    if (info) emitSignal('call:reject', info, { reason: 'declined' })
    reset()
  }, [emitSignal, reset])

  const endCall = useCallback(() => {
    if (statusRef.current === 'ended' || statusRef.current === 'idle') { reset(); return }
    const info = infoRef.current
    const wasRinging = statusRef.current === 'outgoing'
    if (info) emitSignal(wasRinging ? 'call:cancel' : 'call:end', info)
    finishCall(wasRinging ? 'Call canceled' : 'Call ended')
  }, [emitSignal, finishCall, reset])

  /** Dismiss the ended screen and return to idle. */
  const dismiss = useCallback(() => reset(), [reset])

  const toggleMute = useCallback(() => {
    const room = roomRef.current
    if (!room) return
    const next = !isMuted
    setIsMuted(next)
    void room.localParticipant.setMicrophoneEnabled(!next)
  }, [isMuted])

  const toggleCamera = useCallback(() => {
    const room = roomRef.current
    if (!room) return
    const next = !isCameraOff
    setIsCameraOff(next)
    void room.localParticipant.setCameraEnabled(!next).then(() => {
      const pub = room.localParticipant.getTrackPublication(Track.Source.Camera)
      setLocalVideoTrack((pub?.videoTrack as LocalVideoTrack | undefined) ?? null)
    })
  }, [isCameraOff])

  // ── Duration ticker ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (status !== 'connected') return
    const t = setInterval(() => setDuration((d) => d + 1), 1000)
    return () => clearInterval(t)
  }, [status])

  // ── Incoming-call socket listeners (global) ──────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    let cancelled = false

    const onInvite = (data: CallSignal) => {
      // Ignore if already busy in another call.
      if (statusRef.current !== 'idle') {
        void getSocket().then((s) => s?.emit('call:reject', {
          conversationId: data.conversationId, toUserId: data.fromUserId, reason: 'busy',
        }))
        return
      }
      setCallInfo({
        conversationId: data.conversationId,
        peerUserId: data.fromUserId,
        peerName: data.fromDisplayName ?? 'Incoming call',
        peerAvatar: data.fromAvatarUrl ?? null,
        callType: data.callType,
        roomName: data.roomName,
        isCaller: false,
      })
      setEndReason(null)
      setStatus('incoming')
    }
    const onAccept = () => {
      // Callee accepted; their join fires ParticipantConnected → connected.
      clearRingTimer()
    }
    const onReject = (data: CallSignal) => {
      if (statusRef.current === 'outgoing') {
        finishCall(data.reason === 'busy' ? 'User is busy' : 'Call declined')
      }
    }
    const onCancelOrEnd = () => {
      if (statusRef.current === 'idle') return
      finishCall('Call ended')
    }

    getSocket().then((socket) => {
      if (cancelled || !socket) return
      socket.on('call:invite', onInvite)
      socket.on('call:accept', onAccept)
      socket.on('call:reject', onReject)
      socket.on('call:cancel', onCancelOrEnd)
      socket.on('call:end', onCancelOrEnd)
    })

    return () => {
      cancelled = true
      void getSocket().then((socket) => {
        socket?.off('call:invite', onInvite)
        socket?.off('call:accept', onAccept)
        socket?.off('call:reject', onReject)
        socket?.off('call:cancel', onCancelOrEnd)
        socket?.off('call:end', onCancelOrEnd)
      })
    }
  }, [isAuthenticated, user?.id, clearRingTimer, finishCall])

  const value: CallContextValue = {
    status, callInfo, endReason, isMuted, isCameraOff, duration,
    localVideoTrack, remoteVideoTrack, remoteAudioTrack,
    startCall, acceptCall, rejectCall, endCall, dismiss, toggleMute, toggleCamera,
  }

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  )
}

export function useCall(): CallContextValue {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used within a CallProvider')
  return ctx
}
