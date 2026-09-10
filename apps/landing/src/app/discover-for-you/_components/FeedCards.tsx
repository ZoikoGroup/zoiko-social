import React from 'react'
import Image from 'next/image'
import {
  MoreHorizontal, Sparkles, MessageCircle, Repeat2, Share, Heart, Clock,
  ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface ActionRowProps {
  likes?: string
  comments?: string
  reposts?: string
}

function ActionRow({ likes, comments, reposts }: ActionRowProps) {
  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-teal-wash">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-teal-muted">
        {likes && (
          <button className="flex items-center gap-2 hover:text-teal-light transition-colors">
            <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
        )}
        {comments && (
          <button className="flex items-center gap-2 hover:text-teal-light transition-colors">
            <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span className="text-sm font-medium">{comments}</span>
          </button>
        )}
        {reposts && (
          <button className="flex items-center gap-2 hover:text-teal-light transition-colors">
            <Repeat2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span className="text-sm font-medium">{reposts}</span>
          </button>
        )}
        <button className="flex items-center gap-2 hover:text-teal-light transition-colors">
          <Share className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>
    </div>
  )
}

function ContextBanner({ icon: Icon, text, linkText }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>, text: string, linkText?: string }) {
  return (
    <div className="flex items-center gap-2 bg-[#EEF8F9] px-3 py-2 rounded-lg mb-3 border border-[#066879]/10">
      <Icon className="w-4 h-4 text-[#066879]" strokeWidth={2} />
      <span className="text-[13px] text-teal-deep font-bold flex-1">{text}</span>
      {linkText && (
        <button className="text-[13px] text-teal-muted hover:text-teal-deep transition-colors flex items-center gap-1 font-medium underline underline-offset-2 decoration-[#066879]/30">
          {linkText}
        </button>
      )}
    </div>
  )
}

export function CommunityPostCard() {
  return (
    <article className="bg-white rounded-2xl p-5 border border-teal-wash shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image src="/discover-for-you/avatar-golden-retriever.png" alt="Maria T." width={42} height={42} className="rounded-full object-cover" />
          <div>
            <h3 className="font-bold text-[15px] text-teal-deep leading-tight font-montserrat">Maria T.</h3>
            <p className="text-[13px] text-teal-muted">Golden Retriever Guardians · 2h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-[13px] font-semibold text-teal-light border border-teal-light/20 bg-teal-pale hover:bg-teal-wash rounded-full transition-colors">
            Follow
          </button>
          <button className="p-1.5 text-teal-muted hover:bg-teal-wash rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <ContextBanner icon={Clock} text="Because you follow Golden Retriever Guardians" linkText="Why this?" />
      
      <p className="text-[15px] text-teal-deep mb-4 leading-relaxed">
        Just finished our monthly meetup at the park — 40 goldens and their humans showed up! Swipe through for some of our favorite moments. 🐾
      </p>
      
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-teal-wash">
        <Image src="/discover-for-you/source/image.png" alt="Post content" fill className="object-cover" />
      </div>
      
      <ActionRow likes="128" comments="24" />
    </article>
  )
}

export function VerifiedNewsCard() {
  return (
    <article className="bg-white rounded-2xl p-5 border border-teal-wash/30 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 text-[12px] font-bold uppercase tracking-wider bg-teal-wash text-teal-deep rounded-md">Tier 1 Source</span>
        <span className="px-2.5 py-1 text-[12px] font-bold uppercase tracking-wider bg-teal-wash text-teal-light rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Verified
        </span>
        <span className="text-[13px] text-outline ml-2">2 hours ago</span>
      </div>

      <ContextBanner icon={Sparkles} text="Popular across Zoiko Social right now" linkText="Why this?" />

      <h2 className="text-[20px] font-bold text-teal-deep leading-tight mb-2">
        Major Policy Update on Wildlife Trade Enforcement
      </h2>
      <p className="text-[15px] text-teal-muted mb-4">
        International coalition strengthens measures to combat illegal wildlife trafficking across 47 nations.
      </p>

      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-teal-wash">
        <Image src="/discover-for-you/news-elephants.png" alt="Elephants walking together in a wildlife reserve" fill className="object-cover" />
      </div>

      <ActionRow comments="Discuss" />
    </article>
  )
}

export function AdoptionCard() {
  return (
    <article className="bg-white rounded-2xl p-5 border border-teal-wash/30 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image src="/discover-for-you/avatar-sacramento-rescue.png" alt="Sacramento Animal Rescue" width={42} height={42} className="rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-[15px] text-teal-deep leading-tight">Sacramento Animal Rescue</h3>
              <CheckCircle2 className="w-4 h-4 text-teal-light" />
            </div>
            <p className="text-[13px] text-teal-muted">Verified rescue organization · Sacramento, CA</p>
          </div>
        </div>
        <button className="p-1.5 text-teal-muted hover:bg-teal-wash rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <ContextBanner icon={Sparkles} text="Related to animals and topics you follow" linkText="Why this?" />

      <p className="text-[15px] text-teal-deep mb-4 leading-relaxed">
        Meet Willow — a 2-year-old lab mix looking for her forever home. She&apos;s friendly, house-trained, and great with kids.
      </p>

      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-teal-wash">
        <Image src="/discover-for-you/adoption-willow.png" alt="Willow, a two-year-old labrador mix available for adoption" fill className="object-cover" />
      </div>

      <div className="flex gap-2 mb-2">
        <span className="px-3 py-1 text-[13px] font-bold bg-green-50 text-green-700 rounded-md">Available for Adoption</span>
        <span className="px-3 py-1 text-[13px] font-bold bg-teal-wash text-teal-deep rounded-md">Verified Rescue</span>
      </div>

      <ActionRow comments="View Animal" />
    </article>
  )
}

