'use client'

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { profileApi, clearApiCache, type Profile } from '@/lib/api'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  /** The signed-in user's profile — loaded once per session and shared across pages. */
  profile: Profile | null
  /**
   * Whether this account still owes us an onboarding pass. `null` while unknown —
   * render a placeholder rather than app content until it resolves.
   */
  needsOnboarding: boolean | null
  refreshProfile: () => Promise<Profile | null>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, displayName?: string, username?: string) => Promise<{ error?: string; data?: { id: string; email: string | undefined; session: Session | null } }>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updatePassword: (password: string) => Promise<{ error?: string }>
  /** Change email address — sends confirmation to both old and new addresses. */
  updateEmail: (email: string) => Promise<{ error?: string }>
  /** Change password while signed in (no URL-hash dependency). */
  changePassword: (password: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export type OAuthProvider = 'google' | 'apple' | 'facebook'

export const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
}

// The provider isn't echoed back to /auth/callback, so record it before leaving.
// sessionStorage survives the round trip out to the provider and back in this tab.
const OAUTH_PROVIDER_KEY = 'zoiko:oauth-provider'

function rememberOAuthProvider(provider: OAuthProvider) {
  try {
    sessionStorage.setItem(OAUTH_PROVIDER_KEY, provider)
  } catch {
    // Storage blocked — the callback just falls back to its default provider.
  }
}

/** Which provider started the sign-in that landed on /auth/callback. */
export function lastOAuthProvider(): OAuthProvider {
  try {
    const stored = sessionStorage.getItem(OAUTH_PROVIDER_KEY)
    if (stored === 'google' || stored === 'apple' || stored === 'facebook') return stored
  } catch {
    // Storage blocked — fall through to the default.
  }
  return 'google'
}

