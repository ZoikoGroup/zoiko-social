'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle2, Flag } from 'lucide-react'
import { moderationApi, ApiError, type ReportTargetType, type ReportReason } from '@/lib/api'
import { DocsHelpLink } from '@/components/DocsHelpLink'

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: 'spam', label: 'Spam', hint: 'Repetitive, unwanted, or fake engagement' },
  { value: 'harassment', label: 'Harassment or bullying', hint: 'Targeted abuse, threats, or intimidation' },
  { value: 'abuse', label: 'Abuse or violence', hint: 'Graphic, violent, or otherwise unsafe content' },
  { value: 'animal_welfare', label: 'Animal welfare concern', hint: 'Cruelty, neglect, or unsafe handling' },
  { value: 'impersonation', label: 'Impersonation', hint: 'Pretending to be someone or something else' },
  { value: 'other', label: 'Something else', hint: 'Doesn’t fit the categories above' },
]

const TARGET_LABELS: Record<ReportTargetType, string> = {
  post: 'post',
  comment: 'comment',
  message: 'message',
  user: 'account',
  story: 'story',
}

interface ReportContentModalProps {
  targetType: ReportTargetType
  targetId: string
  onClose: () => void
  onReported?: () => void
}

export function ReportContentModal({ targetType, targetId, onClose, onReported }: ReportContentModalProps): React.JSX.Element {
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(): Promise<void> {
    if (!reason || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await moderationApi.report(targetType, targetId, reason, note.trim() || undefined)
      setDone(true)
      onReported?.()
    } catch (e) {
      setError(
        e instanceof ApiError && e.code === 'ALREADY_REPORTED'
          ? 'You’ve already reported this.'
          : e instanceof Error ? e.message : 'Could not submit the report. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface flex items-center gap-2">
            <Flag className="w-4.5 h-4.5 text-error" />
            Report this {TARGET_LABELS[targetType]}
          </h2>
          <div className="flex items-center gap-1">
            <DocsHelpLink href="/docs/safety-and-trust#reporting" />
            <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
            <p className="text-label-md font-semibold text-on-surface">Report submitted</p>
            <p className="text-label-sm text-outline">
              Thanks for flagging this &mdash; our Trust &amp; Safety team will review it. The person you reported won&apos;t be notified.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 space-y-2 overflow-y-auto flex-1">
              <p className="text-label-sm text-outline mb-1">Why are you reporting this?</p>
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`w-full flex flex-col items-start gap-0.5 px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    reason === r.value
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="text-label-md font-semibold text-on-surface">{r.label}</span>
                  <span className="text-[11px] text-outline">{r.hint}</span>
                </button>
              ))}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Add any additional context (optional)"
                className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none resize-none"
              />
              {error && <p className="text-label-sm text-error">{error}</p>}
            </div>
            <div className="p-5 pt-0 flex-shrink-0">
              <button
                onClick={() => void submit()}
                disabled={!reason || submitting}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