export function EventCard() {
  return (
    <article className="bg-white rounded-2xl p-5 border border-teal-wash/30 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image src="/discover-for-you/avatar-london-cat.png" alt="London Cat Rescue Coalition" width={42} height={42} className="rounded-full object-cover" />
          <div>
            <h3 className="font-bold text-[15px] text-teal-deep leading-tight">London Cat Rescue Coalition</h3>
            <p className="text-[13px] text-teal-muted">Community you joined · Event</p>
          </div>
        </div>
        <button className="p-1.5 text-teal-muted hover:bg-teal-wash rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <ContextBanner icon={Sparkles} text="From a community you joined" linkText="Why this?" />

      <h2 className="text-[20px] font-bold text-teal-deep leading-tight mb-1">
        Community Adoption Day — Meet Your New Best Friend
      </h2>
      <p className="text-[15px] font-medium text-teal-light mb-4">
        Saturday, Oct 4 · 11:00 AM–3:00 PM · Regent&apos;s Park, London
      </p>

      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-teal-wash">
        <Image src="/discover-for-you/event-adoption-day.png" alt="A community adoption event with people and dogs gathered outdoors" fill className="object-cover" />
      </div>

      <div className="mb-2">
        <span className="px-3 py-1 text-[13px] font-bold bg-green-50 text-green-700 rounded-md">RSVP Open</span>
      </div>

      <ActionRow comments="RSVP" />
    </article>
  )
}

export function AnimalProfileUpdateCard() {
  return (
    <article className="bg-white rounded-2xl p-5 border border-teal-wash/30 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image src="/discover-for-you/avatar-milo.png" alt="Milo's Journey" width={42} height={42} className="rounded-full object-cover" />
          <div>
            <h3 className="font-bold text-[15px] text-teal-deep leading-tight">Milo&apos;s Journey</h3>
            <p className="text-[13px] text-teal-muted">Rescue cat profile · 3h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-[13px] font-semibold text-teal-light border border-teal-light/20 bg-teal-pale hover:bg-teal-wash rounded-full transition-colors">
            Follow
          </button>
          <button className="p-1.5 text-teal-muted hover:bg-teal-wash rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ContextBanner icon={Sparkles} text="Because you selected Animal Welfare" linkText="Why this?" />

      <p className="text-[15px] text-teal-deep mb-4 leading-relaxed">
        Six months ago Milo was found injured on the street. Today he&apos;s thriving in his new home — fully recovered and loving life indoors. 🧡
      </p>

      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-teal-wash">
        <Image src="/discover-for-you/community-golden-post.png" alt="Milo" fill className="object-cover" />
      </div>

      <ActionRow comments="312" reposts="41" />
    </article>
  )
}

export function SensitiveContentCard() {
  return (
    <article className="bg-white rounded-2xl p-5 border border-teal-wash/30 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image src="/discover-for-you/avatar-global-wildlife.png" alt="Global Wildlife Rescue Network" width={42} height={42} className="rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-[15px] text-teal-deep leading-tight">Global Wildlife Rescue Network</h3>
              <CheckCircle2 className="w-4 h-4 text-teal-light" />
            </div>
            <p className="text-[13px] text-teal-muted">Verified organization · 5h</p>
          </div>
        </div>
        <button className="p-1.5 text-teal-muted hover:bg-teal-wash rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-[15px] text-teal-deep mb-4 leading-relaxed">
        An update from an active rescue operation — details in the post below.
      </p>

      <div className="relative w-full h-[381px] rounded-2xl overflow-hidden mb-2 bg-[#071E24] flex items-center justify-center bg-gradient-to-br from-[#071E24] to-[#1e1913]">
        {/* Blur overlay simulation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-[48px] h-[48px] rounded-2xl bg-white flex items-center justify-center mb-5">
            <AlertTriangle className="w-[24px] h-[24px] text-orange-500" strokeWidth={2} />
          </div>
          <p 
            className="text-[15px] font-normal text-white max-w-[320px] mb-8 leading-snug"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            This post contains sensitive content related to an animal welfare situation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-white text-[#012B30] text-[15px] font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Reveal
            </button>
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-transparent text-white border border-white/70 text-[15px] font-bold rounded-xl hover:bg-white/10 transition-colors">
              Skip
            </button>
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-transparent text-white border border-white/70 text-[15px] font-bold rounded-xl hover:bg-white/10 transition-colors">
              Report
            </button>
          </div>
        </div>
      </div>

      <ActionRow comments="Discuss" />
    </article>
  )
}

export function CaughtUpState() {
  return (
    <div className="py-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-teal-wash rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-teal-light" />
      </div>
      <h2 className="text-[24px] font-bold text-teal-deep mb-2">You&apos;re caught up</h2>
      <p className="text-[15px] text-teal-muted max-w-md mx-auto mb-8">
        There&apos;s no newer eligible content right now. Here are a few useful places to go next.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
        <Link href="/communities" className="w-full sm:w-auto px-6 py-3 border border-teal-wash rounded-full text-[14px] font-bold text-teal-deep hover:bg-teal-wash transition-colors flex items-center justify-center gap-2">
          Explore Communities <ChevronRight className="w-4 h-4" />
        </Link>
        <button className="w-full sm:w-auto px-6 py-3 border border-teal-wash rounded-full text-[14px] font-bold text-teal-deep hover:bg-teal-wash transition-colors flex items-center justify-center gap-2">
          Trending Now <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}





