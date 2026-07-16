'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Images, FileText } from 'lucide-react'
import type { PostItem } from '@/lib/api'
import { Img } from '../Img'

interface PostGridProps {
  posts: PostItem[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  emptyTitle?: string
  emptyHint?: string
}

/** Instagram-style 3-column grid of post thumbnails linking to /p/{id}. */
export function PostGrid({
  posts, loading = false, hasMore = false, onLoadMore,
  emptyTitle = 'No posts yet', emptyHint = 'Posts will appear here once shared.',
}: PostGridProps): React.JSX.Element {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-square bg-surface-container animate-pulse rounded-sm" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
          <Images className="w-6 h-6 text-outline" />
        </div>
        <p className="text-label-md font-semibold text-on-surface">{emptyTitle}</p>
        <p className="text-label-sm text-outline mt-1 max-w-xs mx-auto">{emptyHint}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => {
          const cover = post.media[0]
          return (
            <Link
              key={post.id}
              href={`/p/${post.id}`}
              className="relative aspect-square overflow-hidden rounded-sm group bg-surface-container"
            >
              {cover ? (
                <Img
                  src={cover.thumbnailUrl ?? cover.url}
                  alt=""
                  blurhash={cover.blurhash}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full p-3 flex flex-col">
                  <FileText className="w-4 h-4 text-outline mb-1.5 flex-shrink-0" />
                  <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-5">{post.caption}</p>
                </div>
              )}
              {post.media.length > 1 && (
                <Images className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow" />
              )}
              {/* Hover overlay with counts */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-label-sm font-semibold">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" />{post.likesCount}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 fill-white" />{post.commentsCount}</span>
              </div>
            </Link>
          )
        })}
      </div>
      {hasMore && onLoadMore && (
        <button
          onClick={onLoadMore}
          className="w-full mt-3 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
        >
          Load more
        </button>
      )}
    </>
  )
}
