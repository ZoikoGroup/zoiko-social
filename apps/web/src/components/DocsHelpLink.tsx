import Link from 'next/link'
import { HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DocsHelpLinkProps {
  href: string
  label?: string
  className?: string
}

// Small contextual pointer from a feature page back to its matching Help
// Center article. Kept as a plain server-renderable component (no client
// state) so it can be dropped into either server or client page headers.
//
// useTranslations rather than getTranslations because this renders in both:
// /profile is a Server Component while every other caller is a Client one, and
// the hook form is the one next-intl supports in both without making the
// component async.
export function DocsHelpLink({ href, label, className = '' }: DocsHelpLinkProps): React.JSX.Element {
  const t = useTranslations('common')
  const text = label ?? t('howThisWorks')
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium text-outline hover:text-primary transition-colors flex-shrink-0 ${className}`}
    >
      <HelpCircle className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{text}</span>
    </Link>
  )
}
