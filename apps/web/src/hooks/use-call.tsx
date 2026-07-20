'use client'

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ReactNode,
} from 'react'
import {
  Room, RoomEvent, Track,
  type LocalVideoTrack, type RemoteVideoTrack, type RemoteAudioTrack,
} from 'livekit-client'
import { getSocket } from '@/lib/socket'
import { getAuthToken } from '@/lib/auth'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { ringback, ringtone, playEndBlip, startVibration, stopVibration } from '@/lib/call-sounds'

// ── Types ────────────────────────────────────────────────────────────────────

export type CallType = 'audio' | 'video'
export type CallStatus = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'connected' | 'ended'

export interface CallInfo {
  conversationId: string
  /** DM: the other user. Group: the caller when incoming, null when outgoing. */
  peerUserId: string | null
  /** DM: the other user's name. Group: the conversation/group name. */
  peerName: string
  peerAvatar: string | null
  callType: CallType
  roomName: string
  /** true when we initiated the call, false when we're the callee */
  isCaller: boolean
  /** Group conversation call — invite fans out to all members */
  isGroup: boolean
}

/** One remote participant's live media state (group calls have many). */
export interface RemoteParticipantState {
  id: string
  name: string
  videoTrack: RemoteVideoTrack | null
  audioTrack: RemoteAudioTrack | null
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
  isGroup?: boolean
  conversationName?: string
}

interface CallContextValue {
  status: CallStatus
  callInfo: CallInfo | null
  endReason: string | null
  isMuted: boolean
  isCameraOff: boolean
  duration: number
  localVideoTrack: LocalVideoTrack | null
  remoteParticipants: RemoteParticipantState[]
  startCall: (args: {
    conversationId: string
    callType: CallType
    peerUserId?: string
    peerName?: string
    peerAvatar?: string | null
    isGroup?: boolean
    conversationName?: string
  }) => void
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
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipantState[]>([])

