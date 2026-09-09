'use client'

import { useState } from 'react'
import { X, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export interface LocationPickerModalProps {
  onClose: () => void
  onSend: (location: { lat: number; lng: number; label?: string }) => void
}

export function LocationPickerModal({ onClose, onSend }: LocationPickerModalProps): React.JSX.Element {
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState('')
  const { error: toastError } = useToast()

  const handleShareCurrentLocation = () => {
    setLoading(true)
    if (!navigator.geolocation) {
      toastError('Geolocation not supported', 'Your browser does not support location sharing.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false)
        const trimmed = label.trim()
        onSend({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          ...(trimmed ? { label: trimmed } : {}),
        })
      },
      (err) => {
        setLoading(false)
        toastError('Failed to get location', err.message)
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
          <h3 className="text-base font-semibold text-foreground">Share Location</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Location label (optional)</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. My Home, Central Park..."
              maxLength={50}
              autoFocus
            />
          </div>

          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleShareCurrentLocation}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}
            Share Current Location
          </Button>
        </div>
      </div>
    </div>
  )
}
