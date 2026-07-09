'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import {
  ChevronLeft, Heart, Bookmark, Clock, BookOpen, ExternalLink, Trash2,
  BadgeCheck, ShieldCheck, Globe, Newspaper, MessageCircle, Send, Loader2,
} from 'lucide-react'
import { newsApi, type NewsArticle, type NewsComment } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

type Tier = 'institutional' | 'verified' | 'community'
const TIER_CONFIG: Record<Tier, { label: string; icon: typeof ShieldCheck; color: string; bgColor: string }> = {
  institutional: { label: 'Institutional', icon: ShieldCheck, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  verified:      { label: 'Verified',      icon: BadgeCheck,  color: 'text-secondary', bgColor: 'bg-amber-50 border-amber-200' },
  community:     { label: 'Community',      icon: Globe,       color: 'text-primary',   bgColor: 'bg-teal-50 border-teal-200' },
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user, profile } = useAuth()
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState<NewsComment[]>([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [commentsCursor, setCommentsCursor] = useState<string | null>(null)
  const [moreComments, setMoreComments] = useState(false)
  const [loadingMoreComments, setLoadingMoreComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [postingComment, setPostingComment] = useState(false)

  useEffect(() => {
    let cancelled = false
    newsApi.get(id)
      .then((a) => { if (cancelled) return; setArticle(a); setLiked(a.viewerLiked); setSaved(a.viewerSaved); setLikesCount(a.likesCount); setCommentsCount(a.commentsCount) })
      .catch(() => { if (!cancelled) setNotFound(true) })
    return () => { cancelled = true }
  }, [id])

  const loadComments = useCallback(() => {
    newsApi.comments(id).then((p) => { setComments(p.data); setCommentsCursor(p.nextCursor); setMoreComments(p.hasMore) }).catch(() => {})
  }, [id])
  useEffect(() => { const t = setTimeout(loadComments, 0); return () => clearTimeout(t) }, [loadComments])

  function loadMoreComments(): void {
    if (loadingMoreComments || !commentsCursor) return
    setLoadingMoreComments(true)
    newsApi.comments(id, commentsCursor)
      .then((p) => {
        setComments((prev) => {
          const seen = new Set(prev.map((c) => c.id))
          return [...prev, ...p.data.filter((c) => !seen.has(c.id))]
        })
        setCommentsCursor(p.nextCursor); setMoreComments(p.hasMore)
      })
      .catch(() => {})
      .finally(() => setLoadingMoreComments(false))
  }

  async function postComment(): Promise<void> {
    const body = newComment.trim()
    if (!body || postingComment) return
    setPostingComment(true)
    try {
      const c = await newsApi.addComment(id, body)
      setComments((prev) => [c, ...prev])
      setCommentsCount((n) => n + 1)
      setNewComment('')
    } catch { /* ignore */ } finally { setPostingComment(false) }
  }

  async function deleteComment(commentId: string): Promise<void> {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    setCommentsCount((n) => Math.max(0, n - 1))
    await newsApi.deleteComment(id, commentId).catch(() => {})
  }

  async function toggleLike(): Promise<void> {
    const next = !liked
    setLiked(next); setLikesCount((c) => c + (next ? 1 : -1))
    try { const r = await (next ? newsApi.like(id) : newsApi.unlike(id)); setLikesCount(r.likesCount) }
    catch { setLiked(!next); setLikesCount((c) => c + (next ? -1 : 1)) }
  }
  async function toggleSave(): Promise<void> {
    const next = !saved; setSaved(next)
    try { await (next ? newsApi.save(id) : newsApi.unsave(id)) } catch { setSaved(!next) }
  }
  async function remove(): Promise<void> {
    await newsApi.remove(id).catch(() => {})
    router.push('/news')
  }

  if (notFound) {
    return (<><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center"><Newspaper className="w-10 h-10 text-outline mx-auto mb-2" /><p className="text-label-md text-on-surface">Article not found</p>
      <Link href="/news" className="text-primary hover:underline text-label-sm">Back to News</Link></div></main></>)
  }
  if (!article) return <div className="min-h-screen bg-background" />

  const tier = TIER_CONFIG[(article.tier as Tier)] ?? TIER_CONFIG.community
  const TierIcon = tier.icon
  const isOwner = !!user && user.id === article.author.id

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-2 md:px-5 py-4 pb-24">
          <Link href="/news" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary mb-4"><ChevronLeft className="w-4 h-4" />Verified News</Link>

          <article className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
            {article.coverUrl && (
              <div className="w-full aspect-[16/9] bg-surface-container overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 md:p-7">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tier.bgColor} ${tier.color}`}>
                  <TierIcon className="w-3 h-3" />{tier.label}
                </span>
                <span className="text-[11px] text-outline capitalize">{article.category}</span>
              </div>

              <h1 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface leading-tight text-balance">{article.title}</h1>
              <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed">{article.excerpt}</p>

              <div className="flex items-center gap-3 mt-5 pb-5 border-b border-outline-variant/20">
                <Link href={`/profile/${article.author.username}`}><UserAvatar name={article.author.displayName} image={article.author.avatarUrl ?? undefined} size="md" verified={article.author.isVerified} /></Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${article.author.username}`} className="text-label-md font-semibold text-on-surface hover:underline">{article.author.displayName}</Link>
                  <div className="flex items-center gap-2 text-[11px] text-outline">
                    <span>{fmtDate(article.publishedAt)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /><BookOpen className="w-3 h-3" />{article.readMinutes} min read</span>
                  </div>
                </div>
                {isOwner && (
                  <button onClick={remove} className="p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer" aria-label="Delete article"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>

              <div className="prose-article mt-5 text-body-md text-on-surface leading-relaxed whitespace-pre-line">{article.body}</div>

              {article.sourceName && (
                <div className="mt-6 p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center gap-2 text-label-sm">
                  <span className="text-outline">Source:</span>
                  {article.sourceUrl ? (
                    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 font-medium">{article.sourceName}<ExternalLink className="w-3 h-3" /></a>
                  ) : (
                    <span className="text-on-surface font-medium">{article.sourceName}</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-outline-variant/20">
                <button onClick={toggleLike} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-label-sm font-semibold transition-colors cursor-pointer ${liked ? 'border-red-300 text-red-500 bg-red-50' : 'border-outline-variant/50 text-on-surface-variant hover:border-red-300 hover:text-red-500'}`}>
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />{likesCount > 0 ? likesCount.toLocaleString() : 'Like'}
                </button>
                <button onClick={toggleSave} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-label-sm font-semibold transition-colors cursor-pointer ${saved ? 'border-primary/40 text-primary bg-primary/10' : 'border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />{saved ? 'Saved' : 'Save'}
                </button>
                <span className="flex items-center gap-1.5 px-3 py-2 text-label-sm font-medium text-outline">
                  <MessageCircle className="w-4 h-4" />{commentsCount}
                </span>
              </div>
            </div>
          </article>

          {/* Comments */}
          <section className="mt-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 md:p-7">
            <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-4">
              <MessageCircle className="w-4 h-4 text-primary" />Comments ({commentsCount})
            </h2>

            {profile ? (
              <div className="flex items-start gap-2.5 mb-5">
                <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="sm" />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={2000}
                    rows={2}
                    placeholder="Add a comment…"
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button onClick={postComment} disabled={!newComment.trim() || postingComment}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer">
                      {postingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Comment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-label-sm text-outline mb-4">
                <Link href="/login" className="text-primary hover:underline">Sign in</Link> to join the conversation.
              </p>
            )}

            {comments.length === 0 ? (
              <p className="text-label-sm text-outline">No comments yet — be the first.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => {
                  const canDelete = !!user && (user.id === c.author.id || isOwner)
                  return (
                    <div key={c.id} className="flex items-start gap-2.5 group">
                      <Link href={`/profile/${c.author.username}`}><UserAvatar name={c.author.displayName} image={c.author.avatarUrl ?? undefined} size="sm" verified={c.author.isVerified} /></Link>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-2xl bg-surface-container px-3.5 py-2.5">
                          <div className="flex items-center gap-1">
                            <Link href={`/profile/${c.author.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{c.author.displayName}</Link>
                            {c.author.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
                          </div>
                          <p className="text-label-sm text-on-surface-variant leading-relaxed whitespace-pre-line mt-0.5">{c.body}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 px-1">
                          <span className="text-[11px] text-outline">{fmtDate(c.createdAt)}</span>
                          {canDelete && (
                            <button onClick={() => deleteComment(c.id)} className="text-[11px] text-outline hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1">
                              <Trash2 className="w-3 h-3" />Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {moreComments && (
              <div className="text-center pt-4">
                <button onClick={loadMoreComments} disabled={loadingMoreComments}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant/50 text-label-sm font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  {loadingMoreComments && <Loader2 className="w-4 h-4 animate-spin" />}Load more comments
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <MobileTabs currentPage="news" />
    </>
  )
}
