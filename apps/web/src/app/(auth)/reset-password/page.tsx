'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@zoiko/ui'
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-teal-deep">Password updated!</h2>
        <p className="text-sm text-gray-500">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Button onClick={() => router.push('/login')} className="w-full justify-center">
          Go to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
      {/* Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-teal-pale rounded-xl flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-teal-deep" />
        </div>
        <h2 className="text-2xl font-bold text-teal-deep">Set new password</h2>
        <p className="text-sm text-teal-muted">
          Enter your new password below.
        </p>
      </div>

      {/* Missing Token Alert */}
      {!hasToken && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <span>Checking your reset link...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Reset Password Form */}
      {hasToken && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-light focus:border-amber-light outline-none transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-light focus:border-amber-light outline-none transition-shadow"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full justify-center py-2.5">
            {loading ? (
              <div className="w-5 h-5 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