  const roomRef = useRef<Room | null>(null)
  // Monotonic call generation. Bumped on every teardown so an async connect that
  // was in flight when the call ended can detect it's stale and release its Room
  // (mic/camera) instead of leaving orphaned hardware live.
  const callEpochRef = useRef(0)
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Prefetched LiveKit token for an incoming call — resolves while the phone
  // "rings", so accepting only has to connect + enable the mic (faster pickup).
  const prefetchedTokenRef = useRef<Promise<{ token: string; url: string }> | null>(null)
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
      // Group signals omit toUserId — the gateway fans out to all members
      ...(info.peerUserId ? { toUserId: info.peerUserId } : {}),
      callType: info.callType,
      roomName: info.roomName,
      fromDisplayName: profile?.displayName,
      fromAvatarUrl: profile?.avatarUrl ?? null,
      isGroup: info.isGroup,
      ...(info.isGroup ? { conversationName: info.peerName } : {}),
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
    // Invalidate any in-flight connectRoom for the call being torn down so it
    // releases its Room instead of assigning it as the active one.
    callEpochRef.current++
    const room = roomRef.current
    roomRef.current = null
    if (room) {
      room.removeAllListeners()
      void room.disconnect()
    }
    setLocalVideoTrack(null)
    setRemoteParticipants([])
  }, [])

  /** Fully reset back to idle (called after the ended screen is dismissed). */
  const reset = useCallback(() => {
    clearRingTimer()
    teardownRoom()
    prefetchedTokenRef.current = null
    statusRef.current = 'idle' // keep the ref in lockstep so guards don't lag a commit
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
    statusRef.current = 'ended'
    setEndReason(reason)
    setStatus('ended')
  }, [clearRingTimer, teardownRoom])

  // Release the Room + media and stop all sounds if the provider unmounts mid-call
  // (e.g. logout or a navigation that unmounts the call layer). Without this the
  // LiveKit Room is never disconnected and the camera/mic hardware stays active.
  useEffect(() => {
    return () => {
      clearRingTimer()
      teardownRoom()
      ringback.stop()
      ringtone.stop()
      stopVibration()
    }
  }, [clearRingTimer, teardownRoom])

  // ── LiveKit connection ───────────────────────────────────────────────────────

  const attachRoomEvents = useCallback((room: Room) => {
    // Idempotent full resync from the room's live participant set — one code
    // path handles join, leave, and every track change, for 1:1 and group alike.
    const syncParticipants = () => {
      const list: RemoteParticipantState[] = []
      room.remoteParticipants.forEach((p) => {
        let videoTrack: RemoteVideoTrack | null = null
        let audioTrack: RemoteAudioTrack | null = null
        p.trackPublications.forEach((pub) => {
          const t = pub.track
          if (!t) return
          if (t.kind === Track.Kind.Video) videoTrack = t as RemoteVideoTrack
          else if (t.kind === Track.Kind.Audio) audioTrack = t as RemoteAudioTrack
        })
        list.push({ id: p.identity, name: p.name || p.identity, videoTrack, audioTrack })
      })
      setRemoteParticipants(list)
      if (list.length > 0 && (statusRef.current === 'outgoing' || statusRef.current === 'connecting')) {
        setStatus('connected')
      }
    }

    room
      .on(RoomEvent.ParticipantConnected, syncParticipants)
      .on(RoomEvent.TrackSubscribed, syncParticipants)
      .on(RoomEvent.TrackUnsubscribed, syncParticipants)
      .on(RoomEvent.TrackMuted, syncParticipants)
      .on(RoomEvent.TrackUnmuted, syncParticipants)
      .on(RoomEvent.ParticipantDisconnected, () => {
        syncParticipants()
        if (infoRef.current?.isGroup) {
          // Group: the call continues while anyone else is still in the room
          if (room.remoteParticipants.size === 0 && statusRef.current === 'connected') {
            finishCall('Call ended')
          }
        } else {
          // DM: the other party left → the call is over
          finishCall('Call ended')
        }
      })
      .on(RoomEvent.Disconnected, () => {
        if (statusRef.current !== 'ended') finishCall('Call ended')
      })

    syncParticipants()
  }, [finishCall])

  /** Mint a LiveKit access token for this conversation's call room. */
  const fetchToken = useCallback(async (conversationId: string): Promise<{ token: string; url: string }> => {
    if (!API_URL) throw new Error('API URL not configured')
    const authToken = await getAuthToken()
    const res = await fetch(`${API_URL}/api/v1/livekit/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ conversationId }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? body?.error?.message ?? `Token error (${res.status})`)
    }
    // The API wraps responses in a { success, data } envelope
    const json = await res.json() as { data?: { token?: string; url?: string }; token?: string; url?: string }
    const token = json.data?.token ?? json.token
    const url = json.data?.url ?? json.url
    if (!token || !url) throw new Error('Call service returned a malformed token response')
    return { token, url }
  }, [])

  const connectRoom = useCallback(async (info: CallInfo, prefetched?: Promise<{ token: string; url: string }> | null) => {
    // Snapshot the call generation. If the call is torn down (cancel/end/unmount)
    // during any await below, the epoch advances and we abandon the Room we built
    // instead of connecting/enabling media on a dead call — the bug that left the
    // mic/camera hardware indicator lit after hang-up.
    const epoch = callEpochRef.current
    const isStale = () => callEpochRef.current !== epoch

    // A failed prefetch falls back to a fresh mint
    const prefetchedCreds = prefetched ? await prefetched.catch(() => null) : null
    const { token, url } = prefetchedCreds ?? await fetchToken(info.conversationId)
    if (isStale()) return // call ended during token fetch — nothing built yet

    const room = new Room({ adaptiveStream: true, dynacast: true })
    // Release this Room without disturbing whatever is current (a later call may
    // already own roomRef after a rapid hang-up→redial).
    const abandon = () => {
      room.removeAllListeners()
      void room.disconnect()
      if (roomRef.current === room) roomRef.current = null
    }
    roomRef.current = room
    attachRoomEvents(room)
    await room.connect(url, token)
    if (isStale()) { abandon(); return }

    await room.localParticipant.setMicrophoneEnabled(true)
    if (isStale()) { abandon(); return }
    if (info.callType === 'video') {
      await room.localParticipant.setCameraEnabled(true)
      if (isStale()) { abandon(); return }
      const pub = room.localParticipant.getTrackPublication(Track.Source.Camera)
      setLocalVideoTrack((pub?.videoTrack as LocalVideoTrack | undefined) ?? null)
    }
  }, [attachRoomEvents, fetchToken])

  // ── Public actions ─────────────────────────────────────────────────────────

  const startCall = useCallback((args: {
    conversationId: string
    callType: CallType
    peerUserId?: string
    peerName?: string
    peerAvatar?: string | null
    isGroup?: boolean
    conversationName?: string
  }) => {
    if (statusRef.current !== 'idle') return
    statusRef.current = 'outgoing' // synchronous guard — a double-tap in the same frame is a no-op
    const isGroup = args.isGroup === true
    const info: CallInfo = {
      conversationId: args.conversationId,
      peerUserId: isGroup ? null : (args.peerUserId ?? null),
      peerName: isGroup ? (args.conversationName ?? 'Group call') : (args.peerName ?? 'Call'),
      peerAvatar: isGroup ? null : (args.peerAvatar ?? null),
      callType: args.callType,
      roomName: `call:${args.conversationId}`,
      isCaller: true,
      isGroup,
    }
    setCallInfo(info)
    setStatus('outgoing')

    // Signal the callee IMMEDIATELY — their phone starts ringing while we
    // connect to the media room in parallel (was sequential before, adding
    // seconds of dead time between pressing call and the other side ringing).
    emitSignal('call:invite', info)
    ringTimerRef.current = setTimeout(() => {
      if (statusRef.current === 'outgoing') {
        emitSignal('call:cancel', info, { reason: 'no_answer' })
        finishCall('No answer')
      }
    }, RING_TIMEOUT_MS)

    void (async () => {
      try {
        await connectRoom(info)
      } catch (err) {
        emitSignal('call:cancel', info, { reason: 'error' })
        toastError('Call failed', err instanceof Error ? err.message : 'Could not start the call')
        finishCall('Call failed')
      }
    })()
  }, [connectRoom, emitSignal, finishCall, toastError])

  const acceptCall = useCallback(() => {
    const info = infoRef.current
    if (!info || statusRef.current !== 'incoming') return
    statusRef.current = 'connecting' // synchronous guard against a double-tap accept
    clearRingTimer()
    setStatus('connecting')
    void (async () => {
      try {
        // Use the token prefetched while ringing (fast path)
        await connectRoom(info, prefetchedTokenRef.current)
        prefetchedTokenRef.current = null
        emitSignal('call:accept', info)
        // Caller is already in the room; reflect connected immediately.
        if (roomRef.current && roomRef.current.remoteParticipants.size > 0) setStatus('connected')
      } catch (err) {
        prefetchedTokenRef.current = null
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
    const next = !isCameraOff // next === true means "turning camera OFF"
    setIsCameraOff(next)
    void (async () => {
      try {
        const pub = await room.localParticipant.setCameraEnabled(!next)
        if (next) {
          // Camera OFF: null out the track so the eventual off→on is a real
          // null→track reference change. LiveKit can hand back the SAME track
          // object on re-enable; without this the CallModal attach effect (keyed
          // on the track reference) never re-fires for the remounted <video>
          // element and the preview stays blank after toggling off then on.
          setLocalVideoTrack(null)
        } else {
          const track = (pub?.videoTrack
            ?? room.localParticipant.getTrackPublication(Track.Source.Camera)?.videoTrack) as LocalVideoTrack | undefined
          setLocalVideoTrack(track ?? null)
        }
      } catch {
        // Enable/disable failed (permission revoked, device busy) — revert so the
        // button doesn't misreport the real camera state.
        setIsCameraOff(!next)
      }
    })()
  }, [isCameraOff])

  // ── Duration ticker ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (status !== 'connected') return
    const t = setInterval(() => setDuration((d) => d + 1), 1000)
    return () => clearInterval(t)
  }, [status])

  // ── Ringing sounds ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (status === 'outgoing') {
      ringback.start()
      return () => ringback.stop()
    }
    if (status === 'incoming') {
      ringtone.start()
      startVibration()
      return () => {
        ringtone.stop()
        stopVibration()
      }
    }
    if (status === 'ended') playEndBlip()
    return undefined
  }, [status])

  // ── Incoming-call socket listeners (global) ──────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    let cancelled = false

    const onInvite = (data: CallSignal) => {
      const current = statusRef.current
      // Genuinely busy only during an ACTIVE call. Previously any non-idle status
      // rejected the invite as busy, including the ~2.6s 'ended' summary window —
      // so a caller dialing right after the callee hung up got a false "busy".
      if (current === 'outgoing' || current === 'incoming' || current === 'connecting' || current === 'connected') {
        void getSocket().then((sock) => sock?.emit('call:reject', {
          conversationId: data.conversationId, toUserId: data.fromUserId, reason: 'busy',
        }))
        return
      }
      if (current === 'ended') reset() // a fresh invite supersedes the lingering summary
      const isGroup = data.isGroup === true
      setCallInfo({
        conversationId: data.conversationId,
        // Group incoming: peerUserId is the caller — accept/reject route back to them
        peerUserId: data.fromUserId,
        peerName: isGroup
          ? (data.conversationName ?? `${data.fromDisplayName ?? 'Group'} — group call`)
          : (data.fromDisplayName ?? 'Incoming call'),
        peerAvatar: isGroup ? null : (data.fromAvatarUrl ?? null),
        callType: data.callType,
        roomName: data.roomName,
        isCaller: false,
        isGroup,
      })
      setEndReason(null)
      setStatus('incoming')
      // Mint the media token while the phone rings — accepting is then instant
      const prefetch = fetchToken(data.conversationId)
      prefetch.catch(() => undefined) // silence unhandled rejection if the call is never accepted
      prefetchedTokenRef.current = prefetch
    }
    const onAccept = () => {
      // Callee accepted; their join fires ParticipantConnected → connected.
      clearRingTimer()
    }
    const onReject = (data: CallSignal) => {
      // Group: one member declining doesn't end the call — others may still join
      if (infoRef.current?.isGroup) return
      if (statusRef.current === 'outgoing') {
        finishCall(data.reason === 'busy' ? 'User is busy' : 'Call declined')
      }
    }
    const onCancelOrEnd = () => {
      if (statusRef.current === 'idle') return
      // Group: once connected, a member leaving is handled by the room events —
      // only a cancel while still ringing should tear the call down
      if (infoRef.current?.isGroup && statusRef.current === 'connected') return
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
  }, [isAuthenticated, user?.id, clearRingTimer, finishCall, fetchToken, reset])

  const value: CallContextValue = {
    status, callInfo, endReason, isMuted, isCameraOff, duration,
    localVideoTrack, remoteParticipants,
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
