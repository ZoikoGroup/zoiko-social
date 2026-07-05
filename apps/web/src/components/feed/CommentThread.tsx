'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Heart, Pin, Trash2, Loader2, Send } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { commentsApi, type CommentItem, type PostItem } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { getSocket } from '@/lib/socket'

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

interface CommentRowProps {
  comment: CommentItem
  isPostAuthor: boolean
  onReply: (comment: CommentItem) => void
  onDeleted: (id: string, parentId: string | null) => void
  onPinToggle?: (comment: CommentItem) => void
  isReply?: boolean
}

function CommentRow({ comment, isPostAuthor, onReply, onDeleted, onPinToggle, isReply = false }: CommentRowProps): React.JSX.Element {
  const { user } = useAuth()
  const [liked, setLiked] = useState(comment.viewerLiked)
  const [likesCount, setLikesCount] = useState(comment.likesCount)
  const [replies, setReplies] = useState<CommentItem[]>([])
  const [repliesOpen, setRepliesOpen] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState(false)

  const canDelete = user?.id === comment.author.id || isPostAuthor

  async function toggleLike(): Promise<void> {
    const next = !liked
    setLiked(next)
    setLikesCount((c) => c + (next ? 1 : -1))
    try {
      const result = next ? await commentsApi.like(comment.id) : await commentsApi.unlike(comment.id)
      setLikesCount(result.likesCount)
    } catch {
      setLiked(!next)
      setLikesCount((c) => c + (next ? -1 : 1))
    }
  }

  async function loadReplies(): Promise<void> {
    if (repliesOpen) {
      setRepliesOpen(false)
      return
    }
    setLoadingReplies(true)
    try {
      const page = await commentsApi.replies(comment.id)
      setReplies(page.data)
      setRepliesOpen(true)
    } catch { /* ignore */ } finally {
      setLoadingReplies(false)
    }
  }

  async function remove(): Promise<void> {
    try {
      await commentsApi.delete(comment.id)
      onDeleted(comment.id, comment.parentId)
    } catch { /* ignore */ }
  }

  return (
    <div className={isReply ? 'ml-11' : ''}>
      <div className="flex gap-3 py-2 group">
        <Link href={`/profile/${comment.author.username}`}>
          <UserAvatar name={comment.author.displayName} image={comment.author.avatarUrl ?? undefined} size="sm" verified={comment.author.isVerified} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-label-sm leading-relaxed">
            <Link href={`/profile/${comment.author.username}`} className="font-semibold text-on-surface hover:underline mr-1.5">
              {comment.author.username}
            </Link>
            {comment.isPinned && <Pin className="w-3 h-3 text-outline inline mr-1" />}
            <span className="text-on-surface">{comment.body}</span>
          </p>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-outline">
            <span>{timeAgo(comment.createdAt)}</span>
            {comment.isEdited && <span>(edited)</span>}
            {likesCount > 0 && <span className="font-semibold">{likesCount} like{likesCount === 1 ? '' : 's'}</span>}
            {!isReply && (
              <button onClick={() => onReply(comment)} className="font-semibold hover:text-on-surface cursor-pointer">
                Reply
              </button>
            )}
            {isPostAuthor && !isReply && onPinToggle && (
              <button
                onClick={() => onPinToggle(comment)}
                className="font-semibold hover:text-on-surface cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {comment.isPinned ? 'Unpin' : 'Pin'}
              </button>
            )}
            {canDelete && (
              <button
                onClick={remove}
                className="text-red-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {!isReply && comment.repliesCount > 0 && (
            <button
              onClick={loadReplies}
              className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-outline hover:text-on-surface cursor-pointer"
            >
              <span className="w-6 h-px bg-outline-variant inline-block" />
              {loadingReplies ? 'Loading…' : repliesOpen ? 'Hide replies' : `View ${comment.repliesCount} repl${comment.repliesCount === 1 ? 'y' : 'ies'}`}
            </button>
          )}
        </div>
        <button onClick={toggleLike} className="p-1 self-start cursor-pointer">
          <Heart className={`w-3.5 h-3.5 ${liked ? 'text-red-500 fill-red-500' : 'text-outline'}`} />
        </button>
      </div>

      {repliesOpen && replies.map((reply) => (
        <CommentRow
          key={reply.id}
          comment={reply}
          isPostAuthor={isPostAuthor}
          onReply={onReply}
          onDeleted={(id) => setReplies((prev) => prev.filter((r) => r.id !== id))}
          isReply
        />
      ))}
    </div>
  )
}

interface CommentThreadProps {
  post: PostItem
}

