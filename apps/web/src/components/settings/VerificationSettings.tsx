'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BadgeCheck, Clock, FileText, Loader2, Upload, X, AlertTriangle } from 'lucide-react'
import {
  verificationApi,
  type ProfessionalCategory,
  type VerificationRequest,
  type VerificationType,
} from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

/**
 * Professional verification, from the member's side.
 *
 * The review queue and the approval machinery already existed; this is the part
 * that was missing, so nothing ever reached a reviewer. A member picks what they
 * are verifying, attaches supporting documents, and can watch the request move
 * through review.
 *
 * Documents go straight from the browser into the PRIVATE verification-docs
 * bucket under the member's own {user_id}/verification/ prefix (the only place
 * storage RLS lets them write), and the API is told the storage key afterwards.
 * Nothing here ever holds a public URL to an identity document.
 */

const BUCKET = 'verification-docs'
const MAX_BYTES = 10 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf'

const TYPES: { value: VerificationType; label: string; blurb: string }[] = [
  { value: 'professional', label: 'Professional', blurb: 'Vet, groomer, trainer, seller or publisher' },
  { value: 'identity', label: 'Identity', blurb: 'Confirm you are who your profile says you are' },
  { value: 'organization', label: 'Organisation', blurb: 'Rescue, shelter, charity or clinic' },
]

const DOCUMENT_TYPES = [
  { value: 'id_document', label: 'Photo ID' },
  { value: 'business_licence', label: 'Business licence' },
  { value: 'professional_registration', label: 'Professional registration' },
  { value: 'proof_of_address', label: 'Proof of address' },
  { value: 'other', label: 'Other supporting document' },
]

const STATUS_TONE: Record<string, { label: string; className: string }> = {
  pending: { label: 'Awaiting review', className: 'bg-secondary/15 text-secondary' },
  under_review: { label: 'Under review', className: 'bg-secondary/15 text-secondary' },
  approved: { label: 'Approved', className: 'bg-emerald-500/15 text-emerald-600' },
  rejected: { label: 'Not approved', className: 'bg-red-500/15 text-red-600' },
}

