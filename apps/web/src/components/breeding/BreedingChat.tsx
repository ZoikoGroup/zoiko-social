'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Send, Loader2, ShieldAlert, AlertTriangle } from 'lucide-react'
import { breedingApi, type BreedingMessage } from '@/lib/api'

/** Client-side heuristic so the composer can warn before sending. */
function quickFraudCheck(text: string): string | null {
  const lower = text.toLowerCase()
  if (/(?:\+?\d[\s-]?){10,}/.test(text)) return 'Avoid sharing phone numbers here'
  if (/\b(upi|gpay|paytm|phonepe|advance|deposit|token|otp|bank|account|ifsc)\b/.test(lower)) return 'Never pay in advance or share bank/OTP details'
  if (/\b(whatsapp|whats app|telegram|call me|my number|contact number)\b/.test(lower)) return 'Keep the conversation on ZoikoSocial'
  return null
}

/**
 * Private per-request chat between two pet owners discussing a breeding match.
 * Messages are fraud-scanned server-side; no phone/personal details needed.
 */
export function BreedingChat({ requestId, title, onClose }: { requestId: string; title: string; onClose: () => void }): React.JSX.Element {
  const [messages, setMessages] = useState<BreedingMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const composeWarning = input.trim() ? quickFraudCheck(input) : null

  useEffect(() => {
    let cancelled = false
    const load = (): void => {
      breedingApi.messages(requestId)
        .then((m) => { if (!cancelled) { setMessages(m); setLoading(false) } })
        .catch(() => { if (!cancelled) setLoading(false) })
    }
    load()
    const t = setInterval(load, 6000)
    return () => { cancelled = true; clearInterval(t) }
  }, [requestId])

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [messages])

  async function send(): Promise<void> {
    const body = input.trim()
    if (!body || sending) return
    setSending(true)
    try {
      await breedingApi.sendMessage(requestId, body)
      setInput('')
      const m = await breedingApi.messages(requestId)
      setMessages(m)
    } catch { /* ignore */ } finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md h-[80vh] max-h-[640px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-label-lg font-bold text-on-surface truncate">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex-shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-snug">
            Keep it on ZoikoSocial. Never pay in advance or share OTP/bank details. Insist on health records and meet in a safe place.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-surface-container-low/40">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : messages.length === 0 ? (
            <p className="text-label-sm text-outline text-center py-8">Start the conversation. Ask about health tests, temperament, and terms.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.mine ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-label-sm ${m.mine ? 'bg-primary text-white rounded-br-md' : 'bg-surface-container text-on-surface rounded-bl-md'}`}>{m.body}</div>
                {m.flagged && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 mt-0.5"><AlertTriangle className="w-2.5 h-2.5" />Flagged: looks like off-platform / payment request</span>
                )}
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-outline-variant/20 p-3 flex-shrink-0">
          {composeWarning && (
            <p className="flex items-center gap-1.5 text-[11px] text-amber-600 mb-1.5"><AlertTriangle className="w-3 h-3" />{composeWarning}</p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send() } }}
              maxLength={1000}
              rows={1}
              placeholder="Type a message…"
              className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none resize-none max-h-24"
            />
            <button onClick={send} disabled={sending || !input.trim()} className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex-shrink-0">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
