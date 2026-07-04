'use client'

import { useState } from 'react'
import { X, Stethoscope, ShoppingBag, HandHeart, Newspaper, Check, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { profileApi, type ProfessionalProfile } from '@/lib/api'

interface Category {
  slug: string
  label: string
  description: string
  Icon: LucideIcon
}

// The four professional categories supported by the platform
const CATEGORIES: Category[] = [
  { slug: 'veterinarian',              label: 'Veterinarian',              description: 'Licensed animal medical professional — accept appointments',  Icon: Stethoscope },
  { slug: 'pet_care_service_provider', label: 'Pet Care Service Provider', description: 'Grooming, boarding, training, sitting and care services',      Icon: HandHeart   },
  { slug: 'product_seller',            label: 'Product Seller',            description: 'Sell pet food, toys, and accessories on the marketplace',      Icon: ShoppingBag },
  { slug: 'verified_news_publisher',   label: 'Verified News Publisher',   description: 'Publish blogs and submit verified animal-welfare news',        Icon: Newspaper   },
]

interface SwitchProfessionalModalProps {
  open: boolean
  onClose: () => void
  onSwitched: (professional: ProfessionalProfile) => void
}

export function SwitchProfessionalModal({ open, onClose, onSwitched }: SwitchProfessionalModalProps): React.JSX.Element | null {
  const [selected, setSelected] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const selectedCategory = CATEGORIES.find((c) => c.slug === selected)

  async function handleConfirm(): Promise<void> {
    if (!selected) return
    setSubmitting(true)
    setError('')
    try {
      const professional = await profileApi.switchToProfessional({
        category: selected,
        ...(businessName.trim() ? { businessName: businessName.trim() } : {}),
      })
      onSwitched(professional)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to switch account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 flex-shrink-0">
          <div>
            <h2 className="font-headline text-headline-md text-on-surface">Switch to Professional</h2>
            <p className="text-label-sm text-outline mt-0.5">
              Your posts, followers, and messages stay exactly the same
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category grid */}
        <div className="overflow-y-auto p-6 space-y-3 flex-1">
          {CATEGORIES.map((category) => {
            const isSelected = selected === category.slug
            return (
              <button
                key={category.slug}
                onClick={() => setSelected(category.slug)}
                className={`relative w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary/10' : 'bg-surface-container-low'}`}>
                  <category.Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-outline'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-label-md text-on-surface">{category.label}</p>
                  <p className="text-[11px] text-outline mt-0.5">{category.description}</p>
                </div>
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </button>
            )
          })}

          {selected && (
            <div className="pt-2">
              <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
                Business / practice name <span className="text-outline font-normal">(optional)</span>
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                maxLength={100}
                placeholder={selectedCategory?.slug === 'veterinarian' ? 'e.g. Paws Clinic' : 'e.g. Happy Tails Store'}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || submitting}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Switching…' : selectedCategory ? `Continue as ${selectedCategory.label}` : 'Select a category'}
          </button>
        </div>
      </div>
    </div>
  )
}
