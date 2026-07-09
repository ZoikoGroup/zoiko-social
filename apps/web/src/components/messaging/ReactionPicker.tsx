'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { EMOJI_CATEGORIES, searchEmojis, type EmojiCategory } from '@/lib/emojis'

interface ReactionPickerProps {
  /** Callback when an emoji is selected */
  onSelect: (emoji: string) => void
  /** Callback when the picker should close */
  onClose: () => void
  /** Position relative to the trigger element */
  position?: { x: number; y: number }
  /** Element whose bounds the picker must stay inside (e.g. the chat panel) */
  boundsEl?: HTMLElement | null
}

export function ReactionPicker({ onSelect, onClose, position, boundsEl }: ReactionPickerProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('smileys')
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search on mount
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Delay adding the listener to avoid the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Handle emoji click
  const handleEmojiClick = useCallback(
    (emoji: string) => {
      // Add to recent
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e !== emoji)
        return [emoji, ...filtered].slice(0, 20)
      })
      onSelect(emoji)
      onClose()
    },
    [onSelect, onClose],
  )

  // Filtered emojis based on search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null
    return searchEmojis(searchQuery)
  }, [searchQuery])

  const displayCategories = useMemo(() => {
    if (searchResults) return null
    const cats = [...EMOJI_CATEGORIES]
    // Insert recent category at the top if there are recent emojis
    if (recentEmojis.length > 0) {
      cats.unshift({ id: 'recent', label: 'Recent', emojis: recentEmojis })
    }
    return cats
  }, [searchResults, recentEmojis])

  // Get current category emojis
  const currentEmojis = useMemo(() => {
    if (searchResults) return searchResults
    const cats = displayCategories
    const cat = cats?.find((c) => c.id === activeCategory)
    return cat?.emojis ?? []
  }, [searchResults, displayCategories, activeCategory])

  // Adjust position to keep the picker fully inside the chat box (or, if no
  // bounds element is provided, inside the viewport).
  const adjustedStyle = useMemo<React.CSSProperties>(() => {
    if (!position || typeof window === 'undefined') return {}
    const MARGIN = 8
    const bounds = boundsEl?.getBoundingClientRect()
    const minX = bounds ? bounds.left + MARGIN : MARGIN
    const maxX = (bounds ? bounds.right : window.innerWidth) - MARGIN
    const minY = bounds ? bounds.top + MARGIN : MARGIN
    const maxY = (bounds ? bounds.bottom : window.innerHeight) - MARGIN

    const width = Math.min(360, maxX - minX)
    const height = Math.min(460, maxY - minY)
    const left = Math.max(minX, Math.min(position.x, maxX - width))
    const top = Math.max(minY, Math.min(position.y, maxY - height))
    return { left, top, width }
  }, [position, boundsEl])

  if (!position) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
        <div
          ref={pickerRef}
          className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-[380px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <PickerContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            currentEmojis={currentEmojis}
            displayCategories={displayCategories}
            searchResults={searchResults}
            onSelect={handleEmojiClick}
            onClose={onClose}
            searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={pickerRef}
      className="fixed z-50 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      style={adjustedStyle}
    >
      <PickerContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        currentEmojis={currentEmojis}
        displayCategories={displayCategories}
        searchResults={searchResults}
        onSelect={handleEmojiClick}
        onClose={onClose}
        searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
      />
    </div>
  )
}

interface PickerContentProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeCategory: string
  setActiveCategory: (id: string) => void
  currentEmojis: string[]
  displayCategories: EmojiCategory[] | null
  searchResults: string[] | null
  onSelect: (emoji: string) => void
  onClose: () => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
}

function PickerContent({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  currentEmojis,
  displayCategories,
  searchResults,
  onSelect,
  onClose,
  searchInputRef,
}: PickerContentProps): React.JSX.Element {
  return (
    <>
      {/* Header with search */}
      <div className="p-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-label-md font-semibold text-on-surface flex-1">Reactions</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emojis…"
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container rounded-lg text-[12px] border border-transparent focus:border-primary focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {displayCategories && !searchQuery && (
        <div className="flex gap-1 px-3 py-2 border-b border-outline-variant/10 overflow-x-auto no-scrollbar">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        {searchResults && searchResults.length === 0 && searchQuery.trim() ? (
          <div className="p-6 text-center">
            <p className="text-label-sm text-outline">No emojis found</p>
            <p className="text-[11px] text-outline mt-1">Try a different search term</p>
          </div>
        ) : currentEmojis.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-label-sm text-outline">No emojis</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-0.5 p-2">
            {currentEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onSelect(emoji)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-xl hover:bg-surface-container transition-colors cursor-pointer"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