export function VerificationSettings(): React.JSX.Element {
  const { user, profile } = useAuth()
  const toast = useToast()

  const [request, setRequest] = useState<VerificationRequest | null>(null)
  const [categories, setCategories] = useState<ProfessionalCategory[]>([])
  const [loading, setLoading] = useState(true)

  const [type, setType] = useState<VerificationType>('professional')
  const [categorySlug, setCategorySlug] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]!.value)
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [status, cats] = await Promise.all([
      verificationApi.myStatus().catch(() => null),
      verificationApi.categories().catch(() => [] as ProfessionalCategory[]),
    ])
    setRequest(status)
    setCategories(cats)
    setLoading(false)
  }, [])

  // Deferred so state updates never run synchronously inside the effect body
  // (same pattern as the admin review queue).
  useEffect(() => {
    const timer = setTimeout(() => void load(), 0)
    return () => clearTimeout(timer)
  }, [load])

  const alreadyVerified = profile?.verificationTier === 'professional'
  // A rejected request is not a dead end — the member can apply again.
  const canApply = !request || request.status === 'rejected'
  const isOpen = request !== null && (request.status === 'pending' || request.status === 'under_review')

  const submit = async (): Promise<void> => {
    if (type === 'professional' && !categorySlug) {
      toast.error('Pick a category', 'Professional verification needs the category you work in.')
      return
    }
    setSubmitting(true)
    try {
      const created = await verificationApi.submit({
        type,
        ...(type === 'professional' ? { categorySlug } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      })
      setRequest(created)
      setNotes('')
      toast.success('Request submitted', 'Attach your documents so a reviewer can confirm it.')
    } catch (e) {
      toast.error('Could not submit', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setSubmitting(false)
    }
  }

  const upload = async (file: File): Promise<void> => {
    if (!request || !user) return
    if (file.size > MAX_BYTES) {
      toast.error('File too large', 'Documents must be under 10 MB.')
      return
    }
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
      // First segment must be the member's own id — storage RLS enforces it.
      const key = `${user.id}/verification/${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
        cacheControl: 'no-store',
        upsert: false,
        ...(file.type ? { contentType: file.type } : {}),
      })
      if (error) throw new Error(error.message)

      // The API stores the KEY, not a URL — the bucket is private, so reviewers
      // get a short-lived signed URL instead.
      const doc = await verificationApi.uploadDocument({
        requestId: request.id,
        documentType,
        documentUrl: key,
        fileName: file.name,
        fileSize: file.size,
        ...(file.type ? { mimeType: file.type } : {}),
      })
      setRequest({ ...request, documents: [...request.documents, doc] })
      toast.success('Document attached', 'Only you and the reviewer can open it.')
    } catch (e) {
      toast.error('Upload failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const openDocument = async (documentId: string): Promise<void> => {
    try {
      const url = await verificationApi.documentUrl(documentId)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Could not open', 'Please try again in a moment.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {alreadyVerified && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
          <BadgeCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-label-md font-semibold text-on-surface">Your account is verified</p>
            <p className="text-label-sm text-outline mt-0.5">
              The badge shows on your profile, posts and messages.
            </p>
          </div>
        </div>
      )}

      {/* ── Existing request ─────────────────────────────────────────── */}
      {request && (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_TONE[request.status]?.className ?? 'bg-surface-container text-outline'}`}>
              {STATUS_TONE[request.status]?.label ?? request.status}
            </span>
            <span className="text-label-sm text-outline">
              {request.categorySlug ?? request.type} · submitted {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-label-sm text-on-surface">{request.rejectionReason}</p>
            </div>
          )}

          {isOpen && (
            <p className="flex items-center gap-1.5 text-label-sm text-outline mt-3">
              <Clock className="w-3.5 h-3.5" />
              A reviewer will look at this shortly. You&apos;ll be notified either way.
            </p>
          )}

          {request.documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {request.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => void openDocument(doc.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container text-label-sm text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-outline" />
                  {doc.fileName ?? doc.documentType}
                </button>
              ))}
            </div>
          )}

          {/* Documents can still be added while the request is open. */}
          {isOpen && (
            <div className="mt-4 pt-4 border-t border-outline-variant/20">
              <p className="text-label-sm font-semibold text-on-surface mb-2">Attach a document</p>
              <div className="flex flex-wrap gap-2">
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/40 text-label-sm text-on-surface cursor-pointer"
                >
                  {DOCUMENT_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading…' : 'Choose file'}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept={ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void upload(file)
                  }}
                />
              </div>
              <p className="text-[11px] text-outline mt-2">
                JPG, PNG, WebP or PDF, up to 10 MB. Stored privately — only you and the reviewer can open it.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── New request ──────────────────────────────────────────────── */}
      {canApply && !alreadyVerified && (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 space-y-4">
          <div>
            <p className="text-label-md font-semibold text-on-surface">
              {request ? 'Apply again' : 'Apply for verification'}
            </p>
            <p className="text-label-sm text-outline mt-0.5">
              Verified accounts get a badge, and professional categories unlock selling, publishing and bookings.
            </p>
          </div>

          <div className="space-y-2">
            {TYPES.map((t) => (
              <label
                key={t.value}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  type === t.value
                    ? 'bg-primary-container/50 border border-primary/20'
                    : 'bg-surface-container hover:bg-surface-container-high border border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="verification-type"
                  checked={type === t.value}
                  onChange={() => setType(t.value)}
                  className="mt-1 accent-primary cursor-pointer"
                />
                <span>
                  <span className="block text-label-sm font-semibold text-on-surface">{t.label}</span>
                  <span className="block text-[11px] text-outline">{t.blurb}</span>
                </span>
              </label>
            ))}
          </div>

          {type === 'professional' && (
            <div>
              <label htmlFor="verification-category" className="block text-label-sm font-semibold text-on-surface mb-1.5">
                Category
              </label>
              <select
                id="verification-category"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-label-sm text-on-surface cursor-pointer"
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="verification-notes" className="block text-label-sm font-semibold text-on-surface mb-1.5">
              Anything the reviewer should know <span className="font-normal text-outline">(optional)</span>
            </label>
            <textarea
              id="verification-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
              rows={3}
              placeholder="Clinic name, registration number, years practising…"
              className="w-full px-3 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-label-sm text-on-surface placeholder:text-outline resize-none"
            />
            <p className="text-[11px] text-outline mt-1 text-right">{notes.length}/1000</p>
          </div>

          <button
            onClick={() => void submit()}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      )}

      {request?.status === 'approved' && !alreadyVerified && (
        <p className="flex items-center gap-1.5 text-label-sm text-outline">
          <X className="w-3.5 h-3.5" />
          Approved — the badge may take a moment to appear on your profile.
        </p>
      )}
    </div>
  )
}
