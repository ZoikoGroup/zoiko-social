'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, MessageCircle, AtSign, Loader2 } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { useAuth } from '@/hooks/use-auth'
import { useMessaging } from '@/hooks/use-messaging'
import { getAuthToken } from '@/lib/auth'

interface NewMessageModalProps {
  open: boolean
  onClose: () => void
}

interface UserResult {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  isProfessional: boolean
  professionalCategory: string | null
}

export function NewMessageModal({ open, onClose }: NewMessageModalProps): React.JSX.Element | null {
  const router = useRouter()
  useAuth()
  const { openConversation } = useMessaging()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
    }, 0)
    setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [open])

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const token = await getAuthToken()
      const API_URL = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(
        `${API_URL}/api/v1/messaging/search/users?q=${encodeURIComponent(q)}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.ok) {
        const json = await res.json()
        setResults(json?.data ?? [])
        setSelectedIndex(-1)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => void searchUsers(value), 300)
    },
    [searchUsers],
  )

  const handleSelect = useCallback(
    async (userId: string) => {
      const conversationId = await openConversation(userId)
      if (conversationId) {
        onClose()
        router.push(`/messages?conversation=${conversationId}`)
      } else {
        // Message request was sent (private account)
        onClose()
        router.push('/messages')
      }
    },
    [openConversation, onClose, router],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex].id)
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [results, selectedIndex, handleSelect, onClose],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
          <h2 className="text-headline-sm font-bold text-on-surface">New Message</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-outline-variant/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or username…"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl text-label-md border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {query.length < 2 ? (
            <div className="px-5 py-8 text-center text-outline text-label-sm">
              Type at least 2 characters to search
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="px-5 py-8 text-center text-outline text-label-sm">
              No users found
            </div>
          ) : (
            results.map((user, index) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors cursor-pointer hover:bg-surface-container ${
                  index === selectedIndex ? 'bg-surface-container' : ''
                }`}
              >
                <UserAvatar
                  name={user.displayName}
                  image={user.avatarUrl ?? undefined}
                  size="md"
                  verified={user.isVerified}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-label-md font-semibold text-on-surface truncate">
                    {user.displayName}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 text-[11px] text-outline truncate">
                      <AtSign className="w-2.5 h-2.5" />
                      {user.username}
                    </span>
                    {user.isProfessional && user.professionalCategory && (
                      <span className="text-[9px] text-secondary font-bold uppercase px-1.5 py-0.5 bg-secondary/10 rounded-full flex-shrink-0">
                        {user.professionalCategory.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <MessageCircle className="w-4 h-4 text-outline flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
