'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * Floating "back to top" button, Instagram-style.
 *
 * Appears only once the reader has scrolled past the fold — at the top of the
 * page it would point at nothing — and rides above the mobile tab bar and its
 * "+" tray button without covering either (they sit lower and to the right).
 */
export function ScrollTopButton(): React.JSX.Element | null {
  const t = useTranslations('feed')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = (): void => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('scrollToTop')}
      title={t('scrollToTop')}
      className="fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 md:bottom-8 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-surface-container-lowest border border-outline-variant/40 shadow-lg text-on-surface hover:bg-surface-container-low hover:border-outline-variant/70 active:scale-95 transition-all cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
