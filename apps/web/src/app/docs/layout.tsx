import type { Metadata } from 'next'
import { DocsTopbar } from './_components/DocsTopbar'
import { DocsSidebar } from './_components/DocsSidebar'
import { DocsMobileNav } from './_components/DocsMobileNav'

// This route is intentionally NOT listed in middleware.ts's PROTECTED_ROUTES,
// so it renders for signed-out visitors and members alike — a help center
// has to be readable before someone has an account.
export const metadata: Metadata = {
  title: {
    default: 'Help Center · ZoikoSocial',
    template: '%s · ZoikoSocial Help Center',
  },
  description:
    'Everything you need to know about using ZoikoSocial — profiles and pets, the feed, communities, messaging, safety, and more.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <DocsTopbar />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <DocsSidebar />
          <div className="lg:col-span-9 min-w-0">
            <DocsMobileNav />
            <article className="max-w-3xl pb-16">{children}</article>
          </div>
        </div>
      </main>
    </div>
  )
}
