'use client'

import { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Navigation,
  AlertTriangle, AlertCircle, Heart, Camera,
  Loader2, ChevronDown, ChevronUp,
  Check, Clock,
} from 'lucide-react'
import { ImageUpload, type ImageFile } from './ImageUpload'
import { SuccessScreen } from './SuccessScreen'

interface FormData {
  fullName: string
  email: string
  phone: string
  animalType: string
  breed: string
  approximateAge: string
  gender: string
  emergencyLevel: string
  rescueType: string
  address: string
  city: string
  state: string
  pincode: string
  latitude: string
  longitude: string
  description: string
}

interface FormErrors {
  [key: string]: string
}

const ANIMAL_TYPES = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'reptile', label: 'Reptile' },
  { value: 'other', label: 'Other' },
]

const EMERGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-sage/10 text-sage border-sage/30', ringClass: 'ring-2 ring-offset-1 ring-primary/30', icon: '🟢' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-pale text-amber border-amber/30', ringClass: 'ring-2 ring-offset-1 ring-primary/30', icon: '🟡' },
  { value: 'high', label: 'High', color: 'bg-orange-50 text-orange-600 border-orange-300', ringClass: 'ring-2 ring-offset-1 ring-primary/30', icon: '🟠' },
  { value: 'critical', label: 'Critical', color: 'bg-red-50 text-error border-error/30', ringClass: 'ring-2 ring-offset-1 ring-error/50', icon: '🔴' },
]

const RESCUE_TYPES = ['Injured', 'Abandoned', 'Lost', 'Medical Emergency', 'Abuse Case', 'Other']

const INITIAL_FORM: FormData = {
  fullName: '', email: '', phone: '',
  animalType: '', breed: '', approximateAge: '', gender: '',
  emergencyLevel: '', rescueType: '',
  address: '', city: '', state: '', pincode: '',
  latitude: '', longitude: '',
  description: '',
}

