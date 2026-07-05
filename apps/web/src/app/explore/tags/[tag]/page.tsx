'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Hash } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { PostGrid } from '@/components/feed/PostGrid'
import { hashtagsApi, ApiError, type PostItem } from '@/lib/api'

export default function HashtagPage({ params }: { params: Promise<{ tag: string }> }): React.JSX.Element {
  const { tag } = use(params)
  const decodedTag = decodeURIComponent(tag)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [postsCount, setPostsCount] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    hashtagsApi.posts(decodedTag)
      .then((page) => {
        if (cancelled) return
        setPosts(page.data)
        setPostsCount(page.postsCount)
        setNextCursor(page.nextCursor)
        setHasMore(page.hasMore)
      })
      .catch((e) => { if (!cancelled && e instanceof ApiError) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [decodedTag])

  async function loadMore(): Promise<void> {
    if (!nextCursor) return
    const page = await hashtagsApi.posts(decodedTag, nextCursor)
    setPosts((prev) => {
      const seen = new Set(prev.map((p) => p.id))
      return [...prev, ...page.data.filter((p) => !seen.has(p.id))]
    })
    setNextCursor(page.nextCursor)
    setHasMore(page.hasMore)
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-0 py-gutter pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Hash className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-headline text-headline-md text-on-surface">#{decodedTag}</h1>
              <p className="text-label-sm text-outline">
                {postsCount.toLocaleString()} post{postsCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {notFound ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
              <p className="text-label-md font-semibold text-on-surface">No posts with this hashtag yet</p>
              <p className="text-label-sm text-outline mt-1">Be the first — use #{decodedTag} in a post.</p>
            </div>
          ) : (
            <PostGrid posts={posts} loading={loading} hasMore={hasMore} onLoadMore={loadMore} />
          )}
        </div>
      </main>
      <MobileTabs currentPage="home" />
    </>
  )
}
