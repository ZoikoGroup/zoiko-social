import type { LucideIcon } from 'lucide-react'
import {
  Rocket,
  PawPrint,
  LayoutGrid,
  Users,
  MessageSquare,
  HandHeart,
  ShoppingBag,
  Newspaper,
  ShieldCheck,
  Settings,
  HelpCircle,
} from 'lucide-react'

export interface DocsCategory {
  slug: string
  title: string
  shortTitle: string
  summary: string
  icon: LucideIcon
}

// Canonical list of Help Center categories — used to build the sidebar,
// the mobile chip nav, the home page grid, and the prev/next footer links.
// Keep this the single source of truth so every surface stays in sync.
export const DOCS_NAV: DocsCategory[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    shortTitle: 'Getting Started',
    summary: 'Create your account, build your profile, and take a first lap around ZoikoSocial.',
    icon: Rocket,
  },
  {
    slug: 'profile-and-pets',
    title: 'Profiles & Pet Passport',
    shortTitle: 'Profiles & Pets',
    summary: 'Your profile, pet profiles, Pet Diary, Health Passport, and professional verification.',
    icon: PawPrint,
  },
  {
    slug: 'feed-and-content',
    title: 'Feed, Posts & Stories',
    shortTitle: 'Feed & Posts',
    summary: 'How the Home feed works, plus posting, stories, hashtags, and reactions.',
    icon: LayoutGrid,
  },
  {
    slug: 'community-and-events',
    title: 'Network, Communities & Events',
    shortTitle: 'Community',
    summary: 'Following people, joining communities, and hosting or attending events.',
    icon: Users,
  },
  {
    slug: 'messaging-and-calls',
    title: 'Messaging & Calls',
    shortTitle: 'Messaging',
    summary: 'Direct messages, group chat, message requests, and audio/video calls.',
    icon: MessageSquare,
  },
  {
    slug: 'adoption-and-lost-found',
    title: 'Adoption & Lost and Found',
    shortTitle: 'Adoption',
    summary: 'Rehoming a pet, applying to adopt, and reporting or searching for lost pets.',
    icon: HandHeart,
  },
  {
    slug: 'marketplace-and-services',
    title: 'Shop, Providers & Bookings',
    shortTitle: 'Shop & Services',
    summary: 'Buying pet products, booking vets and pet-care providers, and Breeding Match.',
    icon: ShoppingBag,
  },
  {
    slug: 'news',
    title: 'Verified News',
    shortTitle: 'News',
    summary: 'How news works on ZoikoSocial, and how to read, save, and discuss articles.',
    icon: Newspaper,
  },
  {
    slug: 'safety-and-trust',
    title: 'Safety, Privacy & Trust',
    shortTitle: 'Safety & Trust',
    summary: 'Our profanity-free standard, reporting, moderation, blocking, and appeals.',
    icon: ShieldCheck,
  },
  {
    slug: 'notifications-and-settings',
    title: 'Notifications & Account Settings',
    shortTitle: 'Settings',
    summary: 'Managing alerts, privacy controls, security, currency, and your account.',
    icon: Settings,
  },
  {
    slug: 'faq',
    title: 'FAQ & Troubleshooting',
    shortTitle: 'FAQ',
    summary: 'Quick answers to the questions people ask most.',
    icon: HelpCircle,
  },
]

export function getDocCategory(slug: string): DocsCategory | undefined {
  return DOCS_NAV.find((c) => c.slug === slug)
}

export function getAdjacentDocs(slug: string): { prev: DocsCategory | null; next: DocsCategory | null } {
  const idx = DOCS_NAV.findIndex((c) => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? DOCS_NAV[idx - 1] ?? null : null,
    next: idx < DOCS_NAV.length - 1 ? DOCS_NAV[idx + 1] ?? null : null,
  }
}
