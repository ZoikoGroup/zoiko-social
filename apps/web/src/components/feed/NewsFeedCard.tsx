'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart, MessageCircle, Bookmark, Share2, ExternalLink, ShieldCheck, Newspaper, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { newsApi, type NewsCardItem } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

/**
 * A news article in the home feed, shaped as a post.
 *
 * It used to be a deliberately different shape so nobody mistook an article for
 * something a person they follow wrote. The attribution row does that job on its
 * own — the source's name, its logo and a "verified source" badge say plainly
 * where this came from — so the card can otherwise behave like every other item
 * in the feed: liked, saved, commented on and shared with the same gestures.
 *
 * The cover is served from our own storage, copied at ingest. The publisher's
 * own URL would be refused by the app's image policy, so a card built on it
 * would show a broken frame.
 */

const CATEGORY_LABEL: Record<string, string> = {
  policy: 'Policy',
  science: 'Science',
  rescue: 'Rescue',
  health: 'Health',
  climate: 'Climate',
  community: 'Community',
}

/**
 * Only institutional and verified sourcing earns a badge. Marking "community"
 * too would make the badge meaningless — it exists to distinguish.
 */
const TIER_BADGE: Record<string, string> = {
  institutional: 'Institutional',
  verified: 'Verified source',
}

export function NewsFeedCard({ article }: { article: NewsCardItem }): React.JSX.Element {
  const toast = useToast()
  const [liked, setLiked] = useState(!!article.viewerLiked)
  const [likes, setLikes] = useState(article.likesCount)
  const [saved, setSaved] = useState(!!article.viewerSaved)
  const [busy, setBusy] = useState(false)

  const category = CATEGORY_LABEL[article.category] ?? article.category
  const badge = TIER_BADGE[article.tier]
  const sourceName = article.source?.name ?? article.sourceName ?? 'News'

  /*
    An ingested article has no stored body — the licence grants headline, excerpt
    and link, not the text — so the headline opens the publisher's own page. A
    member's article is read in-app.
  */
  const external = !!article.isExternal && !!article.sourceUrl
  const readProps = external
    ? { href: article.sourceUrl as string, target: '_blank', rel: 'noopener noreferrer' }
    : { href: `/news/${article.id}` }

  /**
   * Optimistic, then reconciled with what the server actually counted.
   *
   * A like that waits on a round-trip feels broken on a slow connection, and
   * this feed is already slower than it should be.
   */
  const toggleLike = async () => {
    if (busy) return
    setBusy(true)
    const next = !liked
    setLiked(next)
    setLikes((n) => n + (next ? 1 : -1))
    try {
      const res = next ? await newsApi.like(article.id) : await newsApi.unlike(article.id)
      setLiked(res.liked)
      setLikes(res.likesCount)
    } catch {
      // Put it back rather than leaving a count that never happened.
      setLiked(!next)
      setLikes((n) => n + (next ? -1 : 1))
      toast.error('Could not save that', 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const toggleSave = async () => {
    if (busy) return
    setBusy(true)
    const next = !saved
    setSaved(next)
    try {
      const res = next ? await newsApi.save(article.id) : await newsApi.unsave(article.id)
      setSaved(res.saved)
    } catch {
      setSaved(!next)
      toast.error('Could not save that', 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  /**
   * Shares the publisher's link for an ingested article, ours for a member's.
   *
   * Sharing our own URL for an external article would send people to a page
   * that only links onward — one hop of nothing.
   */
  const share = async () => {
    const url = external
      ? (article.sourceUrl as string)
      : `${window.location.origin}/news/${article.id}`
    try {
      // The native sheet where there is one; it is the expected gesture on a
      // phone and offers apps the clipboard cannot.
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('Link copied', 'Paste it anywhere you like.')
    } catch {
      // A dismissed share sheet lands here too, which is not a failure worth
      // reporting.
    }
  }

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl shadow-sm overflow-hidden">
      {/* Attribution — the row that keeps this honest about where it came from */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
          {article.source?.logoUrl ? (
            <Image src={article.source.logoUrl} alt="" width={40} height={40} className="object-cover" />
          ) : (
            <Newspaper className="w-5 h-5 text-primary" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[14.5px] font-semibold text-on-surface truncate">{sourceName}</span>
            {badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-outline">
            <span>{category}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readMinutes} min read
            </span>
            {external && (
              /* Said before the tap: nobody likes being thrown out of an app
                 without warning. */
              <span className="inline-flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Opens {sourceName}
              </span>
            )}
          </div>
        </div>
      </div>

      <Link {...readProps} className="block group">
        <div className="px-4 pt-3">
          <h3 className="text-[15px] font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-[13.5px] text-on-surface-variant leading-relaxed mt-1 line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        {article.coverUrl && (
          <div className="relative w-full aspect-[16/9] mt-3 bg-surface-container overflow-hidden">
            <Image
              src={article.coverUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        )}
      </Link>

      {/* Actions — the same set, in the same order, as a post */}
      <div className="flex items-center gap-1 px-2 py-1.5 mt-1 border-t border-outline-variant/20">
        <ActionButton
          onClick={() => void toggleLike()}
          active={liked}
          label={likes > 0 ? String(likes) : 'Like'}
          activeClass="text-red-500"
        >
          <Heart className={cn('w-[18px] h-[18px]', liked && 'fill-current')} />
        </ActionButton>

        <ActionButton
          href={`/news/${article.id}#comments`}
          label={article.commentsCount > 0 ? String(article.commentsCount) : 'Comment'}
        >
          <MessageCircle className="w-[18px] h-[18px]" />
        </ActionButton>

        <ActionButton onClick={() => void share()} label="Share">
          <Share2 className="w-[18px] h-[18px]" />
        </ActionButton>

        <div className="flex-1" />

        <ActionButton
          onClick={() => void toggleSave()}
          active={saved}
          label=""
          activeClass="text-primary"
        >
          <Bookmark className={cn('w-[18px] h-[18px]', saved && 'fill-current')} />
        </ActionButton>
      </div>
    </article>
  )
}

/** One action, as a button or a link depending on whether it navigates. */
function ActionButton({
  children,
  label,
  onClick,
  href,
  active,
  activeClass,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
  active?: boolean
  activeClass?: string
}): React.JSX.Element {
  const className = cn(
    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-label-sm font-medium transition-colors cursor-pointer',
    active ? activeClass : 'text-on-surface-variant hover:bg-surface-container',
  )
  const content = (
    <>
      {children}
      {label && <span>{label}</span>}
    </>
  )
  return href ? (
    <Link href={href} className={className}>{content}</Link>
  ) : (
    <button onClick={onClick} className={className}>{content}</button>
  )
}

/** Skeleton matching the card's shape, for the feed's loading state. */
export function NewsFeedCardSkeleton({ className }: { className?: string }): React.JSX.Element {
  return (
    <div className={cn('bg-surface-container-lowest border border-outline-variant/25 rounded-xl overflow-hidden', className)}>
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-32 bg-surface-container rounded animate-pulse" />
          <div className="h-2.5 w-24 bg-surface-container rounded animate-pulse" />
        </div>
      </div>
      <div className="px-4 space-y-2">
        <div className="h-4 w-3/4 bg-surface-container rounded animate-pulse" />
        <div className="h-3 w-full bg-surface-container rounded animate-pulse" />
      </div>
      <div className="w-full aspect-[16/9] mt-3 bg-surface-container animate-pulse" />
    </div>
  )
}
