'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight, Trash2, Link2 } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { ShareModal } from './ShareModal'
import { LikersModal } from './LikersModal'
import { postsApi, type PostItem } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { blurhashToDataURL } from '@/lib/image'

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
}

export function PostCard({ post, onDeleted }: PostCardProps): React.JSX.Element {
  const router = useRouter()
  const { user } = useAuth()
  const [liked, setLiked] = useState(post.viewerLiked)
  const [saved, setSaved] = useState(post.viewerSaved)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [slide, setSlide] = useState(0)
  const [heartBurst, setHeartBurst] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [likersOpen, setLikersOpen] = useState(false)
  const lastTap = useRef(0)

  const isOwn = user?.id === post.author.id

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

  const media = post.media

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <ShareModal open={shareOpen} post={post} onClose={() => setShareOpen(false)} />
      <LikersModal open={likersOpen} postId={post.id} onClose={() => setLikersOpen(false)} />
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/profile/${post.author.username}`}>
          <UserAvatar name={post.author.displayName} image={post.author.avatarUrl ?? undefined} size="md" verified={post.author.isVerified} />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${post.author.username}`} className="font-semibold text-label-md text-on-surface hover:underline">
            {post.author.username}
          </Link>
          <p className="text-[11px] text-outline">{timeAgo(post.createdAt)}{post.visibility === 'followers' ? ' · Followers' : ''}</p>
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
              <button onClick={copyLink} className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-on-surface hover:bg-surface-container cursor-pointer">
                <Link2 className="w-4 h-4" />{copied ? 'Copied!' : 'Copy link'}
              </button>
              {isOwn && (
                <button onClick={deletePost} className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-red-500 hover:bg-red-50 cursor-pointer">
                  <Trash2 className="w-4 h-4" />Delete post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media carousel */}
      {media.length > 0 && (
        <div className="relative bg-black/5 select-none" onClick={handleMediaTap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media[slide]!.url}
            alt=""
            loading="lazy"
            className="w-full max-h-[560px] object-cover"
            style={
              media[slide]!.blurhash
                ? { backgroundImage: `url(${blurhashToDataURL(media[slide]!.blurhash!)})`, backgroundSize: 'cover' }
                : undefined
            }
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
