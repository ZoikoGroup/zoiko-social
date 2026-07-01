'use client'

import { ImageIcon, Calendar, FileText } from 'lucide-react'

export function CreatePostBox(): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 border border-outline-variant">
          AR
        </div>
        <button className="flex-1 text-left px-4 py-2.5 bg-surface-container-low hover:bg-surface-variant/50 transition-colors rounded-full text-on-surface-variant text-label-md border border-outline-variant/20 cursor-pointer">
          Share an update, rescue case, or expert tip...
        </button>
      </div>
      <div className="flex justify-around px-2 pt-1 border-t border-outline-variant/10">
        <button className="flex items-center gap-2 text-label-md text-on-surface-variant font-semibold hover:bg-surface-container px-3 py-2 rounded-lg transition-colors cursor-pointer">
          <ImageIcon className="w-5 h-5 text-primary" />
          <span className="hidden sm:inline">Media</span>
        </button>
        <button className="flex items-center gap-2 text-label-md text-on-surface-variant font-semibold hover:bg-surface-container px-3 py-2 rounded-lg transition-colors cursor-pointer">
          <Calendar className="w-5 h-5 text-secondary" />
          <span className="hidden sm:inline">Event</span>
        </button>
        <button className="flex items-center gap-2 text-label-md text-on-surface-variant font-semibold hover:bg-surface-container px-3 py-2 rounded-lg transition-colors cursor-pointer">
          <FileText className="w-5 h-5 text-tertiary" />
          <span className="hidden sm:inline">Write Article</span>
        </button>
      </div>
    </div>
  )
}
