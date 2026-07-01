'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PawPrint, Truck, ChevronLeft } from 'lucide-react'
import { AdoptionForm } from '@/components/adoption/AdoptionForm'
import { RescueForm } from '@/components/adoption/RescueForm'

type TabType = 'adoption' | 'rescue'

function FormContent(): React.JSX.Element {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>(
    searchParams.get('tab') === 'rescue' ? 'rescue' : 'adoption'
  )

  return (
    <>
      {/* Tab Switcher */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-1.5 mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('adoption')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-label-md font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'adoption'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            <span>List Pet for Adoption</span>
          </button>
          <button
            onClick={() => setActiveTab('rescue')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-label-md font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'rescue'
                ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Report Animal for Rescue</span>
          </button>
        </div>
      </div>

      {/* Tab Indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${activeTab === 'adoption' ? 'bg-primary' : 'bg-surface-variant'}`} />
        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${activeTab === 'rescue' ? 'bg-secondary' : 'bg-surface-variant'}`} />
      </div>

      {/* Form */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === 'adoption' ? <AdoptionForm /> : <RescueForm />}
      </div>
    </>
  )
}

export default function NewAdoptionPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center h-14 gap-3">
            <Link
              href="/adoption"
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors text-outline hover:text-on-surface"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-label-md font-bold text-on-surface">Adoption &amp; Rescue</h1>
              <p className="text-[11px] text-outline">List a pet for adoption or report an animal in need</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <Suspense fallback={<div className="text-center py-8 text-outline">Loading...</div>}>
          <FormContent />
        </Suspense>
      </main>
    </div>
  )
}
