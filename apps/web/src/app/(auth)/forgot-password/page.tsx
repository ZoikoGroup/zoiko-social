'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@zoiko/ui'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage(): React.JSX.Element {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await resetPassword(email)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-teal-deep">Check your email</h2>
        <p className="text-sm text-gray-500">
          If an account exists with <strong>{email}</strong>, we&apos;ve sent a password reset link.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-deep font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
      {/* Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-teal-pale rounded-xl flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-teal-deep" />
        </div>
        <h2 className="text-2xl font-bold text-teal-deep">Forgot password?</h2>
        <p className="text-sm text-teal-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-light focus:border-amber-light outline-none transition-shadow"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full justify-center py-2.5">
          {loading ? (
            <div className="w-5 h-5 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-teal hover:text-teal-deep font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>
    </div>
  )
}
