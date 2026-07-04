'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle } from 'lucide-react'

export default function AuthCallbackPage(): React.JSX.Element {
  const router = useRouter()
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient()

      // Get the auth code from URL params
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        // Exchange the code for a session
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

        if (sessionError) {
          setError(sessionError.message)
          return
        }

        // Successfully authenticated — redirect to home
        router.push('/')
        return
      }

      // Check if there's already a session (from hash fragment)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')

      if (accessToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') ?? '',
        })

        if (sessionError) {
          setError(sessionError.message)
          return
        }

        router.push('/')
        return
      }

      // No code or token found
      setError('No authentication code found. Please try signing in again.')
    }

    void handleCallback()
  }, [router])

  async function handleRetry() {
    setRetrying(true)
    setError('')
    const supabase = createClient()

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError || !data.url) {
      setError('Failed to start Google sign-in. Please try again.')
      setRetrying(false)
      return
    }

    window.location.href = data.url
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface rounded-xl shadow-sm border border-outline-variant/40 p-8 md:p-10 space-y-6 text-center">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-headline-md text-on-surface">Sign-in failed</h2>
          <p className="text-body-md text-on-surface-variant">{error}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full bg-primary text-on-primary rounded-lg px-4 py-2.5 text-label-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {retrying ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-sm border border-outline-variant/40 p-8 md:p-10 space-y-6 text-center">
        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h2 className="text-headline-md text-on-surface">Completing sign-in...</h2>
        <p className="text-body-md text-on-surface-variant">Please wait while we verify your account.</p>
      </div>
    </div>
  )
}
