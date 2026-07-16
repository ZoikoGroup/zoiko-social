'use client'

import { useState, useEffect, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AtSign,
  Globe,
  ChevronDown,
  Users,
  PawPrint,
  ShieldCheck,
  BadgeCheck,
  Heart,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

// Instagram-style username rules — mirrored by the API and the DB trigger
const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/

type UsernameStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'reserved'

function validateUsernameFormat(username: string): boolean {
  return (
    USERNAME_REGEX.test(username) &&
    !username.startsWith('.') &&
    !username.endsWith('.') &&
    !username.includes('..')
  )
}

const USERNAME_MESSAGES: Record<UsernameStatus, string> = {
  idle: '',
  invalid: '3–30 characters — lowercase letters, numbers, underscores and periods only',
  checking: 'Checking availability…',
  available: 'Username is available',
  taken: 'This username is already taken',
  reserved: 'This username is not available',
}

const AUTH_LANGUAGES: { code: string; label: string }[] = [
  { code: 'en', label: 'US English' },
  { code: 'en-GB', label: 'UK English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
]

/* ---------------------------------- Brand icons ---------------------------------- */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04L5.84 9.88C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.03 8.23.69 1 1.5 2.11 2.57 2.07 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.69.64 1.11-.02 1.81-1.01 2.49-2.01.78-1.15 1.11-2.27 1.12-2.33-.03-.01-2.15-.82-2.17-3.27ZM15.0 6.4c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-.99 1.59-.87 2.53.91.07 1.85-.47 2.42-1.16Z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
      <path
        fill="#fff"
        d="M16.67 15.56 17.2 12.07h-3.33V9.82c0-.96.47-1.89 1.96-1.89h1.51V4.96s-1.37-.24-2.68-.24c-2.74 0-4.53 1.67-4.53 4.69v2.66H7.08v3.49h3.05V24a12.1 12.1 0 0 0 3.74 0v-8.44h2.8Z"
      />
    </svg>
  )
}

/* ---------------------------------- Sub-components ---------------------------------- */

interface StatProps {
  icon: ReactNode
  value: string
  label: string
}

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="flex flex-1 flex-col items-center px-2 text-center">
      <span className="mb-1.5 text-white/90">{icon}</span>
      <span className="text-2xl font-bold leading-none text-white">{value}</span>
      <span className="mt-1 text-[13px] leading-tight text-white/70">{label}</span>
    </div>
  )
}

interface TrustProps {
  icon: ReactNode
  title: string
  subtitle: string
}

function TrustItem({ icon, title, subtitle }: TrustProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
}

/* ---------------------------------- Page ---------------------------------- */

interface ZoikoAuthPageProps {
  mode: 'login' | 'signup'
}

