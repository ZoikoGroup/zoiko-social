'use client'

import { useState } from 'react'
import { X, CheckCircle2, MapPin, Send } from 'lucide-react'
import type { LostPet } from './LostPetCard'

interface MarkFoundModalProps {
  open: boolean
  onClose: () => void
  pet: LostPet
  onConfirm: () => void
}

export function MarkFoundModal({ open, onClose, pet, onConfirm }: MarkFoundModalProps): React.JSX.Element | null {
  const [message, setMessage] = useState('')
  const [location, setLocation] = useState('')
  const [sent, setSent] = useState(false)

  if (!open) return null

  function handleSubmit(): void {
    setSent(true)
    setTimeout(() => {
      onConfirm()
      setSent(false)
      setMessage('')
      setLocation('')
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {sent ? (
          /* Success state */
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-headline text-headline-md text-on-surface mb-2">Notification sent!</h3>
            <p className="text-label-md text-outline">
              <span className="font-semibold text-on-surface">{pet.ownerName}</span> has been notified that you may have found <span className="font-semibold text-on-surface">{pet.petName}</span>. They will reach out to you shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-headline text-headline-md text-on-surface">I found {pet.petName}!</h2>
                  <p className="text-label-sm text-outline">Notify the owner</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pet summary */}
            <div className="px-5 pt-4 flex items-center gap-3 bg-surface-container-low mx-5 mt-4 rounded-xl p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pet.image} alt={pet.petName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-label-md text-on-surface">{pet.petName}</p>
                <p className="text-[11px] text-outline">{pet.breed} · Last seen {pet.lastSeenLocation}</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
                  Where did you find them? <span className="text-secondary">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Near Central Park, north entrance"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
                  Message to owner <span className="text-outline font-normal">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`e.g. I found ${pet.petName} near the park. They seem safe and friendly. Please contact me.`}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <p className="text-[11px] text-outline">
                Sending this will notify <span className="font-semibold text-on-surface">{pet.ownerName}</span> with your profile and the location details. Your contact info will be shared with them.
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!location.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Notify Owner
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
