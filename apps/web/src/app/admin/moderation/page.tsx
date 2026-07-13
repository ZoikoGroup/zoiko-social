'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ShieldAlert, X, Trash2, AlertTriangle, Ban, Loader2, type LucideIcon } from 'lucide-react'
import { moderationApi, type ReportItem, type ResolveAction } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

const STATUS_TABS = ['open', 'actioned', 'dismissed'] as const

const ACTIONS: { action: ResolveAction; label: string; icon: LucideIcon; className: string }[] = [
  { action: 'dismiss', label: 'Dismiss', icon: X, className: 'bg-surface-container text-outline hover:bg-surface-container/80' },
  { action: 'remove_content', label: 'Remove content', icon: Trash2, className: 'bg-secondary/10 text-secondary hover:bg-secondary/20' },
  { action: 'warn', label: 'Warn user', icon: AlertTriangle, className: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' },
  { action: 'suspend', label: 'Suspend', icon: ShieldAlert, className: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20' },
  { action: 'ban', label: 'Ban', icon: Ban, className: 'bg-red-500/10 text-red-600 hover:bg-red-500/20' },
]

export default function AdminModerationPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated, profile } = useAuth()
  const [status, setStatus] = useState<(typeof STATUS_TABS)[number]>('open')
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)

  const isStaff = profile && ['admin', 'moderator', 'super_admin'].includes(profile.role)

  const load = useCallback((s: string) => {
    setLoading(true)
    moderationApi.queue(s)
      .then((p) => setReports(p.data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isStaff) return
    // Deferred so state updates never run synchronously inside the effect body
    const timer = setTimeout(() => load(status), 0)
    return () => clearTimeout(timer)
  }, [isStaff, status, load])

  const resolve = async (reportId: string, action: ResolveAction) => {
    if (action === 'ban' && !window.confirm('Ban this user? This is a serious action.')) return
    setActingId(reportId)
    try {
      await moderationApi.resolve(reportId, action)
      setReports((prev) => prev.filter((r) => r.id !== reportId))
    } catch {
      window.alert('Failed to resolve report. Please try again.')
    } finally {
      setActingId(null)
    }
  }

  if (authLoading) return <div className="min-h-screen bg-background" />

  if (!isAuthenticated || !isStaff) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-background flex items-center justify-center">
          <p className="text-outline">You don&apos;t have permission to view this page.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-title-lg font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" /> Moderation queue
            </h1>
            <Link href="/admin/verification" className="text-label-sm text-primary hover:underline">
              Verification requests →
            </Link>
          </div>

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
          ) : reports.length === 0 ? (
            <p className="text-outline text-center py-12">No {status} reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="border border-outline-variant rounded-xl p-4 bg-surface">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-label-sm">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase text-[10px]">
                          {r.targetType}
                        </span>
                        <span className="font-semibold uppercase text-[10px] text-outline">{r.reason}</span>
                      </div>
                      <p className="text-body-sm mt-1">
                        Reported by{' '}
                        <span className="font-semibold">{r.reporter?.displayName ?? 'Unknown user'}</span>
                        {r.reporter?.username ? ` (@${r.reporter.username})` : ''}
                      </p>
                      {r.note && <p className="text-body-sm text-outline mt-1">&ldquo;{r.note}&rdquo;</p>}
                      <p className="text-[11px] text-outline mt-1">
                        Target ID: {r.targetId} · {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {status === 'open' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ACTIONS.map(({ action, label, icon: Icon, className }) => (
                        <button
                          key={action}
                          disabled={actingId === r.id}
                          onClick={() => resolve(r.id, action)}
                          className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${className}`}
                        >
                          <Icon className="w-3.5 h-3.5" /> {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
