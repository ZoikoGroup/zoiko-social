'use client'

/**
 * Verification requests — professional detailed review panel.
 *
 * Shows a list on the left. Clicking a request opens a full detail view
 * on the right with all applicant info, business details, and document
 * previews so admins can make an informed decision without leaving the page.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  BadgeCheck, Loader2, FileText, User, Building2, Phone,
  Mail, Globe, MapPin, Hash, ChevronRight, Clock, ExternalLink, AlertCircle,
  ShieldCheck, ShieldX,
} from 'lucide-react'
import { verificationApi, type VerificationRequest } from '@/lib/api'
import { useDateFormat } from '@/hooks/use-date-format'

const STATUS_TABS = ['pending', 'approved', 'rejected'] as const

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  product_seller:            { label: 'Product Seller',       color: 'text-blue-500 bg-blue-500/10' },
  pet_care_service_provider: { label: 'Pet Care Provider',    color: 'text-rose-500 bg-rose-500/10' },
  veterinarian:              { label: 'Veterinarian',         color: 'text-emerald-500 bg-emerald-500/10' },
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-outline-variant/20 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-outline" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-outline mb-0.5">{label}</p>
        <p className="text-body-sm font-medium text-on-surface break-all">{value}</p>
      </div>
    </div>
  )
}

function DocumentCard({
  doc,
  onOpen,
  loading,
}: {
  doc: VerificationRequest['documents'][0]
  onOpen: () => void
  loading: boolean
}) {
  const typeLabel = doc.documentType === 'government_id' ? 'Government ID' : 'Business / Professional License'

  return (
    <button
      onClick={onOpen}
      disabled={loading}
      className="w-full group flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container hover:border-primary/30 transition-all cursor-pointer disabled:opacity-60 text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        {loading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <FileText className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-label-sm font-semibold text-on-surface">{typeLabel}</p>
        <p className="text-[11px] text-outline mt-0.5 truncate">{doc.fileName ?? doc.documentType}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-outline group-hover:text-primary transition-colors flex-shrink-0" />
    </button>
  )
}

function RequestCard({
  r,
  selected,
  onClick,
}: {
  r: VerificationRequest
  selected: boolean
  onClick: () => void
}) {
  const cat = CATEGORY_LABELS[r.categorySlug ?? '']
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
        selected
          ? 'bg-primary/5 border-primary/40 shadow-sm'
          : 'bg-surface border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant/60'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-label-sm font-bold text-on-surface flex-shrink-0">
          {(r.user?.displayName ?? 'U').charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-label-md text-on-surface truncate">{r.user?.displayName ?? 'Unknown'}</span>
        <ChevronRight className={`w-3.5 h-3.5 ml-auto flex-shrink-0 transition-transform ${selected ? 'text-primary rotate-90' : 'text-outline'}`} />
      </div>
      <p className="text-[11px] text-outline mb-2 truncate">@{r.user?.username}</p>
      {cat && (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cat.color}`}>
          {cat.label}
        </span>
      )}
    </button>
  )
}

function DetailPanel({
  r,
  onReview,
  onRevoke,
  actingId,
}: {
  r: VerificationRequest
  onReview: (id: string, approved: boolean, reason?: string) => void
  onRevoke: (userId: string, reason?: string) => void
  actingId: string | null
}) {
  const { date } = useDateFormat()
  const [openingDoc, setOpeningDoc] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showRevokeForm, setShowRevokeForm] = useState(false)
  const [revokeReason, setRevokeReason] = useState('')

  const pro = r.user?.professionalProfile
  const cat = CATEGORY_LABELS[r.categorySlug ?? '']
  const isPending = r.status === 'pending'

  const openDocument = async (documentId: string) => {
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

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-5 border-b border-outline-variant/25 bg-surface-container-lowest/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-title-lg font-bold text-primary">
            {(r.user?.displayName ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-title-sm text-on-surface">{r.user?.displayName}</h3>
            <p className="text-body-sm text-outline">@{r.user?.username}</p>
          </div>
          {cat && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat.color}`}>
              {cat.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-outline">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Submitted {date(r.createdAt, 'dayMonthYearTime')}
          </span>
          <span className="text-outline-variant">·</span>
          <span className="font-mono opacity-60 truncate">ID: {r.id.slice(0, 8)}…</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Identity & Contact Info */}
        <section>
          <h4 className="text-label-sm font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Applicant Details
          </h4>
          <div className="rounded-xl border border-outline-variant/25 bg-surface divide-y divide-outline-variant/10 overflow-hidden">
            <DetailRow icon={User} label="Username" value={r.user?.username ? `@${r.user.username}` : null} />
            <DetailRow icon={Mail} label="Business Email" value={r.user?.professionalProfile?.businessEmail} />
          </div>
        </section>

        {/* Business / Professional Details */}
        {pro && (
          <section>
            <h4 className="text-label-sm font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Business / Professional Information
            </h4>
            <div className="rounded-xl border border-outline-variant/25 bg-surface divide-y divide-outline-variant/10 overflow-hidden">
              <DetailRow icon={Building2} label="Business Name" value={pro.businessName} />
              <DetailRow icon={Mail} label="Business Email" value={pro.businessEmail} />
              <DetailRow icon={Phone} label="Business Phone" value={pro.businessPhone} />
              <DetailRow icon={MapPin} label="Business Address" value={pro.businessAddress} />
              <DetailRow icon={Globe} label="Website" value={pro.websiteUrl} />
              <DetailRow icon={Hash} label="License / Registration Number" value={pro.licenseNumber} />
              <DetailRow icon={FileText} label="Description" value={pro.description} />
            </div>
          </section>
        )}

        {/* Documents */}
        <section>
          <h4 className="text-label-sm font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Submitted Documents
          </h4>
          {r.documents.length === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-600 text-label-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              No documents were attached to this request.
            </div>
          ) : (
            <div className="space-y-2">
              {r.documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  loading={openingDoc === doc.id}
                  onOpen={() => void openDocument(doc.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Applicant Notes */}
        {r.notes && (
          <section>
            <h4 className="text-label-sm font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Notes from Applicant
            </h4>
            <div className="p-3.5 rounded-xl border border-outline-variant/25 bg-surface">
              <p className="text-body-sm text-on-surface-variant leading-relaxed">{r.notes}</p>
            </div>
          </section>
        )}

        {/* Rejection reason (if already rejected) */}
        {r.status === 'rejected' && r.rejectionReason && (
          <section>
            <h4 className="text-label-sm font-bold uppercase tracking-wider text-red-500 mb-3 flex items-center gap-1.5">
              <ShieldX className="w-3.5 h-3.5" /> Rejection Reason
            </h4>
            <div className="p-3.5 rounded-xl border border-red-500/25 bg-red-500/5">
              <p className="text-body-sm text-red-600 leading-relaxed">{r.rejectionReason}</p>
            </div>
          </section>
        )}

        {r.status === 'approved' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span className="text-label-sm font-semibold">This account has been verified and approved.</span>
            </div>
            {showRevokeForm ? (
              <div className="space-y-2 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5">
                <p className="text-label-sm font-bold text-red-600">Revoke Verification</p>
                <textarea
                  rows={2}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Reason for revoking (shown to the user)…"
                  className="w-full px-3 py-2 rounded-xl border border-red-500/30 bg-surface text-body-sm text-on-surface resize-none focus:outline-none focus:border-red-500 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowRevokeForm(false); setRevokeReason('') }}
                    className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/50 text-label-sm font-semibold text-outline hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!revokeReason.trim() || actingId === r.userId}
                    onClick={() => { onRevoke(r.userId, revokeReason); setShowRevokeForm(false) }}
                    className="flex-1 px-3 py-2 rounded-xl bg-red-500 text-white text-label-sm font-bold flex items-center justify-center gap-1.5 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {actingId === r.userId ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldX className="w-4 h-4" />}
                    Confirm Revoke
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowRevokeForm(true)}
                className="w-full px-4 py-2.5 rounded-xl border border-red-500/30 text-red-600 text-label-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <ShieldX className="w-4 h-4" /> Revoke Verification
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      {isPending && (
        <div className="p-4 border-t border-outline-variant/25 bg-surface-container-lowest/80 space-y-3">
          {showRejectForm ? (
            <div className="space-y-2">
              <label className="text-label-sm font-semibold text-on-surface-variant block">
                Rejection reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. The uploaded document was blurry and unreadable. Please resubmit a clear photo."
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/50 bg-surface text-body-sm text-on-surface resize-none focus:outline-none focus:border-red-500 transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowRejectForm(false); setRejectionReason('') }}
                  className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/50 text-label-sm font-semibold text-outline hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!rejectionReason.trim() || actingId === r.id}
                  onClick={() => { onReview(r.id, false, rejectionReason); setShowRejectForm(false) }}
                  className="flex-1 px-3 py-2 rounded-xl bg-red-500 text-white text-label-sm font-bold flex items-center justify-center gap-1.5 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldX className="w-4 h-4" />}
                  Confirm Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                disabled={actingId === r.id}
                onClick={() => onReview(r.id, true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-label-md font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {actingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Approve Account
              </button>
              <button
                disabled={actingId === r.id}
                onClick={() => setShowRejectForm(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 text-label-md font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50 border border-red-500/20"
              >
                <ShieldX className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function VerificationSection(): React.JSX.Element {
  const [status, setStatus] = useState<(typeof STATUS_TABS)[number]>('pending')
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<VerificationRequest | null>(null)

  const load = useCallback((s: string) => {
    setLoading(true)
    setSelected(null)
    verificationApi.adminList(s)
      .then((reqs) => { setRequests(reqs); if (reqs.length > 0) setSelected(reqs[0] ?? null) })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => load(status), 0)
    return () => clearTimeout(timer)
  }, [status, load])

  const review = async (id: string, approved: boolean, reason?: string) => {
    if (!approved && !reason) return
    setActingId(id)
    try {
      await verificationApi.adminReview(id, approved, reason)
      setRequests((prev) => {
        const next = prev.filter((r) => r.id !== id)
        setSelected(next[0] ?? null)
        return next
      })
    } catch {
      window.alert('Failed to review request. Please try again.')
    } finally {
      setActingId(null)
    }
  }

  const revoke = async (userId: string, reason?: string) => {
    setActingId(userId)
    try {
      await verificationApi.revokeVerification(userId, reason)
      setRequests((prev) => {
        const next = prev.filter((r) => r.userId !== userId)
        setSelected(next[0] ?? null)
        return next
      })
    } catch {
      window.alert('Failed to revoke verification. Please try again.')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section header + tabs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-title-md font-bold flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-primary" /> Verification Requests
        </h2>
        <div className="flex gap-1.5">
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
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-outline" /></div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-outline gap-3">
          <BadgeCheck className="w-10 h-10 opacity-30" />
          <p className="text-body-md">No {status} verification requests.</p>
        </div>
      ) : (
        <div className="flex gap-4 flex-1 min-h-0" style={{ height: 'calc(100vh - 260px)' }}>
          {/* Left: List */}
          <div className="w-64 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
            {requests.map((r) => (
              <RequestCard
                key={r.id}
                r={r}
                selected={selected?.id === r.id}
                onClick={() => setSelected(r)}
              />
            ))}
          </div>

          {/* Right: Detail */}
          <div className="flex-1 rounded-2xl border border-outline-variant/30 bg-surface overflow-hidden">
            {selected ? (
              <DetailPanel r={selected} onReview={review} onRevoke={revoke} actingId={actingId} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-outline gap-3">
                <FileText className="w-10 h-10 opacity-30" />
                <p className="text-body-md">Select a request to review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
