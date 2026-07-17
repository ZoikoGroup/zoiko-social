'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ImageOff } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { PostCard } from '@/components/feed/PostCard'
import { CommentThread } from '@/components/feed/CommentThread'
import { postsApi, ApiError, type PostItem } from '@/lib/api'

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }): React.JSX.Element {
  const { postId } = use(params)
  const [post, setPost] = useState<PostItem | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    postsApi.get(postId)
      .then((p) => { if (!cancelled) setPost(p) })
      .catch((e) => { if (!cancelled && e instanceof ApiError) setNotFound(true) })
    return () => { cancelled = true }
  }, [postId])

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-0 py-gutter pb-24">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-label-md font-semibold text-on-surface">Post</span>
          </div>

          {notFound ? (
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-16 text-center">
              <ImageOff className="w-10 h-10 text-outline mx-auto mb-4" />
              <h1 className="font-headline text-headline-md text-on-surface">Post unavailable</h1>
              <p className="text-label-md text-outline mt-2">
                This post doesn&apos;t exist or isn&apos;t available to you.
              </p>
              <Link href="/" className="inline-block mt-5 px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors">
                Back to feed
              </Link>
            </section>
          ) : !post ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-surface-container rounded animate-pulse" />
                  <div className="h-2.5 w-16 bg-surface-container rounded animate-pulse" />
                </div>
              </div>
              <div className="h-80 bg-surface-container animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              <PostCard post={post} surface="detail" onDeleted={() => setNotFound(true)} />
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm max-h-[600px] flex flex-col">
                <CommentThread post={post} />
              </div>
            </div>
          )}
        </div>
      </main>
      <MobileTabs currentPage="home" />
    </>
  )
}