export function RescueForm(): React.JSX.Element {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [images, setImages] = useState<ImageFile[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('reporter')
  const [gettingLocation, setGettingLocation] = useState(false)

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
    if (!form.animalType) errs.animalType = 'Animal type is required'
    if (!form.emergencyLevel) errs.emergencyLevel = 'Emergency level is required'
    if (!form.address.trim() && !form.latitude.trim()) errs.location = 'Location is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    else if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters'
    if (images.length === 0) errs.images = 'At least one image is required'

    setErrors(errs)
    return errs
  }

  function toggleSection(section: string): void {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  function getCurrentLocation(): void {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: 'Geolocation is not supported by your browser' }))
      return
    }
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateField('latitude', pos.coords.latitude.toString())
        updateField('longitude', pos.coords.longitude.toString())
        setGettingLocation(false)
      },
      () => {
        setErrors((prev) => ({ ...prev, location: 'Unable to get location. Please enter address manually.' }))
        setGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function getProgress(): number {
    let completed = 0
    if (form.fullName && form.email && form.phone) completed++
    if (form.animalType) completed++
    if (form.emergencyLevel) completed++
    if (form.address || form.latitude) completed++
    if (form.description.length >= 20) completed++
    if (images.length > 0) completed++
    return Math.round((completed / 6) * 100)
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <SuccessScreen
        type="rescue"
        onReset={() => { setForm(INITIAL_FORM); setImages([]); setSubmitted(false); setErrors({}) }}
      />
    )
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
          <span className="text-label-sm font-semibold text-on-surface">Report Progress</span>
          <span className="text-label-sm text-outline">{getProgress()}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
          <div
            className="h-full rounded-full bg-secondary transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Reporter Details */}
      <div className={sectionClass('reporter')}>
        <button type="button" onClick={() => toggleSection('reporter')} className={sectionHeaderClass('reporter')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Reporter Details</span>
          </div>
          {expandedSection === 'reporter' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'reporter' && (
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
          </div>
        )}
      </div>

      {/* Animal Information */}
      <div className={sectionClass('animal')}>
        <button type="button" onClick={() => toggleSection('animal')} className={sectionHeaderClass('animal')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Animal Information</span>
          </div>
          {expandedSection === 'animal' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'animal' && (
          <div className="px-5 pb-5 space-y-4">
            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-2 block">
                Animal Type <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ANIMAL_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField('animalType', value)}
                    className={`py-2.5 rounded-xl border-2 text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                      form.animalType === value
                        ? 'border-secondary bg-secondary/5 text-secondary'
                        : 'border-outline-variant text-outline hover:border-secondary/30 hover:bg-surface-container'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.animalType && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.animalType}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Breed <span className="text-outline font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={form.breed}
                  onChange={(e) => updateField('breed', e.target.value)}
                  placeholder="Breed (if known)"
                  className={inputClass('breed')}
                />
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Approximate Age</label>
                <input
                  type="text"
                  value={form.approximateAge}
                  onChange={(e) => updateField('approximateAge', e.target.value)}
                  placeholder="e.g. ~2 years"
                  className={inputClass('approximateAge')}
                />
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Gender <span className="text-outline font-normal">(Optional)</span></label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className={inputClass('gender')}
                >
                  <option value="">Unknown</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rescue Information */}
      <div className={sectionClass('rescue')}>
        <button type="button" onClick={() => toggleSection('rescue')} className={sectionHeaderClass('rescue')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-error" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Rescue Information</span>
          </div>
          {expandedSection === 'rescue' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'rescue' && (
          <div className="px-5 pb-5 space-y-4">
            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-2 block">
                Emergency Level <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EMERGENCY_LEVELS.map(({ value, label, color, icon, ringClass }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField('emergencyLevel', value)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                      form.emergencyLevel === value
                        ? `${color} ${ringClass}`
                        : 'border-outline-variant text-outline hover:border-outline'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
              {errors.emergencyLevel && <p className="text-label-sm text-error mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.emergencyLevel}</p>}
            </div>

            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-2 block">Rescue Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {RESCUE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('rescueType', type)}
                    className={`py-2.5 rounded-xl border-2 text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                      form.rescueType === type
                        ? 'border-secondary bg-secondary/5 text-secondary'
                        : 'border-outline-variant text-outline hover:border-secondary/30 hover:bg-surface-container'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Details */}
      <div className={sectionClass('location')}>
        <button type="button" onClick={() => toggleSection('location')} className={sectionHeaderClass('location')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Location Details</span>
          </div>
          {expandedSection === 'location' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'location' && (
          <div className="px-5 pb-5 space-y-4">
            <div>
              <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
                Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-outline" />
                <textarea
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Enter the address where the animal was spotted"
                  rows={2}
                  className={`${inputClass('address')} pl-10 resize-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                  className={inputClass('city')}
                />
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State"
                  className={inputClass('state')}
                />
              </div>
              <div>
                <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  placeholder="Pincode"
                  className={inputClass('pincode')}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 text-primary text-label-sm font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Navigation className={`w-4 h-4 ${gettingLocation ? 'animate-spin' : ''}`} />
                {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
              </button>
              {form.latitude && form.longitude && (
                <span className="text-label-sm text-outline">
                  {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
                </span>
              )}
            </div>

            {errors.location && <p className="text-label-sm text-error flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.location}</p>}
          </div>
        )}
      </div>

      {/* Description */}
      <div className={sectionClass('description')}>
        <button type="button" onClick={() => toggleSection('description')} className={sectionHeaderClass('description')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-tertiary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Description &amp; Situation</span>
          </div>
          {expandedSection === 'description' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'description' && (
          <div className="px-5 pb-5">
            <label className="text-label-sm font-semibold text-on-surface mb-1.5 block">
              Detailed Description <span className="text-error">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the situation in detail — what happened, the animal's condition, when you found them, any immediate actions taken..."
              rows={5}
              className={`${inputClass('description')} resize-none`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-label-sm text-error flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
              <span className="text-label-sm text-outline ml-auto">{form.description.length} characters</span>
            </div>
          </div>
        )}
      </div>

      {/* Photos */}
      <div className={sectionClass('media')}>
        <button type="button" onClick={() => toggleSection('media')} className={sectionHeaderClass('media')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Camera className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-label-md font-bold text-on-surface">Photos</span>
          </div>
          {expandedSection === 'media' ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>
        {expandedSection === 'media' && (
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
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-white font-bold text-label-md hover:bg-secondary/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] shadow-lg shadow-secondary/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Rescue Report...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Submit Rescue Report
            </>
          )}
        </button>
      </div>
    </form>
  )
}