// Survives client-side navigation AND provider remounts within one JS session
let cachedProfile: Profile | null = null

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })
  const [profile, setProfile] = useState<Profile | null>(cachedProfile)

  // Distinct from "profile is null": tells us the fetch has been *attempted*, so
  // a failure doesn't leave callers waiting forever on an answer.
  const [profileSettled, setProfileSettled] = useState(cachedProfile !== null)

  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    try {
      const p = await profileApi.getMe()
      cachedProfile = p
      setProfile(p)
      return p
    } catch {
      // Not signed in or API unreachable — leave as-is
      return null
    } finally {
      setProfileSettled(true)
    }
  }, [])

  // ── Onboarding gate ───────────────────────────────────────────────────────
  // An account that has not been through onboarding is still wearing the
  // username the signup trigger derived from its email address. Send them to
  // choose one before they use the app under a handle they never picked.
  //
  // Gated on an explicit `false`: an API that predates this field returns
  // undefined, and treating that as "incomplete" would trap every user behind
  // a form they have already filled in.
  const pathname = usePathname()
  const router = useRouter()

  /**
   * `null` means "we don't know yet" — pages must not render app content on it,
   * or the visitor sees the feed for a moment before being pulled away.
   * A failed profile fetch settles to `false` rather than `null`: being unable
   * to answer must not lock someone out of the app.
   */
  const needsOnboarding: boolean | null = !state.isAuthenticated
    ? false
    : profile
      ? profile.onboardingCompleted === false
      : profileSettled
        ? false
        : null

  useEffect(() => {
    if (state.loading || needsOnboarding !== true) return
    // /auth/callback is mid-handshake and picks its own destination.
    if (pathname === '/onboarding' || pathname.startsWith('/auth/')) return
    router.replace('/onboarding')
  }, [state.loading, needsOnboarding, pathname, router])

  useEffect(() => {
    const supabase = createClient()

    // getSession() reads locally (no network) — pages render immediately.
    // Token validity is enforced by the middleware and every API call anyway;
    // onAuthStateChange below picks up refreshes/expiry.
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setState({
          user: session?.user ?? null,
          loading: false,
          isAuthenticated: !!session?.user,
        })
        if (session?.user && !cachedProfile) void refreshProfile()
      })
      .catch(() => {
        // Corrupt/unreadable session — treat as signed out instead of hanging on a blank screen
        setState({ user: null, loading: false, isAuthenticated: false })
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        isAuthenticated: !!session?.user,
      })
      if (session?.user) {
        if (!cachedProfile || cachedProfile.id !== session.user.id) void refreshProfile()
      } else {
        cachedProfile = null
        setProfile(null)
        clearApiCache()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshProfile])

  const signIn = useCallback(async (identifier: string, password: string) => {
    const supabase = createClient()
    const trimmed = identifier.trim()
    try {
      // Email or phone → authenticate directly with Supabase
      if (trimmed.includes('@')) {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmed.toLowerCase(), password })
        if (error) {
          return { error: error.message === 'Invalid login credentials' ? 'Invalid credentials' : error.message }
        }
        return {}
      }
      if (/^\+?[0-9()\s-]{7,20}$/.test(trimmed)) {
        const { error } = await supabase.auth.signInWithPassword({ phone: trimmed.replace(/[()\s-]/g, ''), password })
        if (error) {
          return { error: error.message === 'Invalid login credentials' ? 'Invalid credentials' : error.message }
        }
        return {}
      }

      // Username → the API resolves it server-side and returns a session
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed, password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        return { error: err?.error?.message ?? err?.message ?? 'Invalid credentials' }
      }
      const json = await res.json()
      const session = json?.data?.data ?? json?.data
      const { error } = await supabase.auth.setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'Failed to sign in. Please try again.' }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string, username?: string) => {
    const supabase = createClient()
    try {
      const metadata: Record<string, string> = {}
      if (displayName) {
        metadata.full_name = displayName
        metadata.display_name = displayName
      }
      if (username) {
        metadata.username = username.trim().toLowerCase()
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })

      if (error) {
        return { error: error.message }
      }

      if (!data.user) {
        return { error: 'Failed to create account. Please try again.' }
      }

      return { data: { id: data.user.id, email: data.user.email, session: data.session } }
    } catch {
      return { error: 'Failed to sign up. Please try again.' }
    }
  }, [])

  const signInWithProvider = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // Try the backend API first. It preflights the provider against Supabase, so
    // a reply from it is worth trusting either way.
    let res: Response | null = null
    try {
      res = await fetch(`${apiUrl}/api/v1/auth/${provider}`)
    } catch {
      // API unavailable — fall through to Supabase
    }

    if (res?.ok) {
      const { data } = await res.json()
      if (data?.url) {
        rememberOAuthProvider(provider)
        window.location.href = data.url
        return
      }
    }

    // A 4xx is a verdict, not a hiccup — usually the provider isn't enabled.
    // Surface it here: retrying the same thing through Supabase would only
    // navigate the visitor onto a raw GoTrue JSON error page.
    if (res && res.status >= 400 && res.status < 500) {
      const body = await res.json().catch(() => null)
      throw new Error(
        body?.error?.message ?? `${PROVIDER_LABELS[provider]} sign-in is not available right now.`,
      )
    }

    // Fallback: the API is unreachable or broke on its own account — go direct.
    rememberOAuthProvider(provider)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }, [])

  const signInWithGoogle = useCallback(() => signInWithProvider('google'), [signInWithProvider])
  const signInWithApple = useCallback(() => signInWithProvider('apple'), [signInWithProvider])
  const signInWithFacebook = useCallback(() => signInWithProvider('facebook'), [signInWithProvider])

  const signOut = useCallback(async () => {
    // Every step is best-effort — whatever happens, the user must end up signed
    // out locally and back on the login page.
    try {
      const { disconnectSocket } = await import('@/lib/socket')
      disconnectSocket()
    } catch {
      // Socket module unavailable — nothing to disconnect
    }

    /*
     * Hand back the push subscription before the session goes.
     *
     * A subscription belongs to a browser, and the server records which member
     * it belongs to. Leaving it in place on sign-out meant this browser kept
     * receiving that person's notifications afterwards — and, if someone else
     * signed in here, receiving them on that person's screen. It has to be
     * released while the token is still valid, which is why it happens before
     * the Supabase sign-out below.
     */
    try {
      const reg = await navigator.serviceWorker?.getRegistration()
      const subscription = await reg?.pushManager.getSubscription()
      if (subscription) {
        const { mutate } = await import('@/lib/api')
        await mutate('/push/subscriptions', {
          method: 'DELETE',
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => undefined)
        await subscription.unsubscribe().catch(() => undefined)
      }
    } catch {
      // No service worker, or the browser refused — signing out still proceeds.
    }

    const supabase = createClient()
    try {
      // Global scope revokes the refresh token server-side
      await supabase.auth.signOut()
    } catch {
      // Network/server failure — still clear the local session so the user is signed out on this device
      try {
        await supabase.auth.signOut({ scope: 'local' })
      } catch {
        // Even local cleanup failed — the redirect below still leaves the app in a signed-out state
      }
    }

    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/logout', { method: 'POST' })
    } catch {
      // Ignore API logout errors
    }

    window.location.href = '/login'
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await fetch(apiUrl + '/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const err = await res.json()
        return { error: err.message || 'Failed to send reset email' }
      }

      return {}
    } catch {
      return { error: 'Failed to send reset email. Please try again.' }
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      const supabase = createClient()

      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        })
      }

      const { error } = await supabase.auth.updateUser({ password })
      if (error) return { error: error.message }

      return {}
    } catch {
      return { error: 'Failed to update password. Please try again.' }
    }
  }, [])

  /**
   * Change email — Supabase sends confirmation emails to both old and new addresses.
   * The email only updates after the user clicks the confirmation link.
   */
  const updateEmail = useCallback(async (email: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'Failed to update email. Please try again.' }
    }
  }, [])

  /**
   * Change password while signed in — no URL-hash dependency.
   * For the reset-password page, use updatePassword() instead.
   */
  const changePassword = useCallback(async (password: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'Failed to change password. Please try again.' }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        profile,
        needsOnboarding,
        refreshProfile,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signInWithFacebook,
        signOut,
        resetPassword,
        updatePassword,
        updateEmail,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
