'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useMessaging } from '@/hooks/use-messaging'

interface MessageButtonProps {
  userId: string
  /** Optional initial message to send when creating the conversation */
  initialMessage?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Called after successfully opening/creating the conversation */
  onSuccess?: (conversationId: string) => void
}

export function MessageButton({
  userId,
  initialMessage,
  size = 'md',
  className = '',
  onSuccess,
}: MessageButtonProps): React.JSX.Element | null {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { openConversation } = useMessaging()
  const [busy, setBusy] = useState(false)

  const handleClick = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      const conversationId = await openConversation(userId, initialMessage)
      if (conversationId) {
        onSuccess?.(conversationId)
        router.push(`/messages?conversation=${conversationId}`)
      } else {
        // Message request was sent or error
        router.push('/messages')
      }
    } finally {
      setBusy(false)
    }
  }, [busy, openConversation, userId, initialMessage, onSuccess, router])

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-[11px] gap-1',
    md: 'px-3 py-2 text-label-sm gap-1.5',
    lg: 'px-4 py-2.5 text-label-md gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  // Don't render for own profile
  if (userId === user?.id || userId === profile?.id) return null

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`inline-flex items-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-semibold hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <MessageCircle className={iconSizes[size]} />
      {size !== 'sm' && <span>Message</span>}
    </button>
  )
}
