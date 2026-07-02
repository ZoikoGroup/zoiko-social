'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@zoiko/ui'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage(): React.JSX.Element {
  const router = useRouter()
  const { signIn, signInWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch {
      setError('Failed to sign in with Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
      {/* Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-teal-pale rounded-xl flex items-center justify-center mx-auto">
          <LogIn className="w-6 h-6 text-teal-deep" />
        </div>
        <h2 className="text-2xl font-bold text-teal-deep">Welcome back</h2>
        <p className="text-sm text-teal-muted">
          Sign in to your ZoikoSocial account
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        )}
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">or sign in with email</span>
        </div>
      </div>

      {/* Login Form */}
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
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

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-teal hover:text-teal-deep font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full justify-center py-2.5">
          {loading ? (
            <div className="w-5 h-5 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-teal hover:text-teal-deep font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}
