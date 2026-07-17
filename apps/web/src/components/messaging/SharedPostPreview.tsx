'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ImageIcon } from 'lucide-react'
import { postsApi, type PostItem } from '@/lib/api'
import { Img } from '../Img'
import { UserAvatar } from '../UserAvatar'

// Module-level cache so the same shared post rendered across multiple bubbles
// (or on revisit) resolves instantly without refetching.
const postCache = new Map<string, PostItem | 'missing'>()

/** Extract the post id from a permalink like `https://host/p/<uuid>`. */
function postIdFromUrl(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/\/p\/([0-9a-f-]{16,})/i)
  return match?.[1] ?? null
}

/**
 * Instagram-style shared-post card rendered inside a DM bubble.
 * The share flow delivers the post as a message whose body is the post
 * permalink; this resolves that permalink into a compact preview that links
 * through to the full post.
 */
export function SharedPostPreview({ url, isMine }: { url: string | null; isMine: boolean }): React.JSX.Element {
  const postId = postIdFromUrl(url)
  const cached = postId ? postCache.get(postId) : undefined
  const [post, setPost] = useState<PostItem | null>(cached && cached !== 'missing' ? cached : null)
  const [loading, setLoading] = useState(!!postId && cached === undefined)

  useEffect(() => {
    if (!postId || cached !== undefined) return
    let cancelled = false
    postsApi.get(postId)
      .then((result) => {
        postCache.set(postId, result)
        if (!cancelled) setPost(result)
      })
      .catch(() => {
        postCache.set(postId, 'missing')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [postId, cached])

  // Bad/unparseable link — degrade to a plain link so nothing is lost.
  if (!postId) {
    return (
      <a href={url ?? '#'} target="_blank" rel="noopener noreferrer" className="underline break-all">
        {url}
      </a>
    )
  }

  const cardBorder = isMine ? 'border-white/25' : 'border-outline-variant/40'

  if (loading) {
    return (
      <div className={`-mx-2 my-1 w-56 max-w-full rounded-xl border ${cardBorder} overflow-hidden bg-surface-container-low animate-pulse`}>
        <div className="aspect-square bg-surface-container" />
        <div className="p-2 space-y-1.5">
          <div className="h-2.5 w-24 rounded bg-surface-container" />
          <div className="h-2 w-32 rounded bg-surface-container" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <Link href={`/p/${postId}`} className="flex items-center gap-2 text-xs underline">
        <ImageIcon className="w-3.5 h-3.5" />
        View post
      </Link>
    )
  }

  const cover = post.media[0]

  return (
    <Link
      href={`/p/${post.id}`}
      className={`block -mx-2 my-1 w-56 max-w-full rounded-xl border ${cardBorder} overflow-hidden bg-surface-container-lowest text-on-surface no-underline hover:opacity-95 transition-opacity`}
    >
      {/* Author row */}
      <div className="flex items-center gap-2 px-2.5 py-2">
        <UserAvatar name={post.author.displayName} image={post.author.avatarUrl ?? undefined} size="sm" verified={post.author.isVerified} />
        <span className="text-[12px] font-semibold truncate">{post.author.username}</span>
      </div>

      {/* Cover media */}
      {cover ? (
        <div className="aspect-square bg-surface-container">
          <Img src={cover.thumbnailUrl ?? cover.url} blurhash={cover.blurhash} alt="" className="w-full h-full object-cover" />
        </div>
      ) : post.caption ? (
        <div className="px-3 py-4 bg-surface-container-low">
          <p className="text-[12.5px] leading-snug line-clamp-4">{post.caption}</p>
        </div>
      ) : (
        <div className="aspect-[3/1] bg-surface-container flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-outline" />
        </div>
      )}

      {/* Caption (when there is media above it) */}
      {cover && post.caption && (
        <div className="px-2.5 py-2">
          <p className="text-[12px] leading-snug line-clamp-2">
            <span className="font-semibold">{post.author.username}</span>{' '}
            <span className="text-on-surface-variant">{post.caption}</span>
          </p>
        </div>
      )}
    </Link>
  )
}
