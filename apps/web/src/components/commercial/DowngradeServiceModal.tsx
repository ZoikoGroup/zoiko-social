'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import {
  ShoppingBag,
  Dna,
  Stethoscope,
  HandHeart,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  ArrowRight,
  Loader2,
  X,
  Layers,
} from 'lucide-react'

export interface DowngradeTargetPlan {
  id: string
  name: string
  price: string
  maxServicesAllowed: number
}

interface DowngradeServiceModalProps {
  isOpen: boolean
  onClose: () => void
  targetPlan: DowngradeTargetPlan | null
  currentActiveServices: string[]
  onConfirm: (selectedServices: string[]) => void
  loading?: boolean
}

interface ServiceMeta {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
}

const SERVICE_META: Record<string, ServiceMeta> = {
  seller: {
    id: 'seller',
    title: 'Pet Products Seller',
    subtitle: 'Marketplace & Shop Listings',
    icon: ShoppingBag,
  },
  breeder: {
    id: 'breeder',
    title: 'Breeder & Stud Service',
    subtitle: 'Stud Dogs & Litter Records',
    icon: Dna,
  },
  vet: {
    id: 'vet',
    title: 'Veterinary Clinic & Hospital',
    subtitle: 'Clinical Consults & Bookings',
    icon: Stethoscope,
  },
  care: {
    id: 'care',
    title: 'Pet Care & Boarding Provider',
    subtitle: 'Grooming, Daycare & Boarding',
    icon: HandHeart,
  },
}

const emptySubscribe = () => () => {}

export function DowngradeServiceModal({
  isOpen,
  onClose,
  targetPlan,
  currentActiveServices,
  onConfirm,
  loading = false,
}: DowngradeServiceModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const allowedCount = targetPlan?.maxServicesAllowed || 1
  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    currentActiveServices.slice(0, targetPlan?.maxServicesAllowed || 1),
  )
  const [error, setError] = useState<string | null>(null)

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !loading) onClose()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = prevOverflow
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    return undefined
  }, [isOpen, onClose, loading])

  if (!isOpen || !mounted || !targetPlan || typeof document === 'undefined') return null

  const handleSelect = (serviceId: string) => {
    setError(null)
    if (allowedCount === 1) {
      // Single service plan (e.g. Starter): direct radio toggle
      setSelectedServices([serviceId])
      return
    }

    // Multi-service plan (e.g. Professional allows 2)
    if (selectedServices.includes(serviceId)) {
      if (selectedServices.length === 1) {
        setError(`Please keep at least 1 active service for your ${targetPlan.name} plan.`)
        return
      }
      setSelectedServices((prev) => prev.filter((s) => s !== serviceId))
    } else {
      if (selectedServices.length >= allowedCount) {
        // Swap with earliest selected
        setSelectedServices((prev) => [...prev.slice(1), serviceId])
      } else {
        setSelectedServices((prev) => [...prev, serviceId])
      }
    }
  }

  const handleConfirm = () => {
    if (selectedServices.length === 0) {
      setError('Please select which service you wish to keep active.')
      return
    }
    if (selectedServices.length > allowedCount) {
      setError(`Your ${targetPlan.name} plan only includes ${allowedCount} service${allowedCount > 1 ? 's' : ''}.`)
      return
    }
    onConfirm(selectedServices)
  }

  const droppedServices = currentActiveServices.filter((s) => !selectedServices.includes(s))

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => !loading && onClose()}
    >
      <div
        className="bg-surface-container-high dark:bg-zinc-900 border border-outline-variant/30 dark:border-white/10 rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-outline hover:text-on-surface dark:hover:text-white p-1.5 rounded-xl hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-on-surface">Plan Downgrade</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                Switching to {targetPlan.name} ({targetPlan.price}/mo)
              </span>
            </div>
            <p className="text-xs text-outline dark:text-zinc-400">
              Service selection required before proceeding to checkout
            </p>
          </div>
        </div>

        {/* Required Prompt Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-medium leading-relaxed">
          <p className="font-semibold text-sm text-on-surface mb-0.5">
            Your new plan includes {allowedCount} service{allowedCount > 1 ? 's' : ''}. Please select which service you wish to keep active.
          </p>
          <p className="text-[11px] text-outline dark:text-zinc-400">
            You currently have {currentActiveServices.length} active services. Choose which {allowedCount === 1 ? '1 service' : `up to ${allowedCount} services`} will stay online under your new plan.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Service Selection Cards */}
        <div className="space-y-2.5 max-h-[38vh] overflow-y-auto pr-1">
          {currentActiveServices.map((serviceId) => {
            const meta = SERVICE_META[serviceId] || {
              id: serviceId,
              title: serviceId.toUpperCase(),
              subtitle: 'Commercial service',
              icon: Layers,
            }
            const Icon = meta.icon
            const isSelected = selectedServices.includes(serviceId)

            return (
              <div
                key={serviceId}
                onClick={() => handleSelect(serviceId)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-primary/5 dark:bg-primary/10 border-primary shadow-sm ring-1 ring-primary/40'
                    : 'bg-surface-container/50 dark:bg-zinc-800/40 border-outline-variant/30 dark:border-white/5 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container dark:bg-zinc-800 text-outline'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-on-surface">{meta.title}</h4>
                    <p className="text-[11px] text-outline dark:text-zinc-400">{meta.subtitle}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Keep Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-medium">
                      <PauseCircle className="w-3.5 h-3.5" />
                      Will Pause
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Informational Pause Disclaimer */}
        {droppedServices.length > 0 && (
          <div className="p-3 rounded-xl bg-surface-container/60 dark:bg-zinc-800/50 border border-outline-variant/20 dark:border-white/5 text-[11px] text-outline dark:text-zinc-400 space-y-1">
            <p className="font-semibold text-on-surface">
              What happens to unselected services?
            </p>
            <p className="leading-relaxed">
              Active listings for <strong>{droppedServices.map((s) => SERVICE_META[s]?.title || s).join(', ')}</strong> will be automatically paused to adhere to your new plan&apos;s limits. Your data is safely stored and can be unpaused anytime if you upgrade again.
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/40 dark:border-zinc-700 text-on-surface font-semibold text-xs hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Keep Current Plan
          </button>
          <button
            type="button"
            disabled={loading || selectedServices.length === 0}
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.99] text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Proceeding...
              </>
            ) : (
              <>
                Confirm & Downgrade
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
