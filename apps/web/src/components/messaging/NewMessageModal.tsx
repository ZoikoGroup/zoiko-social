'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, MessageCircle, AtSign, Loader2, Users, Check } from 'lucide-react'
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

type Mode = 'dm' | 'group'

const MAX_GROUP_MEMBERS = 255

export function NewMessageModal({ open, onClose }: NewMessageModalProps): React.JSX.Element | null {
  const router = useRouter()
  useAuth()
  const { openConversation, createGroup } = useMessaging()
  const [mode, setMode] = useState<Mode>('dm')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  // Group mode state
  const [selected, setSelected] = useState<UserResult[]>([])
  const [groupName, setGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      setMode('dm')
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
      setSelected([])
      setGroupName('')
      setCreating(false)
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

  const handleSelectDM = useCallback(
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

  const toggleSelect = useCallback((u: UserResult) => {
    setSelected((prev) =>
      prev.some((s) => s.id === u.id)
        ? prev.filter((s) => s.id !== u.id)
        : prev.length >= MAX_GROUP_MEMBERS
          ? prev
          : [...prev, u],
    )
  }, [])

  const switchMode = useCallback((next: Mode) => {
    setMode(next)
    setQuery('')
    setResults([])
    setSelectedIndex(-1)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim() || selected.length === 0 || creating) return
    setCreating(true)
    const conversationId = await createGroup({
      name: groupName.trim(),
      participantIds: selected.map((u) => u.id),
    })
    setCreating(false)
    if (conversationId) {
      onClose()
      router.push(`/messages?conversation=${conversationId}`)
    }
  }, [groupName, selected, creating, createGroup, onClose, router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault()
        if (mode === 'group') {
          toggleSelect(results[selectedIndex])
        } else {
          handleSelectDM(results[selectedIndex].id)
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [results, selectedIndex, mode, toggleSelect, handleSelectDM, onClose],
  )

  if (!open) return null

  const canCreate = mode === 'group' && groupName.trim().length > 0 && selected.length > 0 && !creating

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="text-headline-sm font-bold text-on-surface">
            {mode === 'group' ? 'New Group' : 'New Message'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-5 pt-3 flex-shrink-0">
          <div className="flex gap-1 p-1 bg-surface-container rounded-full">
            <button
              onClick={() => switchMode('dm')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer ${
                mode === 'dm' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat
            </button>
            <button
              onClick={() => switchMode('group')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer ${
                mode === 'group' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Group
            </button>
          </div>
        </div>

        {/* Group name + selected member chips */}
        {mode === 'group' && (
          <div className="px-5 pt-3 flex-shrink-0 space-y-3">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value.slice(0, 100))}
              placeholder="Group name"
              className="w-full px-4 py-2.5 bg-surface-container rounded-xl text-label-md font-semibold border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selected.map((u) => (
                  <span
                    key={u.id}
                    className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 bg-primary/10 text-primary rounded-full text-[12px] font-medium"
                  >
                    <UserAvatar name={u.displayName} image={u.avatarUrl ?? undefined} size="xs" />
                    {u.displayName}
                    <button
                      onClick={() => toggleSelect(u)}
                      className="hover:text-on-surface transition-colors cursor-pointer"
                      aria-label={`Remove ${u.displayName}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="px-5 py-3 border-b border-outline-variant/10 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'group' ? 'Add people…' : 'Search by name or username…'}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl text-label-md border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {query.length < 2 ? (
            <div className="px-5 py-8 text-center text-outline text-label-sm">
              {mode === 'group' && selected.length > 0
                ? 'Search to add more people, or name your group and create'
                : 'Type at least 2 characters to search'}
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="px-5 py-8 text-center text-outline text-label-sm">
              No users found
            </div>
          ) : (
            results.map((user, index) => {
              const isSelected = selected.some((s) => s.id === user.id)
              return (
                <button
                  key={user.id}
                  onClick={() => (mode === 'group' ? toggleSelect(user) : handleSelectDM(user.id))}
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
                  {mode === 'group' ? (
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                  ) : (
                    <MessageCircle className="w-4 h-4 text-outline flex-shrink-0" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Create button (group mode) */}
        {mode === 'group' && (
          <div className="px-5 py-3 border-t border-outline-variant/20 flex-shrink-0">
            <button
              onClick={() => void handleCreateGroup()}
              disabled={!canCreate}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold transition-all cursor-pointer hover:bg-primary/90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Users className="w-4 h-4" />
              )}
              {creating
                ? 'Creating…'
                : `Create group${selected.length > 0 ? ` (${selected.length + 1})` : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
