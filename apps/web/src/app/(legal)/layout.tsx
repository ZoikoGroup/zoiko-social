import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

// Intentionally NOT listed in middleware.ts's PROTECTED_ROUTES. The signup page
// links here from its consent line — "By continuing, you agree to our Terms of
// Service and Privacy Policy" — so these pages have to be readable before
// someone has an account, or the consent is meaningless.
export const metadata: Metadata = {
  title: {
    default: 'Legal · ZoikoSocial',
    template: '%s · ZoikoSocial',
  },
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline-variant/30">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-label-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to sign in
          </Link>
          <span className="ml-auto text-label-sm font-bold text-on-surface">ZoikoSocial</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-gutter md:py-12">
        <article className="pb-16">{children}</article>
      </main>

      <footer className="border-t border-outline-variant/30">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-wrap gap-x-5 gap-y-2 text-label-sm text-outline">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/docs" className="hover:text-primary transition-colors">
            Help Center
          </Link>
          <span className="ml-auto">Zoiko Media Corp · Sacramento, CA</span>
        </div>
      </footer>
    </div>
  )
}
