'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight,
  Trash2, Link2, BadgeCheck, PawPrint, HeartPulse, HandHeart, Info, MapPin, Bird, Flag,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { Img } from '../Img'
import { ShareModal } from './ShareModal'
import { LikersModal } from './LikersModal'
import { postsApi, moderationApi, type PostItem } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

// Short verified-badge label derived from the author's professional category.
const CATEGORY_BADGE: Record<string, string> = {
  veterinarian: 'Verified Vet',
  verified_news_publisher: 'Verified News',
  pet_care_service_provider: 'Verified Pro',
  product_seller: 'Verified Seller',
}
function verifiedBadge(isVerified: boolean, category: string | null): string | null {
  if (!isVerified) return null
  return (category && CATEGORY_BADGE[category]) || 'Verified'
}

function InfoRow({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-start gap-2 text-[12px] leading-snug">
      <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-outline font-medium flex-shrink-0">{label}:</span>
      <span className="text-on-surface">{value}</span>
    </div>
  )
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 604800) return `${Math.floor(s / 86400)}d`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Linkify @mentions and #hashtags in captions. */
function Caption({ text }: { text: string }): React.JSX.Element {
  const parts = text.split(/(@[a-z0-9._]{3,30}|#[\p{L}\p{N}_]{1,50})/gu)
  return (
    <span className="whitespace-pre-line">
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          return (
            <Link key={i} href={`/profile/${part.slice(1)}`} className="text-primary font-semibold hover:underline">
              {part}
            </Link>
          )
        }
        if (part.startsWith('#')) {
          return (
            <Link key={i} href={`/explore/tags/${encodeURIComponent(part.slice(1))}`} className="text-primary hover:underline">
              {part}
            </Link>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

interface PostCardProps {
  post: PostItem
  onDeleted?: (postId: string) => void
  onShareToStory?: (refType: string, refId: string) => void
}

export function PostCard({ post, onDeleted, onShareToStory }: PostCardProps): React.JSX.Element {
  const router = useRouter()
  const { user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const [liked, setLiked] = useState(post.viewerLiked)
  const [saved, setSaved] = useState(post.viewerSaved)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [slide, setSlide] = useState(0)
  const [heartBurst, setHeartBurst] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [likersOpen, setLikersOpen] = useState(false)
  const [reported, setReported] = useState(false)
  const lastTap = useRef(0)

  const isOwn = user?.id === post.author.id
  const badge = verifiedBadge(post.author.isVerified, post.author.professionalCategory)
  const meta = post.metadata

  async function toggleLike(forceLike = false): Promise<void> {
    if (forceLike && liked) return
    const next = forceLike ? true : !liked
    // Optimistic
    setLiked(next)
    setLikesCount((c) => c + (next ? 1 : -1))
    try {
      const result = next ? await postsApi.like(post.id) : await postsApi.unlike(post.id)
      setLikesCount(result.likesCount)
    } catch {
      setLiked(!next)
      setLikesCount((c) => c + (next ? -1 : 1))
    }
  }

  function handleMediaTap(): void {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      // Double tap — like with heart burst
      setHeartBurst(true)
      setTimeout(() => setHeartBurst(false), 800)
      void toggleLike(true)
    }
    lastTap.current = now
  }

  async function toggleSave(): Promise<void> {
    const next = !saved
    setSaved(next)
    try {
      if (next) await postsApi.save(post.id)
      else await postsApi.unsave(post.id)
    } catch {
      setSaved(!next)
    }
  }

  async function copyLink(): Promise<void> {
    try {
      const { url } = await postsApi.share(post.id, 'link')
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  async function deletePost(): Promise<void> {
    try {
      await postsApi.delete(post.id)
      onDeleted?.(post.id)
    } catch { /* ignore */ }
    setMenuOpen(false)
  }

  async function reportPost(): Promise<void> {
    setMenuOpen(false)
    try {
      await moderationApi.report('post', post.id, 'other')
      setReported(true)
      toastSuccess('Post reported', "We'll review it shortly.")
    } catch {
      toastError('Report failed', 'Could not submit the report. Please try again.')
    }
  }

  const media = post.media

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <ShareModal
        open={shareOpen}
        post={post}
        onClose={() => setShareOpen(false)}
        {...(onShareToStory ? { onShareToStory: () => { setShareOpen(false); onShareToStory('feed_post', post.id) } } : {})}
      />
      <LikersModal open={likersOpen} postId={post.id} onClose={() => setLikersOpen(false)} />
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/profile/${post.author.username}`}>
          <UserAvatar name={post.author.displayName} image={post.author.avatarUrl ?? undefined} size="md" verified={post.author.isVerified} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link href={`/profile/${post.author.username}`} className="font-semibold text-label-md text-on-surface hover:underline truncate">
              {post.author.displayName}
            </Link>
            {post.author.isVerified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
            {badge && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wide">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-outline">
            @{post.author.username} · {timeAgo(post.createdAt)}
            {post.community ? (
              <> · in <Link href={`/c/${post.community.slug}`} className="text-primary hover:underline font-medium">{post.community.name}</Link></>
            ) : post.visibility === 'followers' ? ' · Followers' : ''}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl overflow-hidden z-10">
              {onShareToStory && (
                <button
                  onClick={() => { setMenuOpen(false); onShareToStory('feed_post', post.id) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-on-surface hover:bg-surface-container cursor-pointer"
                >
                  <Send className="w-4 h-4 text-primary" />Share to Story
                </button>
              )}
              <button onClick={copyLink} className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-on-surface hover:bg-surface-container cursor-pointer">
                <Link2 className="w-4 h-4" />{copied ? 'Copied!' : 'Copy link'}
              </button>
              {isOwn && (
                <button onClick={deletePost} className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-red-500 hover:bg-red-50 cursor-pointer">
                  <Trash2 className="w-4 h-4" />Delete post
                </button>
              )}
              {!isOwn && (
                <button
                  onClick={reportPost}
                  disabled={reported}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-yellow-600 hover:bg-yellow-50 cursor-pointer disabled:opacity-50 disabled:cursor-default"
                >
                  <Flag className="w-4 h-4" />{reported ? 'Reported' : 'Report post'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media carousel */}
      {media.length > 0 && (
        <div className="relative bg-black/5 select-none" onClick={handleMediaTap}>
          <Img
            src={media[slide]!.url}
            alt=""
            priority={slide === 0}
            blurhash={media[slide]!.blurhash}
            className="w-full max-h-[560px] object-cover"
          />
          {heartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg animate-ping" />
            </div>
          )}
          {media.length > 1 && (
            <>
              {slide > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSlide((s) => s - 1) }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {slide < media.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSlide((s) => s + 1) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {media.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === slide ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Kind-specific structured block */}
      {post.kind === 'rescue_case' && (
        <div className="mx-4 mt-3 rounded-xl bg-primary/5 border border-primary/15 p-3 space-y-2">
          {meta?.species && <InfoRow Icon={PawPrint} label="Species" value={meta.species} />}
          {meta?.condition && <InfoRow Icon={HeartPulse} label="Condition" value={meta.condition} />}
          {meta?.supportNeeded && meta.supportNeeded.length > 0 && (
            <InfoRow Icon={HandHeart} label="Support Needed" value={meta.supportNeeded.join(' · ')} />
          )}
          {meta?.verifiedBy && <InfoRow Icon={BadgeCheck} label="Verified By" value={meta.verifiedBy} />}
          <div className="flex gap-2 pt-1">
            <Link
              href={`/profile/${post.author.username}`}
              className="flex-1 text-center py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Foster Enquiry
            </Link>
            <button
              onClick={toggleSave}
              className="px-4 py-2 rounded-lg border border-primary/30 text-primary text-label-sm font-semibold hover:bg-primary/10 transition-colors cursor-pointer"
            >
              {saved ? 'Following Case' : 'Follow Case'}
            </button>
          </div>
        </div>
      )}

      {post.kind === 'vet_tip' && (
        <div className="mx-4 mt-3 space-y-2">
          <div className="flex items-start gap-2 rounded-xl bg-blue-500/5 border border-blue-500/15 p-3">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-on-surface-variant leading-snug">
              This information is educational and not a substitute for veterinary care.
            </p>
          </div>
          <button
            onClick={toggleSave}
            className="w-full py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {saved ? 'Advice Saved' : 'Save Advice'}
          </button>
        </div>
      )}

      {post.kind === 'lost_found' && (
        <div className="mx-4 mt-3 rounded-xl bg-secondary/5 border border-secondary/25 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-secondary text-[11px] font-bold uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5" />Lost Pet Alert
          </div>
          {meta?.petName && <p className="text-label-md font-semibold text-on-surface">{meta.petName}</p>}
          {meta?.lastSeen && <InfoRow Icon={MapPin} label="Last seen" value={meta.lastSeen} />}
          <Link
            href="/lost-found"
            className="block text-center py-2 rounded-lg bg-secondary text-white text-label-sm font-semibold hover:bg-secondary/90 transition-colors"
          >
            I&apos;ve Found This Pet — Report Now
          </Link>
        </div>
      )}

      {post.kind === 'wildlife' && (
        <div className="mx-4 mt-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 space-y-2">
          {meta?.species && <InfoRow Icon={Bird} label="Species" value={meta.species} />}
          <Link
            href="/lost-found"
            className="block text-center py-2 rounded-lg bg-emerald-600 text-white text-label-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            Report a Sighting
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 pt-2">
        <button
          onClick={() => toggleLike()}
          className="p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
        >
          <Heart className={`w-6 h-6 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-on-surface'}`} />
        </button>
        <button
          onClick={() => router.push(`/p/${post.id}`)}
          className="p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
        >
          <MessageCircle className="w-6 h-6 text-on-surface" />
        </button>
        <button onClick={() => setShareOpen(true)} className="p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
          <Send className="w-6 h-6 text-on-surface" />
        </button>
        <button onClick={toggleSave} className="ml-auto p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
          <Bookmark className={`w-6 h-6 transition-colors ${saved ? 'text-primary fill-primary' : 'text-on-surface'}`} />
        </button>
      </div>

      {/* Counts + caption + comments link */}
      <div className="px-4 pb-4 space-y-1">
        {likesCount > 0 && (
          <button
            onClick={() => setLikersOpen(true)}
            className="font-semibold text-label-md text-on-surface hover:opacity-70 transition-opacity cursor-pointer"
          >
            {likesCount.toLocaleString()} like{likesCount === 1 ? '' : 's'}
          </button>
        )}
        {post.caption && (
          <p className="text-label-md text-on-surface leading-relaxed">
            <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline mr-1.5">
              {post.author.username}
            </Link>
            <Caption text={post.caption} />
          </p>
        )}
        {post.commentsCount > 0 && (
          <Link href={`/p/${post.id}`} className="block text-label-sm text-outline hover:text-on-surface-variant">
            View {post.commentsCount === 1 ? '1 comment' : `all ${post.commentsCount.toLocaleString()} comments`}
          </Link>
        )}
      </div>
    </article>
  )
}
