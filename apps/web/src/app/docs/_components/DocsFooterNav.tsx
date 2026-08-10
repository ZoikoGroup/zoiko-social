import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getAdjacentDocs } from '../_lib/nav'

export function DocsFooterNav({ currentSlug }: { currentSlug: string }): React.JSX.Element {
  const { prev, next } = getAdjacentDocs(currentSlug)

  return (
    <div className="mt-16 pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row gap-3 sm:justify-between">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-lowest transition-colors group flex-1 sm:max-w-[48%]"
        >
          <ArrowLeft className="w-4 h-4 text-outline flex-shrink-0 group-hover:text-primary transition-colors" />
          <span className="min-w-0">
            <span className="block text-[11px] text-outline">Previous</span>
            <span className="block text-[13.5px] font-semibold text-on-surface truncate">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div className="flex-1 sm:max-w-[48%]" />
      )}
      {next && (
        <Link
          href={`/docs/${next.slug}`}
          className="flex items-center justify-end gap-2.5 px-4 py-3 rounded-xl border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-lowest transition-colors group flex-1 sm:max-w-[48%] text-right"
        >
          <span className="min-w-0">
            <span className="block text-[11px] text-outline">Next</span>
            <span className="block text-[13.5px] font-semibold text-on-surface truncate">{next.title}</span>
          </span>
          <ArrowRight className="w-4 h-4 text-outline flex-shrink-0 group-hover:text-primary transition-colors" />
        </Link>
      )}
    </div>
  )
}