export function ZoikoAuthPage({ mode }: ZoikoAuthPageProps) {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | 'facebook' | null>(null)
  const [rememberMe, setRememberMe] = useState(true)
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    try {
      return localStorage.getItem('zoiko-language') ?? 'en'
    } catch {
      return 'en'
    }
  })
  const [langOpen, setLangOpen] = useState(false)

  // Keep in sync when the language is changed from the settings page (other tab)
  useEffect(() => {
    function handle(e: StorageEvent) {
      if (e.key === 'zoiko-language' && e.newValue) setLanguage(e.newValue)
    }
    window.addEventListener('storage', handle)
    return () => window.removeEventListener('storage', handle)
  }, [])

  const currentLang = AUTH_LANGUAGES.find((l) => l.code === language) ?? AUTH_LANGUAGES[0]!

  function handleLanguageSelect(code: string) {
    setLanguage(code)
    setLangOpen(false)
    try {
      localStorage.setItem('zoiko-language', code)
    } catch {
      // localStorage unavailable
    }
  }

  const [registered] = useState<boolean>(() => {
    if (typeof window === 'undefined' || mode !== 'login') return false
    return new URLSearchParams(window.location.search).get('registered') === 'true'
  })

  // Debounced Instagram-style username availability check (signup only)
  useEffect(() => {
    if (mode !== 'signup') return
    let cancelled = false
    const value = username

    const timer = setTimeout(async () => {
      if (cancelled) return
      if (value.length === 0) {
        setUsernameStatus('idle')
        return
      }
      if (!validateUsernameFormat(value)) {
        setUsernameStatus('invalid')
        return
      }
      setUsernameStatus('checking')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profiles/username-available?username=${encodeURIComponent(value)}`,
        )
        const json = await res.json()
        const result = json?.data?.data ?? json?.data
        if (cancelled) return
        if (result?.available) {
          setUsernameStatus('available')
        } else if (result?.reason === 'reserved') {
          setUsernameStatus('reserved')
        } else if (result?.reason === 'taken') {
          setUsernameStatus('taken')
        } else {
          setUsernameStatus('invalid')
        }
      } catch {
        // API unreachable — don't block signup; the DB trigger enforces uniqueness
        if (!cancelled) setUsernameStatus('idle')
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [username, mode])

  // Clean ?registered=true from the URL after reading it
  useEffect(() => {
    if (registered) {
      const url = new URL(window.location.href)
      url.searchParams.delete('registered')
      window.history.replaceState({}, '', url.toString())
    }
  }, [registered])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (mode === 'login') {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else {
        router.push('/')
      }
    } else {
      if (!validateUsernameFormat(username)) {
        setError(
          'Please choose a valid username (3–30 characters: lowercase letters, numbers, underscores and periods).',
        )
        setIsLoading(false)
        return
      }
      if (usernameStatus === 'taken' || usernameStatus === 'reserved') {
        setError('That username is not available. Please pick another one.')
        setIsLoading(false)
        return
      }
      const result = await signUp(email, password, displayName || undefined, username)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result.data?.session) {
        router.push('/')
      } else {
        router.push('/login?registered=true')
      }
    }
  }

  const PROVIDER_LABELS: Record<'google' | 'apple' | 'facebook', string> = {
    google: 'Google',
    apple: 'Apple',
    facebook: 'Facebook',
  }
  const PROVIDER_HANDLERS: Record<'google' | 'apple' | 'facebook', () => Promise<void>> = {
    google: signInWithGoogle,
    apple: signInWithApple,
    facebook: signInWithFacebook,
  }

  async function handleSocial(provider: 'google' | 'apple' | 'facebook') {
    setSocialLoading(provider)
    setError('')
    try {
      await PROVIDER_HANDLERS[provider]()
    } catch (e) {
      setError(e instanceof Error ? e.message : `${PROVIDER_LABELS[provider]} sign-in failed`)
      setSocialLoading(null)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white">
        {/* Top: hero + form — fixed desktop min-height so the hero renders identically on login and signup */}
        <div className="flex flex-1 flex-col lg:flex-row lg:min-h-[900px]">
          {/* -------------------- LEFT — Hero (desktop only; hidden on mobile & tablet) -------------------- */}
          <div className="relative hidden min-h-[340px] flex-col overflow-hidden p-8 sm:p-10 lg:flex lg:min-h-0 lg:w-[49%] lg:p-12">
            {/* Fallback gradient (shows if the photo is missing) */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900" />
            {/* Hero photo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/auth-hero.png')" }}
            />
            {/* Legibility overlay — dark at top (headline) and bottom (quote), clear in the middle so the pets stay visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/60" />

            {/* Logo */}
            <div className="relative z-10">
              <Image
                src="/zoikosocial-logo.png"
                alt="Zoiko Social"
                height={40}
                width={180}
                priority
                className="h-9 w-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Headline — directly under the logo, above the pets */}
            <div className="relative z-10 mt-7">
              <h2 className="max-w-md text-4xl font-bold leading-tight text-white drop-shadow-sm sm:text-[2.75rem]">
                The global community for animal welfare
              </h2>
              <p className="mt-4 max-w-md text-lg leading-snug text-white/90 drop-shadow-sm">
                Share updates. Get expert advice. Support rescues. Make a difference.
              </p>
            </div>

            {/* Stats + quote — pinned to the bottom, pets stay visible in between */}
            <div className="relative z-10 mt-auto space-y-6 pt-8">
              <div className="flex items-stretch divide-x divide-white/15 rounded-2xl border border-white/15 bg-black/30 px-2 py-5 backdrop-blur-md">
                <Stat icon={<Users className="size-5" />} value="2M+" label="Global Members" />
                <Stat icon={<PawPrint className="size-5" />} value="150K+" label="Rescues & Cases" />
                <Stat icon={<ShieldCheck className="size-5" />} value="98%" label="Verified Experts" />
              </div>

              <blockquote className="relative pl-8 text-white/90">
                <span className="absolute left-0 top-0 font-serif text-4xl leading-none text-white/40">
                  &ldquo;
                </span>
                <p className="italic leading-snug">
                  Alone we can do so little;
                  <br />
                  together we can do so much.&rdquo;
                </p>
                <cite className="mt-1 block text-sm font-semibold not-italic text-white/80">
                  — Helen Keller
                </cite>
              </blockquote>
            </div>
          </div>

          {/* -------------------- RIGHT — Form -------------------- */}
          <div className="relative flex flex-1 flex-col px-6 pb-10 pt-6 sm:px-10 lg:px-16">
            {/* Language selector dropdown */}
            <div className="relative flex justify-end">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <Globe className="size-4" />
                {currentLang.label}
                <ChevronDown className={`size-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {AUTH_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                          lang.code === language
                            ? 'bg-primary/10 font-semibold text-primary'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {lang.code === language && (
                          <CheckCircle2 className="size-3.5 shrink-0" />
                        )}
                        <span className={lang.code === language ? '' : 'ml-5'}>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-1 items-center justify-center py-6">
              <div className="w-full max-w-[400px]">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-[#0f2e35]">
                    {isLogin ? 'Welcome back!' : 'Create your account'}
                  </h1>
                  <p className="mt-2 text-[15px] text-gray-500">
                    {isLogin
                      ? 'Please enter your details to continue'
                      : 'Join the global community for animal welfare'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <>
                      <div className="space-y-1.5">
                        <label htmlFor="displayName" className="block text-sm font-semibold text-gray-800">
                          Display name
                        </label>
                        <div className="relative">
                          <AtSign className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                          <input
                            id="displayName"
                            type="text"
                            placeholder="Your name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            autoComplete="off"
                            className="h-[52px] w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-11 pr-4 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
                          Username
                        </label>
                        <div className="relative">
                          <AtSign className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                          <input
                            id="username"
                            type="text"
                            placeholder="yourname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                            autoComplete="off"
                            required
                            maxLength={30}
                            className={`h-[52px] w-full rounded-xl border bg-gray-50/60 pl-11 pr-11 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                              usernameStatus === 'available'
                                ? 'border-green-500 focus:border-green-500'
                                : usernameStatus === 'taken' ||
                                    usernameStatus === 'reserved' ||
                                    usernameStatus === 'invalid'
                                  ? 'border-red-400 focus:border-red-400'
                                  : 'border-gray-200 focus:border-primary'
                            }`}
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            {usernameStatus === 'checking' && (
                              <Loader2 className="size-5 animate-spin text-gray-400" />
                            )}
                            {usernameStatus === 'available' && (
                              <CheckCircle2 className="size-5 text-green-600" />
                            )}
                            {(usernameStatus === 'taken' ||
                              usernameStatus === 'reserved' ||
                              usernameStatus === 'invalid') && (
                              <XCircle className="size-5 text-red-500" />
                            )}
                          </span>
                        </div>
                        {usernameStatus !== 'idle' && (
                          <p
                            className={`text-xs ${
                              usernameStatus === 'available'
                                ? 'text-green-600'
                                : usernameStatus === 'checking'
                                  ? 'text-gray-500'
                                  : 'text-red-500'
                            }`}
                          >
                            {USERNAME_MESSAGES[usernameStatus]}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                      {isLogin ? 'Email, username or phone' : 'Email'}
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="email"
                        type={isLogin ? 'text' : 'email'}
                        placeholder={
                          isLogin ? 'Enter your email, username or phone' : 'Enter your email'
                        }
                        value={email}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-[52px] w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-11 pr-4 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={
                          isLogin ? 'Enter your password' : 'Create a password (min 8 characters)'
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={isLogin ? undefined : 8}
                        className="h-[52px] w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-11 pr-11 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={rememberMe}
                          onClick={() => setRememberMe(!rememberMe)}
                          className={`flex size-5 items-center justify-center rounded-md border transition-colors ${
                            rememberMe
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {rememberMe && (
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                        Remember me for 30 days
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {registered && (
                    <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-semibold text-gray-900">Account created successfully!</p>
                        <p className="mt-0.5 text-gray-500">
                          Check your email to confirm your account, then sign in.
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      (!isLogin && usernameStatus !== 'available' && usernameStatus !== 'idle')
                    }
                    className="flex h-[52px] w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading
                      ? isLogin
                        ? 'Signing in…'
                        : 'Creating account…'
                      : isLogin
                        ? 'Log in'
                        : 'Create account'}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">or continue with</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocial('google')}
                    disabled={socialLoading !== null}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                  >
                    {socialLoading === 'google' ? (
                      <Loader2 className="size-5 animate-spin text-gray-400" />
                    ) : (
                      <GoogleIcon className="size-5" />
                    )}
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocial('apple')}
                    disabled={socialLoading !== null}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                  >
                    {socialLoading === 'apple' ? (
                      <Loader2 className="size-5 animate-spin text-gray-400" />
                    ) : (
                      <AppleIcon className="size-5 text-black" />
                    )}
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocial('facebook')}
                    disabled={socialLoading !== null}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                  >
                    {socialLoading === 'facebook' ? (
                      <Loader2 className="size-5 animate-spin text-gray-400" />
                    ) : (
                      <FacebookIcon className="size-5" />
                    )}
                    Facebook
                  </button>
                </div>

                {/* Switch mode */}
                <p className="mt-7 text-center text-sm text-gray-600">
                  {isLogin ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Link href="/login" className="font-semibold text-primary hover:underline">
                        Sign in
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- BOTTOM — Trust bar -------------------- */}
        <div className="border-t border-gray-100 px-6 py-6 sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 xl:gap-x-16">
            <TrustItem
              icon={<ShieldCheck className="size-7" strokeWidth={1.6} />}
              title="Trusted Community"
              subtitle="Safe and moderated"
            />
            <TrustItem
              icon={<BadgeCheck className="size-7" strokeWidth={1.6} />}
              title="Verified Experts"
              subtitle="Professionals you can trust"
            />
            <TrustItem
              icon={<Heart className="size-7" strokeWidth={1.6} />}
              title="Make an Impact"
              subtitle="Every action counts"
            />
            <TrustItem
              icon={<Lock className="size-7" strokeWidth={1.6} />}
              title="Your Privacy"
              subtitle="Secure and protected"
            />
          </div>
          <p className="mt-5 text-center text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="font-semibold text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-semibold text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
