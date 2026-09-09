'use client'

/**
 * Verification requests, as a section of the single admin panel.
 *
 * Auth, the app Header and the page frame belong to the panel shell now.
 */

import { useCallback, useEffect, useState } from 'react'
import { BadgeCheck, Check, X, Loader2, FileText } from 'lucide-react'
import { verificationApi, type VerificationRequest } from '@/lib/api'
import { useDateFormat } from '@/hooks/use-date-format'

const STATUS_TABS = ['pending', 'approved', 'rejected'] as const

export function VerificationSection(): React.JSX.Element {
  const { date } = useDateFormat()
  const [status, setStatus] = useState<(typeof STATUS_TABS)[number]>('pending')
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [openingDoc, setOpeningDoc] = useState<string | null>(null)


  /**
   * Documents sit in a private bucket, so we exchange the id for a short-lived
   * signed URL at click time rather than rendering a permanent link.
   */
  const openDocument = async (documentId: string): Promise<void> => {
    setOpeningDoc(documentId)
    try {
      const url = await verificationApi.documentUrl(documentId)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      window.alert('Could not open that document. Please try again.')
    } finally {
      setOpeningDoc(null)
    }
  }

  const load = useCallback((s: string) => {
    setLoading(true)
    verificationApi.adminList(s)
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Deferred so state updates never run synchronously inside the effect body
    const timer = setTimeout(() => load(status), 0)
    return () => clearTimeout(timer)
  }, [status, load])

  const review = async (id: string, approved: boolean) => {
    const rejectionReason = approved ? undefined : window.prompt('Rejection reason (shown to the applicant):') ?? undefined
    if (!approved && rejectionReason === undefined) return
    setActingId(id)
    try {
      await verificationApi.adminReview(id, approved, rejectionReason)
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch {
      window.alert('Failed to review request. Please try again.')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-title-md font-bold flex items-center gap-2 mb-4">
        <BadgeCheck className="w-5 h-5 text-primary" /> Verification requests
      </h2>

          <div className="flex gap-2 mb-4">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-label-sm font-semibold capitalize transition-colors cursor-pointer ${
                  status === s ? 'bg-primary text-white' : 'bg-surface-container text-outline hover:bg-surface-container/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-outline" /></div>
          ) : requests.length === 0 ? (
            <p className="text-outline text-center py-12">No {status} requests.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="border border-outline-variant rounded-xl p-4 bg-surface">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.user?.displayName ?? 'Unknown user'}</span>
                    {r.user?.username && <span className="text-outline text-body-sm">@{r.user.username}</span>}
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase text-[10px]">
                      {r.categorySlug ?? r.type}
                    </span>
                  </div>
                  {r.notes && <p className="text-body-sm text-outline mt-1">{r.notes}</p>}
                  {r.documents.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {r.documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => void openDocument(doc.id)}
                          disabled={openingDoc === doc.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container text-label-sm text-outline hover:bg-surface-container/80 cursor-pointer disabled:opacity-50"
                        >
                          {openingDoc === doc.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <FileText className="w-3.5 h-3.5" />}
                          {doc.documentType}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-outline mt-2">{date(r.createdAt, 'dayMonthYearTime')}</p>

                  {status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        disabled={actingId === r.id}
                        onClick={() => review(r.id, true)}
                        className="px-3 py-1.5 rounded-lg text-label-sm font-semibold flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        disabled={actingId === r.id}
                        onClick={() => review(r.id, false)}
                        className="px-3 py-1.5 rounded-lg text-label-sm font-semibold flex items-center gap-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
    </div>
  )
}
