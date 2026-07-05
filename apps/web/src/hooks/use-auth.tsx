'use client'

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
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
  refreshProfile: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, displayName?: string, username?: string) => Promise<{ error?: string; data?: { id: string; email: string | undefined; session: Session | null } }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updatePassword: (password: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Survives client-side navigation AND provider remounts within one JS session
let cachedProfile: Profile | null = null

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })
  const [profile, setProfile] = useState<Profile | null>(cachedProfile)

  const refreshProfile = useCallback(async () => {
    try {
      const p = await profileApi.getMe()
      cachedProfile = p
      setProfile(p)
    } catch {
      // Not signed in or API unreachable — leave as-is
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // getSession() reads locally (no network) — pages render immediately.
    // Token validity is enforced by the middleware and every API call anyway;
    // onAuthStateChange below picks up refreshes/expiry.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        isAuthenticated: !!session?.user,
      })
      if (session?.user && !cachedProfile) void refreshProfile()
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

  const signInWithGoogle = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // Try the backend API first
    try {
      const res = await fetch(apiUrl + '/api/v1/auth/google')
      if (res.ok) {
        const { data } = await res.json()
        if (data?.url) {
          window.location.href = data.url
          return
        }
      }
    } catch {
      // API unavailable — fall through to Supabase
    }

    // Fallback: use Supabase directly
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }, [])

  const signOut = useCallback(async () => {
    const { disconnectSocket } = await import('@/lib/socket')
    disconnectSocket()
    const supabase = createClient()
    await supabase.auth.signOut()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      await fetch(apiUrl + '/api/v1/auth/logout', { method: 'POST' })
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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        profile,
        refreshProfile,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
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
