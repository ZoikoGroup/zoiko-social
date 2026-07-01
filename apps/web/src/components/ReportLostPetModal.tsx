'use client'

import { useState } from 'react'
import { X, Upload, Eye, Users, UserCheck, CheckCircle2 } from 'lucide-react'
import type { Visibility } from './LostPetCard'

interface ReportLostPetModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LostPetForm) => void
}

export interface LostPetForm {
  petName: string
  species: string
  breed: string
  age: string
  color: string
  lastSeenLocation: string
  lastSeenDate: string
  description: string
  visibility: Visibility
}

const VISIBILITY_OPTIONS: { value: Visibility; label: string; description: string; Icon: typeof Eye }[] = [
  { value: 'public',        label: 'Public',        description: 'Visible to everyone on ZoikoSocial',       Icon: Eye       },
  { value: 'communities',   label: 'Communities',   description: 'Visible to members of your communities',   Icon: Users     },
  { value: 'close-friends', label: 'Close Friends', description: 'Only your close friends can see this',      Icon: UserCheck },
]

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Reptile', 'Other']

export function ReportLostPetModal({ open, onClose, onSubmit }: ReportLostPetModalProps): React.JSX.Element | null {
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<LostPetForm>({
    petName: '', species: '', breed: '', age: '', color: '',
    lastSeenLocation: '', lastSeenDate: '', description: '',
    visibility: 'public',
  })

  if (!open) return null

  function update(field: keyof LostPetForm, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(): void {
    setSubmitted(true)
    setTimeout(() => {
      onSubmit(form)
      setSubmitted(false)
      setStep(1)
      setForm({ petName: '', species: '', breed: '', age: '', color: '', lastSeenLocation: '', lastSeenDate: '', description: '', visibility: 'public' })
      onClose()
    }, 1800)
  }

  const step1Valid = form.petName && form.species && form.lastSeenLocation && form.lastSeenDate
  const step2Valid = form.visibility

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {submitted ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-headline text-headline-md text-on-surface mb-2">Listing posted!</h3>
            <p className="text-label-md text-outline max-w-xs">
              Your lost pet report for <span className="font-semibold text-on-surface">{form.petName}</span> is now live. The community will help find them.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
              <div>
                <h2 className="font-headline text-headline-md text-on-surface">Report a Lost Pet</h2>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2].map((s) => (
                    <div key={s} className={`h-1 rounded-full transition-all ${step >= s ? 'bg-primary w-8' : 'bg-outline-variant w-4'}`} />
                  ))}
                  <span className="text-[11px] text-outline ml-1">Step {step} of 2</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {step === 1 ? (
                <>
                  {/* Photo upload */}
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                    <Upload className="w-8 h-8 text-outline group-hover:text-primary mx-auto mb-2 transition-colors" />
                    <p className="text-label-md font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Upload pet photo</p>
                    <p className="text-[11px] text-outline mt-0.5">A clear recent photo helps people identify your pet</p>
                  </div>

                  {/* Pet name */}
                  <div>
                    <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Pet name <span className="text-secondary">*</span></label>
                    <input value={form.petName} onChange={(e) => update('petName', e.target.value)}
                      placeholder="e.g. Luna" className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors" />
                  </div>

                  {/* Species */}
                  <div>
                    <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Species <span className="text-secondary">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {SPECIES.map((s) => (
                        <button key={s} onClick={() => update('species', s)}
                          className={`px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${form.species === s ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Breed, age, color row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { field: 'breed' as const,  label: 'Breed',  placeholder: 'e.g. Labrador' },
                      { field: 'age'   as const,  label: 'Age',    placeholder: 'e.g. 2 years'  },
                      { field: 'color' as const,  label: 'Colour', placeholder: 'e.g. Golden'   },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="text-label-sm font-semibold text-on-surface block mb-1.5">{label}</label>
                        <input value={form[field]} onChange={(e) => update(field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none transition-colors" />
                      </div>
                    ))}
                  </div>

                  {/* Last seen */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Last seen location <span className="text-secondary">*</span></label>
                      <input value={form.lastSeenLocation} onChange={(e) => update('lastSeenLocation', e.target.value)}
                        placeholder="e.g. Riverside Park"
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Date last seen <span className="text-secondary">*</span></label>
                      <input type="date" value={form.lastSeenDate} onChange={(e) => update('lastSeenDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none transition-colors" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Distinctive features / description</label>
                    <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
                      placeholder="Describe any unique markings, collar, chip, behaviour that could help identify your pet…"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors resize-none" />
                  </div>
                </>
              ) : (
                /* Step 2: Visibility */
                <div className="space-y-3">
                  <p className="text-label-md text-on-surface-variant">Who can see this lost pet listing?</p>
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => update('visibility', opt.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        form.visibility === opt.value ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'
                      }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${form.visibility === opt.value ? 'bg-primary/10' : 'bg-surface-container-low'}`}>
                        <opt.Icon className={`w-5 h-5 ${form.visibility === opt.value ? 'text-primary' : 'text-outline'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-label-md text-on-surface">{opt.label}</p>
                        <p className="text-[11px] text-outline mt-0.5">{opt.description}</p>
                      </div>
                      {form.visibility === opt.value && (
                        <CheckCircle2 className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}

                  <div className="bg-secondary/10 rounded-xl p-4 mt-2">
                    <p className="text-label-sm text-secondary font-semibold mb-1">How it works</p>
                    <ul className="text-[11px] text-on-surface-variant space-y-1 list-disc list-inside">
                      <li>Anyone who finds your pet can click <strong>&ldquo;I Found This Pet&rdquo;</strong></li>
                      <li>You receive an instant notification with their location and message</li>
                      <li>Once reunited, mark the listing as <strong>Reunited</strong> to close it</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
                  Back
                </button>
              )}
              {step === 1 ? (
                <button onClick={() => setStep(2)} disabled={!step1Valid}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  Next: Visibility
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!step2Valid}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  Post Lost Pet Report
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
