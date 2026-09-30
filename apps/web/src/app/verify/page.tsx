/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Check, ChevronRight, UploadCloud, Building2, Store, HeartPulse, FileText, Loader2, Trash2 } from 'lucide-react'
import { profileApi, type VerificationRequest } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { uploadVerificationFile } from '@/lib/community-image'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_MAP: Record<string, { icon: React.ReactNode, title: string, desc: string }> = {
  product_seller: { icon: <Store className="w-6 h-6 text-blue-500" />, title: 'Product Seller', desc: 'List and sell pet products in the ZoikoSocial Marketplace.' },
  pet_care_service_provider: { icon: <HeartPulse className="w-6 h-6 text-rose-500" />, title: 'Pet Care Provider', desc: 'Offer grooming, boarding, sitting, or training services.' },
  veterinarian: { icon: <Building2 className="w-6 h-6 text-emerald-500" />, title: 'Veterinarian', desc: 'List your clinic, offer consultations, and manage bookings.' }
}

export default function VerifyPage(): React.JSX.Element {
  const { profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationRequest | null>(null)

  // Step 1: Category
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Step 2: Details
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')

  // Step 3: Documents
  const [idDocUrl, setIdDocUrl] = useState('')
  const [licenseDocUrl, setLicenseDocUrl] = useState('')
  const [uploadingDoc, setUploadingDoc] = useState<'id' | 'license' | null>(null)

  useEffect(() => {
    if (!loading && profile) {
      if (profile.professionalProfile) {
        setSelectedCategory(profile.professionalProfile.category)
        if (profile.professionalProfile) {
          setBusinessName(profile.professionalProfile.businessName || '')
          setBusinessEmail(profile.professionalProfile.businessEmail || '')
          setBusinessPhone(profile.professionalProfile.businessPhone || '')
          setBusinessAddress(profile.professionalProfile.businessAddress || '')
          setWebsiteUrl(profile.professionalProfile.websiteUrl || '')
          setLicenseNumber(profile.professionalProfile.licenseNumber || '')
        }
      }
      
      profileApi.getVerificationStatus().then((res) => {
        if (res && res.status !== 'rejected') {
          setVerificationStatus(res)
          setStep(4) // Skip to end if already pending or approved
        }
      }).catch(() => {})
    } else if (!loading && profile === null) {
      // Check if there is an active session before forcing login,
      // because refreshProfile might just be in progress.
      const checkSession = async () => {
        const { data } = await createClient().auth.getSession()
        if (!data.session) {
          router.push('/login?returnTo=/verify')
        }
      }
      void checkSession()
    }
  }, [loading, profile, router])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  if (!profile) {
    return <></>
  }

  const handleNextStep1 = async () => {
    if (!selectedCategory) return
    setStep(2)
  }

  const handleNextStep2 = async () => {
    setStep(3)
  }

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'license') => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    
    setUploadingDoc(type)
    try {
      const storagePath = await uploadVerificationFile(profile.id, file)
      if (type === 'id') setIdDocUrl(storagePath)
      if (type === 'license') setLicenseDocUrl(storagePath)
    } catch {
      toast.error('Upload failed', 'Could not upload document.')
    } finally {
      setUploadingDoc(null)
    }
  }

  const handleSubmitFinal = async () => {
    if (!idDocUrl) {
      toast.error('Missing ID', 'Please upload your Government ID.')
      return
    }
    if (selectedCategory === 'veterinarian' && !licenseDocUrl) {
      toast.error('Missing License', 'Please upload your Professional License.')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Strip empty strings to pass Zod validation on the backend
      const payload = {
        businessName,
        ...(businessEmail ? { businessEmail } : {}),
        ...(businessPhone ? { businessPhone } : {}),
        ...(businessAddress ? { businessAddress } : {}),
        ...(websiteUrl ? { websiteUrl } : {}),
        ...(selectedCategory === 'veterinarian' && licenseNumber ? { licenseNumber } : {})
      }

      // 1. Commit the professional profile changes only at the end
      if (!profile.professionalProfile) {
        await profileApi.switchToProfessional({
          category: selectedCategory,
          ...payload
        })
      } else {
        await profileApi.updateProfessional({
          category: selectedCategory,
          ...payload
        })
      }

      // 2. Create request
      const req = await profileApi.submitVerification({ type: 'professional', categorySlug: selectedCategory })
      
      // Attach docs
      await profileApi.uploadVerificationDocument(req.id, 'government_id', idDocUrl, 'Government ID')
      if (licenseDocUrl) {
        await profileApi.uploadVerificationDocument(req.id, 'business_license', licenseDocUrl, 'Business License')
      }
      
      setVerificationStatus({ status: 'pending' } as unknown as VerificationRequest)
      await refreshProfile()
      setStep(4)
    } catch (e: unknown) {
      toast.error('Error', (e as Error).message || 'Failed to submit verification request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="font-headline text-headline-lg font-bold text-on-surface">Get Verified</h1>
            <p className="text-body-lg text-on-surface-variant mt-2">Become a verified professional on ZoikoSocial to start selling products or listing services.</p>
          </div>

          {/* Stepper Header */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-label-sm font-bold ${step >= s ? 'bg-primary text-white' : 'bg-surface-container text-outline'}`}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className={`text-label-sm font-semibold whitespace-nowrap ${step >= s ? 'text-on-surface' : 'text-outline'}`}>
                    {s === 1 ? 'Category' : s === 2 ? 'Business Details' : 'Documents'}
                  </span>
                  {s < 3 && <ChevronRight className="w-4 h-4 text-outline mx-2" />}
                </div>
              ))}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-title-lg font-bold">1. Select your category</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(CATEGORY_MAP).map(([key, info]) => (
                  <button key={key} onClick={() => setSelectedCategory(key)} 
                    className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedCategory === key ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40'}`}>
                    <div className="mb-3">{info.icon}</div>
                    <h3 className="font-bold text-label-md text-on-surface mb-1">{info.title}</h3>
                    <p className="text-body-sm text-on-surface-variant leading-snug">{info.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={handleNextStep1} disabled={!selectedCategory || isSubmitting} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ChevronRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <h2 className="text-title-lg font-bold">2. Business Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-sm font-semibold">Business Name</label>
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:outline-none" placeholder="E.g. Paws & Claws" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-sm font-semibold">Business Email</label>
                  <input type="email" value={businessEmail} onChange={e => setBusinessEmail(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:outline-none" placeholder="contact@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-sm font-semibold">Business Phone</label>
                  <input type="tel" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:outline-none" placeholder="+91 9876543210" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-sm font-semibold">Website URL (Optional)</label>
                  <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:outline-none" placeholder="https://..." />
                </div>
                <div className={`space-y-1.5 ${selectedCategory === 'veterinarian' ? '' : 'md:col-span-2'}`}>
                  <label className="text-label-sm font-semibold">Business Address</label>
                  <input value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:outline-none" placeholder="Full address" />
                </div>
                {selectedCategory === 'veterinarian' && (
                  <div className="space-y-1.5">
                    <label className="text-label-sm font-semibold">License Number (Optional)</label>
                    <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:outline-none" placeholder="License Number" />
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-outline-variant/50 rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer">Back</button>
                <button onClick={handleNextStep2} disabled={!businessName || isSubmitting} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ChevronRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <h2 className="text-title-lg font-bold">3. Verification Documents</h2>
              <p className="text-body-md text-on-surface-variant">We need to verify your identity before you can list products or services. Your documents are stored securely.</p>
              
              <div className="space-y-5">
                <div className="p-5 border border-outline-variant/30 rounded-2xl bg-surface-container-lowest">
                  <h3 className="font-bold text-label-md mb-1">Government ID <span className="text-red-500">*</span></h3>
                  <p className="text-body-sm text-outline mb-4">Passport, Driving License, or National ID</p>
                  
                  {idDocUrl ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 text-emerald-700 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5" /> <span className="font-semibold text-sm">ID Uploaded Successfully</span>
                      </div>
                      <button onClick={() => setIdDocUrl('')} className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-800 transition-colors" title="Remove Document">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-outline-variant/50 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                      {uploadingDoc === 'id' ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                      <span className="font-medium text-sm">{uploadingDoc === 'id' ? 'Uploading...' : 'Click to upload'}</span>
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleUploadDoc(e, 'id')} disabled={uploadingDoc !== null} />
                    </label>
                  )}
                </div>

                <div className="p-5 border border-outline-variant/30 rounded-2xl bg-surface-container-lowest">
                  <h3 className="font-bold text-label-md mb-1">Business/Professional License {selectedCategory === 'veterinarian' && <span className="text-red-500">*</span>}</h3>
                  <p className="text-body-sm text-outline mb-4">Required for Veterinarians.</p>
                  
                  {licenseDocUrl ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 text-emerald-700 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5" /> <span className="font-semibold text-sm">License Uploaded Successfully</span>
                      </div>
                      <button onClick={() => setLicenseDocUrl('')} className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-800 transition-colors" title="Remove Document">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-outline-variant/50 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                      {uploadingDoc === 'license' ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                      <span className="font-medium text-sm">{uploadingDoc === 'license' ? 'Uploading...' : `Click to upload ${selectedCategory === 'veterinarian' ? '' : '(Optional)'}`}</span>
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleUploadDoc(e, 'license')} disabled={uploadingDoc !== null} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-outline-variant/50 rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer">Back</button>
                <button onClick={handleSubmitFinal} disabled={!idDocUrl || (selectedCategory === 'veterinarian' && !licenseDocUrl) || isSubmitting} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Request <Check className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success / Status */}
          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                {verificationStatus?.status === 'approved' ? <Check className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
              </div>
              <h2 className="text-headline-md font-bold text-on-surface mb-2">
                {verificationStatus?.status === 'approved' ? 'You are Verified!' : 'Verification Pending'}
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
                {verificationStatus?.status === 'approved' 
                  ? 'Your professional account has been verified. You can now start listing products and services on ZoikoSocial.' 
                  : 'We have received your documents! Our team will review them and get back to you within 48 hours. If approved, your account will instantly switch to Professional and you will receive an in-app notification and email.'}
              </p>
              <button onClick={() => router.push('/')} className="px-8 py-3 bg-surface-container-highest rounded-xl font-bold hover:bg-surface-container-high transition-colors cursor-pointer">
                Return to Home
              </button>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
