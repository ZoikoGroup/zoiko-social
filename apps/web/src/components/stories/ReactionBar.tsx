'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { reactionsApi } from '@/lib/api'

const QUICK_EMOJIS = ['❤️', '😂', '😮', '😢', '👏', '🔥'] as const

interface ReactionBarProps {
  storyId: string
  authorId: string
  allowReplies: boolean
  onReply?: (message: string) => void
}

export function ReactionBar({ storyId, allowReplies }: ReactionBarProps): React.JSX.Element {
  // showEmojiPicker state reserved for future emoji picker expansion
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [lastReacted, setLastReacted] = useState<string | null>(null)

  async function sendEmoji(emoji: string): Promise<void> {
    if (sending) return
    setSending(true)
    setLastReacted(emoji)
    try {
      await reactionsApi.react(storyId, 'emoji', { emoji })
      setTimeout(() => setLastReacted(null), 300)
    } catch { /* ignore */ } finally {
      setSending(false)
    }
  }

  async function sendReply(): Promise<void> {
    const trimmed = replyText.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await reactionsApi.react(storyId, 'quick_reply', { message: trimmed })
      setReplyText('')
    } catch { /* ignore */ } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
      {/* Emoji quick reactions */}
      <div className="flex items-center gap-0.5">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => sendEmoji(emoji)}
            disabled={sending}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-lg transition-all duration-150 cursor-pointer
              ${lastReacted === emoji ? 'scale-125 bg-white/20' : 'hover:bg-white/10 hover:scale-110'}
              ${sending ? 'opacity-50' : ''}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Reply input */}
      {allowReplies && (
        <div className="flex items-center flex-1 gap-1 min-w-0">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendReply() }}
            placeholder="Send a message…"
            maxLength={200}
            className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/40 outline-none min-w-0"
          />
          {replyText.trim() && (
            <button
              onClick={sendReply}
              disabled={sending}
              className="p-1.5 rounded-full text-white/80 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
