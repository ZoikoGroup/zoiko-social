'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, PawPrint, ArrowLeft, Home } from 'lucide-react'

interface SuccessScreenProps {
  type: 'adoption' | 'rescue'
  onReset: () => void
}

export function SuccessScreen({ type, onReset }: SuccessScreenProps): React.JSX.Element {
  const isAdoption = type === 'adoption'
  const [referenceId] = useState(() =>
    `${isAdoption ? 'ZSA-' : 'ZSR-'}${Date.now().toString(36).toUpperCase()}`,
  )

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in zoom-in duration-500">
      {/* Success icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-300 delay-150">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        {/* Floating paw prints */}
        <PawPrint className="absolute -top-2 -right-2 w-6 h-6 text-secondary/40 animate-bounce" />
        <PawPrint className="absolute -bottom-1 -left-3 w-4 h-4 text-primary/30 rotate-12 animate-in slide-in-from-bottom-2 duration-500 delay-500" />
      </div>

      {/* Text */}
      <h2 className="font-headline text-headline-md text-on-surface text-center mb-2">
        {isAdoption ? 'Listing Submitted Successfully!' : 'Rescue Report Submitted!'}
      </h2>
      <p className="text-body-md text-outline text-center max-w-md mb-8">
        {isAdoption
          ? 'Your pet adoption listing has been submitted for review. Our team will verify the details and publish it shortly. You\'ll receive a notification once it\'s live.'
          : 'Your rescue report has been received. Our team will review the situation and coordinate with nearby rescuers. Please stay available in case we need more information.'}
      </p>

      {/* ID badge */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/5 border border-primary/10 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {isAdoption ? (
            <PawPrint className="w-5 h-5 text-primary" />
          ) : (
            <CheckCircle className="w-5 h-5 text-secondary" />
          )}
        </div>
        <div>
          <p className="text-label-sm text-outline">Reference ID</p>
          <p className="text-label-md font-bold text-on-surface font-mono tracking-wider">
            {referenceId}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Submit Another
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