export function CommentThread({ post }: CommentThreadProps): React.JSX.Element {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState<CommentItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isPostAuthor = user?.id === post.author.id

  const load = useCallback(async (): Promise<void> => {
    try {
      const page = await commentsApi.list(post.id)
      setComments(page.data)
      setNextCursor(page.nextCursor)
      setHasMore(page.hasMore)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [post.id])

  useEffect(() => {
    // Deferred so state updates never run synchronously inside the effect body
    const timer = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(timer)
  }, [load])

  // Realtime: live comments while the post is open
  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | undefined

    void getSocket().then((socket) => {
      if (!socket || cancelled) return
      socket.emit('post.subscribe', { postId: post.id })
      const onNew = (comment: CommentItem): void => {
        // Top-level only; skip own (already added optimistically)
        if (comment.parentId || comment.author.id === user?.id) return
        setComments((prev) => (prev.some((c) => c.id === comment.id) ? prev : [comment, ...prev]))
      }
      const onDeleted = ({ commentId }: { commentId: string }): void => {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      }
      socket.on('comment:new', onNew)
      socket.on('comment:deleted', onDeleted)
      cleanup = () => {
        socket.off('comment:new', onNew)
        socket.off('comment:deleted', onDeleted)
        socket.emit('post.unsubscribe', { postId: post.id })
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [post.id, user?.id])

  async function submit(): Promise<void> {
    const body = input.trim()
    if (!body || submitting || !profile) return
    setSubmitting(true)

    const parentId = replyTo?.id
    const tempId = `tmp-${Date.now()}`

    // Optimistic: render immediately, reconcile with the server response
    const optimistic: CommentItem = {
      id: tempId,
      postId: post.id,
      parentId: null,
      author: {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        isVerified: profile.verificationTier === 'professional',
      },
      body,
      likesCount: 0,
      repliesCount: 0,
      isPinned: false,
      isEdited: false,
      isDeleted: false,
      viewerLiked: false,
      createdAt: new Date().toISOString(),
    }
    if (!parentId) {
      setComments((prev) => [optimistic, ...prev])
    }
    setInput('')
    setReplyTo(null)

    try {
      const comment = await commentsApi.create(post.id, body, parentId)
      if (comment.parentId) {
        // Reply — bump the parent's count locally
        setComments((prev) =>
          prev.map((c) => (c.id === comment.parentId ? { ...c, repliesCount: c.repliesCount + 1 } : c)),
        )
      } else {
        // Swap the optimistic row for the real one
        setComments((prev) => prev.map((c) => (c.id === tempId ? comment : c)))
      }
    } catch {
      // Roll back and restore the draft so nothing is lost
      setComments((prev) => prev.filter((c) => c.id !== tempId))
      setInput(body)
    } finally {
      setSubmitting(false)
    }
  }

  async function loadMore(): Promise<void> {
    if (!nextCursor) return
    const page = await commentsApi.list(post.id, nextCursor)
    setComments((prev) => {
      const seen = new Set(prev.map((c) => c.id))
      return [...prev, ...page.data.filter((c) => !seen.has(c.id))]
    })
    setNextCursor(page.nextCursor)
    setHasMore(page.hasMore)
  }

  async function togglePin(comment: CommentItem): Promise<void> {
    try {
      if (comment.isPinned) await commentsApi.unpin(post.id, comment.id)
      else await commentsApi.pin(post.id, comment.id)
      void load()
    } catch { /* pin limit etc. */ }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {loading ? (
          <div className="space-y-3 py-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="h-3 w-40 bg-surface-container rounded animate-pulse" />
                  <div className="h-2.5 w-24 bg-surface-container rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-label-sm text-outline text-center py-8">
            {post.commentsDisabled ? 'Comments are turned off.' : 'No comments yet — start the conversation.'}
          </p>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                isPostAuthor={isPostAuthor}
                onReply={(c) => {
                  setReplyTo(c)
                  setInput(`@${c.author.username} `)
                  inputRef.current?.focus()
                }}
                onDeleted={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
                onPinToggle={togglePin}
              />
            ))}
            {hasMore && (
              <button onClick={loadMore} className="text-label-sm font-semibold text-outline hover:text-on-surface py-2 cursor-pointer">
                View more comments
              </button>
            )}
          </>
        )}
      </div>

      {/* Input */}
      {!post.commentsDisabled && (
        <div className="border-t border-outline-variant/20 px-4 py-3">
          {replyTo && (
            <div className="flex items-center justify-between text-[11px] text-outline mb-2">
              <span>Replying to <span className="font-semibold">@{replyTo.author.username}</span></span>
              <button onClick={() => { setReplyTo(null); setInput('') }} className="hover:text-on-surface cursor-pointer">Cancel</button>
            </div>
          )}
          <div className="flex items-center gap-3">
            {profile && <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="sm" />}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void submit() }}
              maxLength={1000}
              placeholder="Add a comment…"
              className="flex-1 px-3 py-2 bg-surface-container-low rounded-full text-label-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
            <button
              onClick={submit}
              disabled={!input.trim() || submitting}
              className="p-2 rounded-full text-primary disabled:opacity-40 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
