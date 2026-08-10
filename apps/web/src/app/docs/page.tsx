import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DOCS_NAV } from './_lib/nav'

const POPULAR_TOPICS: { label: string; href: string }[] = [
  { label: 'Create your account', href: '/docs/getting-started#creating-your-account' },
  { label: 'Add your first pet profile', href: '/docs/getting-started#adding-your-first-pet' },
  { label: 'Set up your Health Passport', href: '/docs/profile-and-pets#health-passport' },
  { label: 'Report a post or a person', href: '/docs/safety-and-trust#reporting' },
  { label: 'Start a video call', href: '/docs/messaging-and-calls#audio-and-video-calls' },
  { label: 'Apply to adopt a pet', href: '/docs/adoption-and-lost-found#applying-to-adopt' },
  { label: 'Book a vet or pet-care provider', href: '/docs/marketplace-and-services#booking-a-provider' },
  { label: 'Delete your account', href: '/docs/notifications-and-settings#deleting-your-account' },
]

export default function DocsHomePage(): React.JSX.Element {
  return (
    <>
      <header className="mb-12">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-outline">Help Center</span>
        <h1 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface mt-3 mb-4 leading-tight">
          How can we help?
        </h1>
        <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
          This is the complete guide to ZoikoSocial — the governed, profanity-free social platform
          built for pet owners, animal rescuers, veterinarians, and everyone who cares about animal
          welfare, the environment, science, and technology. Browse by topic below, or jump straight
          to a popular question.
        </p>
      </header>

      <section aria-labelledby="popular-topics" className="mb-14">
        <h2 id="popular-topics" className="text-[13px] font-bold uppercase tracking-wide text-outline mb-3">
          Popular topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TOPICS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="text-[13px] font-medium px-3.5 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="browse-topics">
        <h2 id="browse-topics" className="text-[13px] font-bold uppercase tracking-wide text-outline mb-4">
          Browse by topic
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {DOCS_NAV.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <cat.icon className="w-5 h-5 text-primary" />
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
              </div>
              <div>
                <p className="font-bold text-on-surface text-[15px] mb-1">{cat.title}</p>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">{cat.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-14 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-outline-variant/20 p-6 text-center">
        <p className="font-headline font-bold text-on-surface text-[15px] mb-1">Still stuck?</p>
        <p className="text-[13px] text-on-surface-variant mb-4">
          Head to <span className="font-semibold text-on-surface">Settings → Help &amp; About → Contact Support</span> from
          inside the app, and our team will pick it up from there.
        </p>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors"
        >
          Go to Settings
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  )
}
