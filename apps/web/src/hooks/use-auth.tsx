'use client'

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error?: string; data?: { id: string; email: string | undefined } }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updatePassword: (password: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setState({
        user,
        loading: false,
        isAuthenticated: !!user,
      })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        isAuthenticated: !!session?.user,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await fetch(apiUrl + '/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json()
        return { error: err.message || 'Invalid email or password' }
      }

      const { data } = await res.json()

      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      })

      return {}
    } catch {
      return { error: 'Failed to sign in. Please try again.' }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await fetch(apiUrl + '/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      })

      if (!res.ok) {
        const err = await res.json()
        return { error: err.message || 'Registration failed' }
      }

      const { data } = await res.json()
      return { data }
    } catch {
      return { error: 'Failed to sign up. Please try again.' }
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await fetch(apiUrl + '/api/v1/auth/google')
      if (!res.ok) throw new Error('Failed to get OAuth URL')

      const { data } = await res.json()
      if (data?.url) {
        window.location.href = data.url
      }
    } catch {
      const supabase = createClient()
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      })
    }
  }, [])

  const signOut = useCallback(async () => {
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
