'use client'

/**
 * News curation and review, as a section of the single admin panel.
 *
 * Keeps its own role check: curating sources is admin-only on the server, so a
 * moderator gets the list and the review queue without controls that would 403.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  Newspaper, Plus, RefreshCw, Power, Trash2, Check, X, Loader2,
  AlertTriangle, ExternalLink, ShieldCheck,
} from 'lucide-react'
import {
  newsAdminApi,
  type NewsSourceItem,
  type PendingArticleItem,
  type IngestRunResult,
} from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useDateFormat } from '@/hooks/use-date-format'

/**
 * News curation and review.
 *
 * Two jobs that belong on one screen because they are the same job seen from
 * two ends: deciding which publishers may write into everyone's feed without
 * review, and reviewing what members submit by hand.
 *
 * The source list is the app's trust boundary — anything from an enabled source
 * publishes straight into the home feed — so it shows operational state
 * prominently. A feed that has been failing for a week otherwise looks exactly
 * like one that simply has no news.
 */

const TABS = ['sources', 'pending'] as const
type Tab = (typeof TABS)[number]

const TIERS = ['institutional', 'verified', 'community'] as const
const CATEGORIES = ['policy', 'science', 'rescue', 'health', 'climate', 'community'] as const

/** Blank form state, also used to reset after a successful add. */
const EMPTY_FORM = {
  name: '',
  slug: '',
  feedUrl: '',
  homepageUrl: '',
  tier: 'verified' as string,
  category: 'community' as string,
}

