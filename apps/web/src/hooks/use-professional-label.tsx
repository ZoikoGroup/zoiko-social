'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PROFESSIONAL_CATEGORY_LABELS } from '@/lib/api'

/**
 * Translated name for a professional category ("Product Seller", "Veterinarian").
 *
 * The slugs come from the API and are used as catalog keys directly. Falls back
 * to the English map in lib/api and then to the raw slug, so a category added
 * server-side still renders something readable before its key is written.
 */
export function useProfessionalLabel(): (slug: string | null | undefined) => string | null {
  const t = useTranslations('professional')

  return useCallback(
    (slug) => {
      if (!slug) return null
      if (t.has(slug)) return t(slug)
      return PROFESSIONAL_CATEGORY_LABELS[slug] ?? slug
    },
    [t],
  )
}
