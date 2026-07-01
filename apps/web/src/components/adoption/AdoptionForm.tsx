'use client'

import { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Building2,
  PawPrint, Dog, Cat, Bird, Fish,
  Calendar, Weight, Heart,
  ImageIcon, Loader2,
  AlertCircle, ChevronDown, ChevronUp,
  Check,
} from 'lucide-react'
import { ImageUpload, type ImageFile } from './ImageUpload'
import { SuccessScreen } from './SuccessScreen'

interface FormData {
  // Owner details
  fullName: string
  email: string
  phone: string
  city: string
  state: string
  // Pet details
  petName: string
  petType: string
  breed: string
  age: string
  gender: string
  weight: string
  color: string
  vaccinationStatus: string
  healthConditions: string
  sterilized: string
  friendlyWithChildren: string
  friendlyWithPets: string
  // Adoption details
  reason: string
  adoptionFee: string
  additionalNotes: string
}

interface FormErrors {
  [key: string]: string
}

const PET_TYPES = [
  { value: 'dog', label: 'Dog', Icon: Dog },
  { value: 'cat', label: 'Cat', Icon: Cat },
  { value: 'bird', label: 'Bird', Icon: Bird },
  { value: 'rabbit', label: 'Rabbit', Icon: PawPrint },
  { value: 'fish', label: 'Fish', Icon: Fish },
  { value: 'other', label: 'Other', Icon: PawPrint },
]

const GENDERS = ['Male', 'Female', 'Unknown']
const VACCINATION_OPTIONS = ['Up to Date', 'Partial', 'Not Vaccinated', 'Unknown']
const YES_NO = ['Yes', 'No']

const INITIAL_FORM: FormData = {
  fullName: '', email: '', phone: '', city: '', state: '',
  petName: '', petType: '', breed: '', age: '', gender: '',
  weight: '', color: '', vaccinationStatus: '', healthConditions: '',
  sterilized: '', friendlyWithChildren: '', friendlyWithPets: '',
  reason: '', adoptionFee: '', additionalNotes: '',
}