export function NewsSection(): React.JSX.Element {
  const { ago } = useDateFormat()
  const { profile } = useAuth()

  const [tab, setTab] = useState<Tab>('sources')
  const [sources, setSources] = useState<NewsSourceItem[]>([])
  const [pending, setPending] = useState<PendingArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastRun, setLastRun] = useState<IngestRunResult | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  // Curating sources is admin-only on the server; a moderator sees the list and
  // the review queue but not the controls that would 403.
  const canCurate = profile && ['admin', 'super_admin'].includes(profile.role)

  const load = useCallback((which: Tab) => {
    setLoading(true)
    setError(null)
    const request = which === 'sources' ? newsAdminApi.sources() : newsAdminApi.pending()
    request
      .then((data) => {
        if (which === 'sources') setSources(data as NewsSourceItem[])
        else setPending(data as PendingArticleItem[])
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Deferred so state updates never run synchronously inside the effect body
    const timer = setTimeout(() => load(tab), 0)
    return () => clearTimeout(timer)
  }, [tab, load])

  // ── Actions ────────────────────────────────────────────────────────────────

  const addSource = async () => {
    if (!form.name.trim() || !form.slug.trim() || !form.feedUrl.trim()) return
    setSaving(true)
    setError(null)
    try {
      await newsAdminApi.createSource({
        name: form.name.trim(),
        slug: form.slug.trim(),
        feedUrl: form.feedUrl.trim(),
        ...(form.homepageUrl.trim() ? { homepageUrl: form.homepageUrl.trim() } : {}),
        tier: form.tier,
        category: form.category,
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
      load('sources')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add source')
    } finally {
      setSaving(false)
    }
  }

  const runIngest = async (sourceId?: string) => {
    setBusyId(sourceId ?? 'all')
    setError(null)
    try {
      if (sourceId) {
        await newsAdminApi.ingestOne(sourceId)
      } else {
        setLastRun(await newsAdminApi.ingestAll())
      }
      load('sources')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ingest failed')
    } finally {
      setBusyId(null)
    }
  }

  const toggleEnabled = async (source: NewsSourceItem) => {
    setBusyId(source.id)
    try {
      if (source.enabled) await newsAdminApi.disableSource(source.id)
      else await newsAdminApi.updateSource(source.id, { enabled: true })
      load('sources')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change source')
    } finally {
      setBusyId(null)
    }
  }

  const removeSource = async (source: NewsSourceItem) => {
    // Its articles survive — the foreign key nulls the link rather than
    // cascading — but that is not obvious, so it is spelled out.
    if (!window.confirm(`Remove ${source.name}? Its ${source.articleCount} published articles stay.`)) return
    setBusyId(source.id)
    try {
      await newsAdminApi.deleteSource(source.id)
      load('sources')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not remove source')
    } finally {
      setBusyId(null)
    }
  }

  const review = async (article: PendingArticleItem, approve: boolean) => {
    setBusyId(article.id)
    try {
      await newsAdminApi.review(article.id, approve)
      setPending((prev) => prev.filter((a) => a.id !== article.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the decision')
    } finally {
      setBusyId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <h2 className="text-title-md font-bold flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-primary" /> News
      </h2>

          <div className="flex gap-2 mb-4">
            {TABS.map((s) => (
              <button
                key={s}
                onClick={() => setTab(s)}
                className={`px-3 py-1.5 rounded-full text-label-sm font-semibold capitalize transition-colors cursor-pointer ${
                  tab === s ? 'bg-primary text-white' : 'bg-surface-container text-outline hover:bg-surface-container/80'
                }`}
              >
                {s === 'pending' ? `Awaiting review${pending.length ? ` (${pending.length})` : ''}` : 'Sources'}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-500/10 text-red-600 text-label-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-outline" />
            </div>
          ) : tab === 'sources' ? (
            <>
              {canCurate && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add source
                  </button>
                  <button
                    onClick={() => void runIngest()}
                    disabled={busyId !== null || sources.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-sm font-semibold hover:bg-surface-container/80 disabled:opacity-50 cursor-pointer"
                  >
                    {busyId === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Fetch all now
                  </button>
                </div>
              )}

              {lastRun && (
                <p className="text-label-sm text-outline mb-4">
                  Last run: {lastRun.created} new {lastRun.created === 1 ? 'article' : 'articles'} from{' '}
                  {lastRun.sources} {lastRun.sources === 1 ? 'source' : 'sources'}
                  {/*
                    Reported because a run that creates nothing is not the same
                    as a run that did nothing — it may have withdrawn dead links
                    or replaced covers too small to render.
                  */}
                  {lastRun.removed > 0 && `, ${lastRun.removed} withdrawn`}
                  {lastRun.repaired > 0 && `, ${lastRun.repaired} ${lastRun.repaired === 1 ? 'cover' : 'covers'} replaced`}.
                </p>
              )}

              {showForm && canCurate && (
                <div className="p-4 mb-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/25 space-y-3">
                  {([
                    ['name', 'Name', 'Mongabay'],
                    ['slug', 'Slug', 'mongabay'],
                    ['feedUrl', 'Feed URL', 'https://news.mongabay.com/feed/'],
                    ['homepageUrl', 'Homepage (optional)', 'https://news.mongabay.com'],
                  ] as const).map(([key, label, placeholder]) => (
                    <label key={key} className="block">
                      <span className="block text-label-sm font-medium text-on-surface-variant mb-1">{label}</span>
                      <input
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded-lg bg-surface-container text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </label>
                  ))}

                  <div className="flex gap-3">
                    <label className="flex-1">
                      <span className="block text-label-sm font-medium text-on-surface-variant mb-1">
                        Trust tier
                      </span>
                      <select
                        value={form.tier}
                        onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-surface-container text-label-md cursor-pointer"
                      >
                        {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </label>
                    <label className="flex-1">
                      <span className="block text-label-sm font-medium text-on-surface-variant mb-1">Category</span>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-surface-container text-label-md cursor-pointer"
                      >
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                  </div>

                  {/* Said plainly, because it is the consequence people forget:
                      an enabled source needs no further approval. */}
                  <p className="text-label-sm text-outline">
                    Articles from an enabled source publish straight into everyone&apos;s feed without review.
                  </p>

                  <button
                    onClick={() => void addSource()}
                    disabled={saving || !form.name.trim() || !form.slug.trim() || !form.feedUrl.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Add source
                  </button>
                </div>
              )}

              {sources.length === 0 ? (
                <p className="text-label-md text-outline text-center py-10">
                  No sources yet. Nothing will be ingested until one is added.
                </p>
              ) : (
                <div className="space-y-2">
                  {sources.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/25"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-on-surface">{s.name}</span>
                            {s.tier !== 'community' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <ShieldCheck className="w-3 h-3" /> {s.tier}
                              </span>
                            )}
                            <span className="text-[11px] text-outline">{s.category}</span>
                            {!s.enabled && (
                              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-surface-container text-outline">
                                Disabled
                              </span>
                            )}
                          </div>
                          <a
                            href={s.feedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-label-sm text-outline hover:text-primary truncate max-w-full"
                          >
                            {s.feedUrl} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                          <p className="text-label-sm text-outline mt-1">
                            {s.articleCount} {s.articleCount === 1 ? 'article' : 'articles'}
                            {s.lastFetchedAt ? ` · last checked ${ago(s.lastFetchedAt)}` : ' · never fetched'}
                          </p>
                          {s.lastStatus === 'error' && (
                            <p className="flex items-start gap-1.5 text-label-sm text-red-600 mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              {s.lastError ?? 'Last fetch failed'}
                            </p>
                          )}
                        </div>

                        {canCurate && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => void runIngest(s.id)}
                              disabled={busyId !== null}
                              title="Fetch now"
                              aria-label={`Fetch ${s.name} now`}
                              className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container disabled:opacity-50 cursor-pointer"
                            >
                              {busyId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => void toggleEnabled(s)}
                              disabled={busyId !== null}
                              title={s.enabled ? 'Disable' : 'Enable'}
                              aria-label={s.enabled ? `Disable ${s.name}` : `Enable ${s.name}`}
                              className={`p-2 rounded-lg hover:bg-surface-container disabled:opacity-50 cursor-pointer ${
                                s.enabled ? 'text-emerald-600' : 'text-outline'
                              }`}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => void removeSource(s)}
                              disabled={busyId !== null}
                              title="Remove"
                              aria-label={`Remove ${s.name}`}
                              className="p-2 rounded-lg text-outline hover:text-red-600 hover:bg-surface-container disabled:opacity-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : pending.length === 0 ? (
            <p className="text-label-md text-outline text-center py-10">Nothing waiting on a decision.</p>
          ) : (
            <div className="space-y-2">
              {pending.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/25"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-medium text-on-surface-variant">{a.category}</span>
                    <span className="text-[11px] text-outline">
                      by {a.author?.displayName ?? 'unknown'} · {ago(a.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface">{a.title}</h3>
                  <p className="text-label-md text-on-surface-variant mt-1">{a.excerpt}</p>
                  {a.body && (
                    <p className="text-label-sm text-outline mt-2 line-clamp-6 whitespace-pre-wrap">{a.body}</p>
                  )}
                  {a.sourceUrl && (
                    <a
                      href={a.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-label-sm text-primary hover:underline mt-2"
                    >
                      Cited source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => void review(a, true)}
                      disabled={busyId !== null}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-label-sm font-semibold hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {busyId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Approve
                    </button>
                    <button
                      onClick={() => void review(a, false)}
                      disabled={busyId !== null}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-outline text-label-sm font-semibold hover:bg-surface-container/80 disabled:opacity-50 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                  {/* Rejection is not deletion, and the author can still see it. */}
                  <p className="text-[11px] text-outline mt-2">
                    A rejected article stays with its author and is not deleted.
                  </p>
                </div>
              ))}
            </div>
          )}
    </div>
  )
}
