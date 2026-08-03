'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { ReportContentModal } from '@/components/ReportContentModal'
import type { ReportTargetType } from '@/lib/api'

/**
 * Self-contained "Report" control.
 *
 * Posts, comments, messages, stories and accounts had a report path; adoption
 * listings, lost-and-found reports, events, products, clinic listings, breeding
 * profiles and communities did not — which is a problem, because a fake
 * adoption listing or an unlicensed breeder is exactly the kind of thing only a
 * member is placed to notice. Bundling the trigger and the modal together keeps
 * adding it to a page a one-line change.
 */

interface ReportButtonProps {
  targetType: ReportTargetType
  targetId: string
  /** `text` for a detail page; `icon` where space is tight. */
  variant?: 'text' | 'icon'
  className?: string
}

export function ReportButton({
  targetType,
  targetId,
  variant = 'text',
  className = '',
}: ReportButtonProps): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Report"
          title="Report"
          className={`p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer ${className}`}
        >
          <Flag className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center gap-1.5 text-label-sm font-semibold text-outline hover:text-red-600 transition-colors cursor-pointer ${className}`}
        >
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>
      )}

      {open && (
        <ReportContentModal
          targetType={targetType}
          targetId={targetId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
