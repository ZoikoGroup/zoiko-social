'use client'

import { useState } from 'react'
import { ThumbsUp, MessageSquare, Share2, Bookmark, BadgeCheck, MoreHorizontal, Heart } from 'lucide-react'

const POSTS = [
  {
    id: '1',
    author: 'RescueMata Foundation',
    badge: 'Verified Rescue Org',
    location: 'San Francisco',
    time: '2 hours ago',
    body: "Meet Cleo — a 2-year-old domestic shorthair rescued from the Riverside storm drain. Her recovery is a testament to our team's dedication. #AnimalRescue #CatCare",
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=400&fit=crop',
    likes: '1,248',
    comments: '47',
  },
  {
    id: '2',
    author: 'Dr. Vetara Okonkwo DVM',
    badge: 'Verified Vet Professional',
    location: 'New York',
    time: '5 hours ago',
    body: 'Heat season reminder: pavement temperatures above 50°C can cause severe paw pad burns. Walk early morning or after sundown. Carry water. Watch for excessive panting or lifting of paws.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    likes: '511',
    comments: '93',
  },
  {
    id: '3',
    author: 'BirdsHQ Community',
    badge: 'Wildlife Community',
    location: 'Keoladeo NP',
    time: 'Yesterday',
    body: 'The Sarus Crane pair at Keoladeo National Park have been sighted nesting again — the first confirmed nest in this section since the 2021 wetland restoration project. #SarusCrane #WetlandRestore',
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=600&h=400&fit=crop',
    likes: '1.2k',
    comments: '208',
  },
]

export function PostCard(): React.JSX.Element {
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  function toggleLike(id: string): void {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleSave(id: string): void {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {POSTS.map((post) => {
        const isLiked = liked[post.id] ?? false
        const isSaved = saved[post.id] ?? false
        const initials = post.author.split(' ').map((w) => w[0]).slice(0, 2).join('')

        return (
          <article key={post.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm border border-outline-variant">
                    {initials}
                  </div>
                  <BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-primary bg-white rounded-full" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-label-md text-on-surface">{post.author}</span>
                    <span className="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] rounded font-bold uppercase tracking-wider">{post.badge}</span>
                  </div>
                  <span className="text-[11px] text-outline">{post.location} · {post.time}</span>
                </div>
              </div>
              <button className="text-outline hover:text-on-surface transition-colors cursor-pointer p-1 rounded">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-3">
              <p className="text-body-md text-on-surface leading-relaxed">{post.body}</p>
            </div>

            {/* Image */}
            <div className="overflow-hidden bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={`Post by ${post.author}`}
                className="w-full object-cover max-h-80"
                loading="lazy"
              />
            </div>

            {/* Engagement */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-label-sm text-outline">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center">
                    <ThumbsUp className="w-2.5 h-2.5" />
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-[#e84393] text-white flex items-center justify-center">
                    <Heart className="w-2.5 h-2.5" />
                  </div>
                </div>
                <span>{post.likes} professionals liked this</span>
                <span className="ml-auto">{post.comments} comments</span>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer font-semibold text-label-md ${
                      isLiked ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-primary' : ''}`} />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer font-semibold text-label-md">
                    <MessageSquare className="w-4 h-4" />
                    <span>Comment</span>
                  </button>
                  <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer font-semibold text-label-md">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
                <button
                  onClick={() => toggleSave(post.id)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isSaved ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary' : ''}`} />
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </>
  )
}
