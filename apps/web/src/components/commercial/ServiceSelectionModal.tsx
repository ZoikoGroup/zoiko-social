'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import {
  ShoppingBag,
  Dna,
  HandHeart,
  Stethoscope,
  Check,
  AlertCircle,
  Sparkles,
  Loader2,
  Layers,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mutate } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

interface ServiceSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (activeServices: string[]) => void
  currentTier: 'starter' | 'professional' | 'premium' | string
  maxServicesAllowed: number
  initialSelectedServices?: string[]
}

interface ServiceOption {
  id: string
  title: string
  subtitle: string
  description: string
  limitsBadge: string
  icon: React.ElementType
}

const AVAILABLE_SERVICES: ServiceOption[] = [
  {
    id: 'seller',
    title: 'Pet Products Seller',
    subtitle: 'Marketplace & Shop',
    description: 'Publish and sell pet foods, accessories, toys, and supplies with full order enquiry management.',
    limitsBadge: 'Up to 100 active product listings',
    icon: ShoppingBag,
  },
  {
    id: 'breeder',
    title: 'Breeder & Stud Service',
    subtitle: 'Breeding Hub',
    description: 'Showcase verified breeding stock, health test records, genetic screenings, and track pipeline litters.',
    limitsBadge: 'Up to 5 active breeding profiles',
    icon: Dna,
  },
  {
    id: 'vet',
    title: 'Veterinary Clinic & Hospital',
    subtitle: 'Vet Practice & Surgery',
    description: 'List your veterinary clinic or animal hospital, accept appointments, clinical consults, and 24/7 emergencies.',
    limitsBadge: '1 clinic location · 10 team members · 50 clinical services',
    icon: Stethoscope,
  },
  {
    id: 'care',
    title: 'Pet Care & Boarding Provider',
    subtitle: 'Grooming, Boarding & Daycare',
    description: 'List your grooming salon, boarding kennel, daycare or walking business, and handle customer bookings.',
    limitsBadge: '1 facility location · 10 team members · 50 care services',
    icon: HandHeart,
  },
]

const emptySubscribe = () => () => {}

export function ServiceSelectionModal({
  isOpen,
  onClose,
  onSuccess,
  currentTier,
  maxServicesAllowed,
  initialSelectedServices = [],
}: ServiceSelectionModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [selected, setSelected] = useState<string[]>(initialSelectedServices)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshProfile } = useAuth()

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = prevOverflow
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    return undefined
  }, [isOpen, onClose])

  // Keep selected services in sync whenever the modal opens or parent passes loaded services
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (initialSelectedServices && initialSelectedServices.length > 0) {
          // If user currently holds more services than allowed (e.g. following plan downgrade), trim to limit
          if (initialSelectedServices.length > maxServicesAllowed) {
            setSelected(initialSelectedServices.slice(0, maxServicesAllowed))
          } else {
            setSelected(initialSelectedServices)
          }
        } else {
          // Fallback default for 1-service plan if none loaded
          setSelected(maxServicesAllowed === 1 ? ['seller'] : [])
        }
        setError(null)
      }, 0)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOpen, initialSelectedServices, maxServicesAllowed])

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const isOverCapacity = initialSelectedServices.length > maxServicesAllowed

  const handleToggle = (serviceId: string) => {
    setError(null)
    if (selected.includes(serviceId)) {
      // Must have at least 1 selected
      if (selected.length === 1) {
        setError('At least one active service must be selected.')
        return
      }
      setSelected(selected.filter((s) => s !== serviceId))
    } else {
      if (selected.length >= maxServicesAllowed) {
        if (maxServicesAllowed === 1) {
          // If 1 allowed, switch directly to the newly clicked service
          setSelected([serviceId])
          return
        }
        setError(`Your ${currentTier} plan allows up to ${maxServicesAllowed} active services. Deselect another service first or upgrade your plan.`)
        return
      }
      setSelected([...selected, serviceId])
    }
  }

  const handleSave = async () => {
    if (selected.length === 0) {
      setError('Please select at least 1 service.')
      return
    }
    try {
      setSaving(true)
      setError(null)
      const res = await mutate<{
        activeServices?: string[]
        data?: { activeServices?: string[] }
      }>('/commercial/select-services', {
        method: 'POST',
        body: JSON.stringify({ services: selected }),
      })
      const returnedServices =
        (Array.isArray(res?.activeServices) ? res.activeServices : null) ||
        (Array.isArray(res?.data?.activeServices) ? res.data.activeServices : null) ||
        selected
      onSuccess(returnedServices)
      void refreshProfile().catch(() => {})
      onClose()
    } catch (err) {
      setError((err as Error).message || 'Failed to update active services. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const isSingleServicePlan = maxServicesAllowed === 1

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface dark:bg-zinc-900 rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-outline-variant/20 flex items-start justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-on-surface">Choose Your Active Services</h2>
                <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {currentTier} Plan
                </span>
              </div>
              <p className="text-xs text-outline mt-0.5">
                Select <span className="font-semibold text-on-surface">{isSingleServicePlan ? '1 service' : maxServicesAllowed === 2 ? 'up to 2 services' : 'any or all services'}</span> to operate on your professional account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice for plan downgrade service reduction */}
        {isOverCapacity ? (
          <div className="px-6 py-3 bg-amber-500/15 border-b border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-sm text-on-surface">
                Your new plan includes {maxServicesAllowed} service{maxServicesAllowed > 1 ? 's' : ''}. Please select which service you wish to keep active.
              </p>
              <p className="text-[11px] text-outline dark:text-zinc-400 mt-0.5">
                You currently have {initialSelectedServices.length} active services. Select {maxServicesAllowed === 1 ? '1 service' : `up to ${maxServicesAllowed} services`} to retain. Unselected services will be paused.
              </p>
            </div>
          </div>
        ) : isSingleServicePlan ? (
          <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-[12px] text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Your plan includes <strong>1 active service</strong>. When you switch to a different service, listings from other services are automatically paused to prevent cross-service misuse.
            </span>
          </div>
        ) : null}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {AVAILABLE_SERVICES.map((srv) => {
              const isSelected = selected.includes(srv.id)
              const SrvIcon = srv.icon

              return (
                <div
                  key={srv.id}
                  onClick={() => handleToggle(srv.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? 'bg-primary/5 dark:bg-primary/15 border-primary ring-2 ring-primary/25 shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/50'
                  }`}
                >
                  {/* Indicator: Radio circle if 1 allowed, Checkbox if multi */}
                  <div className={`flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                    isSingleServicePlan
                      ? `w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary text-white' : 'border-outline text-transparent'}`
                      : `w-5 h-5 rounded-lg border-2 ${isSelected ? 'border-primary bg-primary text-white' : 'border-outline text-transparent'}`
                  }`}>
                    {isSelected && (
                      isSingleServicePlan ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )
                    )}
                  </div>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-primary'
                  }`}>
                    <SrvIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-on-surface truncate">{srv.title}</h4>
                        {isSelected && (
                          <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-primary text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-outline px-2 py-0.5 rounded bg-surface-container">
                        {srv.subtitle}
                      </span>
                    </div>

                    <p className="text-xs text-outline mt-1 leading-relaxed">{srv.description}</p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                        {srv.limitsBadge}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
          <div className="text-xs text-outline">
            Selected: <span className="font-bold text-on-surface">{selected.length}</span> of <span className="font-bold text-on-surface">{maxServicesAllowed}</span> allowed
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || selected.length === 0}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Confirm & Open Services
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
