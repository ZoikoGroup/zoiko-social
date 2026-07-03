'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'

const INITIAL_TOKEN_STATE = typeof window !== 'undefined'
  ? (() => {
      const hash = window.location.hash
      const hashParams = new URLSearchParams(hash.substring(1))
      const token = hashParams.get('access_token')
      const type = hashParams.get('type')
      if (token && type === 'recovery') {
        return { hasToken: true, error: '' }
      }
      return { hasToken: false, error: 'Invalid or missing reset token. Please request a new password reset link.' }
    })()
  : { hasToken: false, error: '' }

export default function ResetPasswordPage(): React.JSX.Element {
  const router = useRouter()
  const { updatePassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string>(INITIAL_TOKEN_STATE.error)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hasToken] = useState(INITIAL_TOKEN_STATE.hasToken)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const result = await updatePassword(password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface rounded-xl shadow-sm border border-outline-variant/40 p-8 md:p-10 space-y-6 text-center">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-headline-md text-on-surface">Password updated!</h2>
          <p className="text-body-md text-on-surface-variant">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-on-primary rounded-lg px-4 py-2.5 text-label-md hover:bg-primary-fixed-dim transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-sm border border-outline-variant/40 p-8 md:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-headline-md text-on-surface">Set new password</h2>
          <p className="text-body-md text-on-surface-variant">
            Enter your new password below.
          </p>
        </div>

        {!hasToken && !error && (
          <div className="bg-tertiary-container border border-tertiary/20 rounded-lg px-4 py-3 text-sm text-on-tertiary-container flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
            <span>Checking your reset link...</span>
          </div>
        )}

        {error && (
          <div className="bg-error-container border border-error/20 rounded-lg px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}

        {hasToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-label-md text-on-surface">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-label-md text-on-surface">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-lg px-4 py-2.5 text-label-md hover:bg-primary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
