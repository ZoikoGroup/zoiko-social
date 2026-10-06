/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import {
  Check,
  ChevronRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Lock,
  Globe2,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { mutate, request } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

export default function VerifyPage(): React.JSX.Element {
  const { profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  const [legalName, setLegalName] = useState('')
  const [country, setCountry] = useState('India')
  const [initiating, setInitiating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAlreadyApproved = profile?.identityStatus === 'approved'

  // Pre-fill legal name from displayName if empty
  useEffect(() => {
    if (profile?.displayName && !legalName) {
      setLegalName(profile.displayName)
    }
  }, [profile, legalName])

  // Handle return from Didit hosted session
  useEffect(() => {
    const isReturning = searchParams.get('session_complete') === 'true'
    const storedSessionId = typeof window !== 'undefined' ? sessionStorage.getItem('didit_active_session_id') : null
    const storedLegalName = typeof window !== 'undefined' ? sessionStorage.getItem('didit_submitted_legal_name') : null

    if (isReturning && storedSessionId && !isAlreadyApproved) {
      async function completeDidit() {
        setConfirming(true)
        setError(null)
        try {
          const res = await mutate<{ success?: boolean; status?: string; verifiedFullName?: string; data?: { success?: boolean; status?: string; verifiedFullName?: string } }>(
            '/profiles/me/verification/didit/confirm',
            {
              method: 'POST',
              body: JSON.stringify({
                sessionId: storedSessionId,
                legalName: storedLegalName || undefined,
              }),
            },
          )

          const isSuccess = res?.success ?? res?.data?.success
          if (isSuccess) {
            toast.success('Identity Verified!', 'Your official national identity was verified successfully.')
            await refreshProfile()
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('didit_active_session_id')
              sessionStorage.removeItem('didit_submitted_legal_name')
            }
          }
        } catch (err: unknown) {
          const e = err as { message?: string }
          setError(e.message || 'Identity verification could not be confirmed. Please try again.')
        } finally {
          setConfirming(false)
        }
      }
      completeDidit()
    }
  }, [searchParams, isAlreadyApproved, refreshProfile, toast])

  useEffect(() => {
    if (!loading && profile === null) {
      const checkSession = async () => {
        const { data } = await createClient().auth.getSession()
        if (!data.session) {
          router.push('/login?returnTo=/verify')
        }
      }
      void checkSession()
    }
  }, [loading, profile, router])

  if (loading || confirming) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold text-outline">
          {confirming ? 'Confirming your biometric identity with Didit...' : 'Loading profile...'}
        </p>
      </div>
    )
  }

  if (!profile) return <></>

  const handleStartDidit = async () => {
    if (!legalName.trim()) {
      setError('Please provide your full legal name matching your government ID.')
      return
    }

    setInitiating(true)
    setError(null)

    try {
      const returnUrl = `${window.location.origin}/verify?session_complete=true`
      const res = await mutate<{ sessionId?: string; sessionUrl?: string; data?: { sessionId?: string; sessionUrl?: string } }>(
        '/profiles/me/verification/didit/session',
        {
          method: 'POST',
          body: JSON.stringify({ returnUrl }),
        },
      )

      const sessionId = res?.sessionId ?? res?.data?.sessionId
      const sessionUrl = res?.sessionUrl ?? res?.data?.sessionUrl

      if (sessionId && sessionUrl) {
        sessionStorage.setItem('didit_active_session_id', sessionId)
        sessionStorage.setItem('didit_submitted_legal_name', legalName.trim())
        // Redirect directly to Didit secure identity workflow
        window.location.assign(sessionUrl)
      } else {
        throw new Error('Didit session URL not received.')
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Could not initiate identity verification session. Please try again.')
      setInitiating(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-headline text-3xl font-bold text-on-surface">
              {isAlreadyApproved ? 'Identity Verified' : 'Global Identity Self-Verification'}
            </h1>
            <p className="text-body-md text-outline mt-2 max-w-lg mx-auto">
              {isAlreadyApproved
                ? 'Your national government identity is permanently verified. You are authorized to purchase professional plans and list services.'
                : 'Verify your real identity globally via Didit. One identity links permanently to your account, protecting our pet community from scams and fraud.'}
            </p>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isAlreadyApproved ? (
            /* Already Verified Card */
            <div className="bg-surface-container-lowest border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6 shadow-xl shadow-emerald-500/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface">You Are Identity Verified</h3>
                <p className="text-sm text-outline mt-1 max-w-sm mx-auto">
                  Your government document and biometrics are permanently active. You can now choose a commercial plan or manage your professional listings.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => router.push('/settings?section=billing')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  View Professional Plans (Step 2)
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold border border-outline-variant/30 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Verification Form */
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container text-xs text-on-surface font-semibold border border-outline-variant/20">
                  <Globe2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>220+ Countries & Aadhaar</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container text-xs text-on-surface font-semibold border border-outline-variant/20">
                  <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Encrypted & Anti-Fraud</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container text-xs text-on-surface font-semibold border border-outline-variant/20">
                  <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Permanent Account Anchor</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Enter full name exactly as on Government ID"
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm font-medium focus:border-primary focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-outline mt-1.5">
                    Must match your Aadhaar, Passport, or Driver&apos;s License.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Document Issuing Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant/40 rounded-xl text-sm font-medium focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="India">India (Aadhaar, PAN, Passport, DL)</option>
                    <option value="United States">United States (State ID, Driver&apos;s License, Passport)</option>
                    <option value="United Kingdom">United Kingdom (Passport, Driving Licence)</option>
                    <option value="Canada">Canada (Driver&apos;s Licence, Passport)</option>
                    <option value="Australia">Australia (Driver Licence, Passport)</option>
                    <option value="Other">Other (220+ Global Jurisdictions)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-outline-variant/20">
                <button
                  onClick={handleStartDidit}
                  disabled={initiating || !legalName.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {initiating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting to Didit Secure Verification...
                    </>
                  ) : (
                    <>
                      Verify with Didit Self-Verification
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-outline mt-3">
                  You will be securely redirected to Didit to scan your document and complete a 10-second biometric selfie check.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
