'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Type, Hash, AtSign, Smile, Clock, Calendar } from 'lucide-react'

export interface Sticker {
  id: string
  kind: string
  payload: Record<string, unknown>
  x: number
  y: number
}

interface StickerLayerProps {
  stickers: Sticker[]
  onAddSticker: (sticker: Sticker) => void
  onRemoveSticker: (id: string) => void
  onUpdateSticker: (id: string, sticker: Partial<Sticker>) => void
  background: string
}

const STICKER_TYPES = [
  { kind: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
  { kind: 'emoji', icon: <Smile className="w-4 h-4" />, label: 'Emoji' },
  { kind: 'mention', icon: <AtSign className="w-4 h-4" />, label: 'Mention' },
  { kind: 'hashtag', icon: <Hash className="w-4 h-4" />, label: 'Hashtag' },
  { kind: 'time', icon: <Clock className="w-4 h-4" />, label: 'Time' },
  { kind: 'date', icon: <Calendar className="w-4 h-4" />, label: 'Date' },
]

export function StickerLayer({
  stickers,
  onAddSticker,
  onRemoveSticker,
  onUpdateSticker,
}: StickerLayerProps): React.JSX.Element {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingText, setEditingText] = useState('')
  const [currentKind, setCurrentKind] = useState<string | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null)

  // Window-level drag listeners — always mounted; handlers check dragRef at runtime
  useEffect(() => {
    function handleMove(e: PointerEvent): void {
      if (!dragRef.current || !layerRef.current) return
      const rect = layerRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100
      onUpdateSticker(dragRef.current.id, {
        x: Math.max(0, Math.min(100, dragRef.current.origX + dx)),
        y: Math.max(0, Math.min(100, dragRef.current.origY + dy)),
      })
    }
    function handleUp(): void {
      dragRef.current = null
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [onUpdateSticker])

  const handleAddSticker = useCallback((kind: string) => {
    if (kind === 'text') {
      setCurrentKind('text')
      setEditingText('')
      return
    }
    if (kind === 'time') {
      onAddSticker({
        id: `st-${Date.now()}`,
        kind: 'time',
        payload: { format: 'short', tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
      setPickerOpen(false)
      return
    }
    if (kind === 'date') {
      onAddSticker({
        id: `st-${Date.now()}`,
        kind: 'date',
        payload: { format: 'short', tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
      setPickerOpen(false)
      return
    }
    if (kind === 'emoji') {
      onAddSticker({
        id: `st-${Date.now()}`,
        kind: 'emoji',
        payload: { emoji: '❤️' },
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
      setPickerOpen(false)
      return
    }
    if (kind === 'mention') {
      onAddSticker({
        id: `st-${Date.now()}`,
        kind: 'mention',
        payload: { userId: '', username: 'username' },
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
      setPickerOpen(false)
      return
    }
    if (kind === 'hashtag') {
      onAddSticker({
        id: `st-${Date.now()}`,
        kind: 'hashtag',
        payload: { tag: 'tag' },
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
      setPickerOpen(false)
      return
    }
    setPickerOpen(false)
  }, [onAddSticker])

  function confirmText(): void {
    if (!editingText.trim()) return
    onAddSticker({
      id: `st-${Date.now()}`,
      kind: 'text',
      payload: { text: editingText.trim(), font: 'Inter', color: '#ffffff', size: 24 },
      x: 20 + Math.random() * 30,
      y: 20 + Math.random() * 30,
    })
    setCurrentKind(null)
    setPickerOpen(false)
  }

  function handlePointerDown(e: React.PointerEvent, id: string): void {
    const rect = layerRef.current?.getBoundingClientRect()
    if (!rect) return
    const sticker = stickers.find((s) => s.id === id)
    if (!sticker) return
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: sticker.x,
      origY: sticker.y,
    }
  }

  function getStickerContent(s: Sticker): string {
    if (s.kind === 'text') return (s.payload.text as string) ?? ''
    if (s.kind === 'emoji') return (s.payload.emoji as string) ?? '❤️'
    if (s.kind === 'mention') return `@${(s.payload.username as string) ?? 'user'}`
    if (s.kind === 'hashtag') return `#${(s.payload.tag as string) ?? 'tag'}`
    if (s.kind === 'time') {
      return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
    if (s.kind === 'date') {
      return new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }
    return ''
  }

  return (
    <div className="absolute inset-0 z-[6]">
      {/* Sticker layer */}
      <div ref={layerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {stickers.map((s) => (
          <div
            key={s.id}
            className="absolute pointer-events-auto group cursor-grab active:cursor-grabbing"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onPointerDown={(e) => handlePointerDown(e, s.id)}
          >
            <div className="relative">
              <span
                className="block text-white drop-shadow-lg select-none"
                style={{
                  fontSize: s.kind === 'text' ? '24px' : s.kind === 'emoji' ? '36px' : '14px',
                  fontWeight: s.kind === 'text' ? 600 : 500,
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                {getStickerContent(s)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveSticker(s.id) }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Text input modal */}
      {currentKind === 'text' && (
        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center p-8" onClick={() => setCurrentKind(null)}>
          <div className="bg-neutral-900 rounded-xl p-4 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmText() }}
              placeholder="Type your text..."
              maxLength={200}
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-lg font-semibold text-center outline-none focus:ring-1 focus:ring-white/20 placeholder:text-white/30"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setCurrentKind(null)} className="flex-1 py-1.5 rounded-lg text-white/60 text-[13px] hover:bg-white/5 cursor-pointer">Cancel</button>
              <button onClick={confirmText} className="flex-1 py-1.5 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 cursor-pointer">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add sticker button — top-left, below the top bar (clear of bottom controls + right-side menus) */}
      <div className="absolute top-16 left-3 z-10">
        <div className="relative">
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm"
            title="Add sticker"
          >
            <Smile className="w-4 h-4" />
          </button>

          {pickerOpen && (
            <div className="absolute top-full mt-2 left-0 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-30">
              {STICKER_TYPES.map((st) => (
                <button
                  key={st.kind}
                  onClick={() => handleAddSticker(st.kind)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/5 text-[12px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {st.icon}
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