export function AdoptionForm(): React.JSX.Element {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [images, setImages] = useState<ImageFile[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('owner')

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}

    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^[\d\s\-+()]{7,20}$/.test(form.phone)) errs.phone = 'Invalid phone number'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.state.trim()) errs.state = 'State is required'

    if (!form.petName.trim()) errs.petName = 'Pet name is required'
    if (!form.petType) errs.petType = 'Pet type is required'
    if (!form.age.trim()) errs.age = 'Age is required'
    if (images.length === 0) errs.images = 'At least one photo is required'

    setErrors(errs)
    return errs
  }

  function toggleSection(section: string): void {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  function getProgress(): number {
    let completed = 0
    const total = 6
    if (form.fullName && form.email && form.phone && form.city && form.state) completed++
    if (form.petName && form.petType && form.age) completed++
    if (form.reason) completed++
    if (images.length > 0) completed++
    if (form.gender) completed++
    if (form.vaccinationStatus) completed++
    return Math.round((completed / total) * 100)
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    const errs = validate()
    const hasErrors = Object.keys(errs).length > 0
    if (hasErrors) {
      const firstError = Object.keys(errs)[0]
      if (firstError) {
        if (['fullName', 'email', 'phone', 'city', 'state'].includes(firstError)) setExpandedSection('owner')
        else if (['petName', 'petType', 'age'].includes(firstError)) setExpandedSection('pet')
        else if (['reason'].includes(firstError)) setExpandedSection('adoption')
        else if (firstError === 'images') setExpandedSection('photos')
      }
      return
    }

    setSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return <SuccessScreen type="adoption" onReset={() => { setForm(INITIAL_FORM); setImages([]); setSubmitted(false); setErrors({}) }} />
  }

  const sectionClass = (section: string) =>
    `rounded-xl border ${expandedSection === section ? 'border-primary/30 bg-surface-container-lowest shadow-sm' : 'border-outline-variant/30 bg-surface-container-lowest'} overflow-hidden transition-all duration-200`

  const sectionHeaderClass = (section: string) =>
    `w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${expandedSection === section ? 'bg-primary/5' : 'hover:bg-surface-container'}`

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-body-md bg-surface-container-low text-on-surface placeholder:text-outline/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
      errors[field] ? 'border-error' : 'border-outline-variant'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Progress indicator */}
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4 -mx-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm font-semibold text-on-surface">Listing Progress</span>
          <span className="text-label-sm text-outline">{getProgress()}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Owner Details */}
      <div className={sectionClass('owner')}>
        <button type="button" onClick={() => toggleSection('owner')} className={sectionHeaderClass('owner')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Owner Details</span>
          </div>
          {expandedSection === 'owner' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'owner' && (
          <div className="px-5 pb-5 space-y-4">
            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                Full Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className={`${inputClass('fullName')} pl-10`}
                />
              </div>
              {errors.fullName && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Email <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`${inputClass('email')} pl-10`}
                  />
                </div>
                {errors.email && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Phone <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`${inputClass('phone')} pl-10`}
                  />
                </div>
                {errors.phone && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  City <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="City"
                    className={`${inputClass('city')} pl-10`}
                  />
                </div>
                {errors.city && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.city}</p>}
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  State <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder="State"
                    className={`${inputClass('state')} pl-10`}
                  />
                </div>
                {errors.state && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.state}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pet Details */}
      <div className={sectionClass('pet')}>
        <button type="button" onClick={() => toggleSection('pet')} className={sectionHeaderClass('pet')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Pet Details</span>
          </div>
          {expandedSection === 'pet' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'pet' && (
          <div className="px-5 pb-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Pet Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.petName}
                  onChange={(e) => updateField('petName', e.target.value)}
                  placeholder="Enter pet name"
                  className={inputClass('petName')}
                />
                {errors.petName && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.petName}</p>}
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Breed
                </label>
                <input
                  type="text"
                  value={form.breed}
                  onChange={(e) => updateField('breed', e.target.value)}
                  placeholder="e.g. Labrador, Persian"
                  className={inputClass('breed')}
                />
              </div>
            </div>

            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-2 block">
                Pet Type <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PET_TYPES.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField('petType', value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      form.petType === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant text-outline hover:border-primary/30 hover:bg-surface-container'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
              {errors.petType && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.petType}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Age <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="text"
                    value={form.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    placeholder="e.g. 2 years"
                    className={`${inputClass('age')} pl-10`}
                  />
                </div>
                {errors.age && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className={inputClass('gender')}
                >
                  <option value="">Select</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Weight</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    placeholder="e.g. 15 kg"
                    className={`${inputClass('weight')} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Color</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  placeholder="e.g. Golden"
                  className={inputClass('color')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Vaccination Status
                </label>
                <select
                  value={form.vaccinationStatus}
                  onChange={(e) => updateField('vaccinationStatus', e.target.value)}
                  className={inputClass('vaccinationStatus')}
                >
                  <option value="">Select status</option>
                  {VACCINATION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Health Conditions
                </label>
                <input
                  type="text"
                  value={form.healthConditions}
                  onChange={(e) => updateField('healthConditions', e.target.value)}
                  placeholder="None, or describe conditions"
                  className={inputClass('healthConditions')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Sterilized</label>
                <div className="flex gap-2">
                  {YES_NO.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('sterilized', opt)}
                      className={`flex-1 py-2 rounded-lg border-2 text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                        form.sterilized === opt
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant text-outline hover:border-primary/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Friendly with Children</label>
                <div className="flex gap-2">
                  {YES_NO.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('friendlyWithChildren', opt)}
                      className={`flex-1 py-2 rounded-lg border-2 text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                        form.friendlyWithChildren === opt
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant text-outline hover:border-primary/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Friendly with Other Pets</label>
                <div className="flex gap-2">
                  {YES_NO.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('friendlyWithPets', opt)}
                      className={`flex-1 py-2 rounded-lg border-2 text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                        form.friendlyWithPets === opt
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant text-outline hover:border-primary/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adoption Details */}
      <div className={sectionClass('adoption')}>
        <button type="button" onClick={() => toggleSection('adoption')} className={sectionHeaderClass('adoption')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-tertiary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Adoption Details</span>
          </div>
          {expandedSection === 'adoption' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'adoption' && (
          <div className="px-5 pb-5 space-y-4">
            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                Reason for Rehoming <span className="text-error">*</span>
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => updateField('reason', e.target.value)}
                placeholder="Please describe why you're rehoming this pet..."
                rows={3}
                className={`${inputClass('reason')} resize-none`}
              />
              {errors.reason && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.reason}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                  Adoption Fee <span className="text-outline font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={form.adoptionFee}
                  onChange={(e) => updateField('adoptionFee', e.target.value)}
                  placeholder="$0.00"
                  className={inputClass('adoptionFee')}
                />
              </div>
            </div>
            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                Additional Notes <span className="text-outline font-normal">(Optional)</span>
              </label>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder="Any other information potential adopters should know..."
                rows={3}
                className={`${inputClass('additionalNotes')} resize-none`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Photos */}
      <div className={sectionClass('photos')}>
        <button type="button" onClick={() => toggleSection('photos')} className={sectionHeaderClass('photos')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Pet Photos</span>
          </div>
          {expandedSection === 'photos' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'photos' && (
          <div className="px-5 pb-5">
            <ImageUpload
              images={images}
              onChange={setImages}
              error={errors.images}
              label="Upload Photos"
              maxImages={10}
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="sticky bottom-0 bg-background py-4 -mx-4 px-4 border-t border-outline-variant/20">
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-label-md hover:bg-primary/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] shadow-lg shadow-primary/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Listing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Submit Adoption Listing
            </>
          )}
        </button>
      </div>
    </form>
  )
}
