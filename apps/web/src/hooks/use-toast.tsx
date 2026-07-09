'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number // ms — default 4000
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
  /** Convenience shorthands */
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

// ── Provider ───────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const toast: Toast = { ...t, id }
      setToasts((prev) => [...prev, toast])

      // Auto-dismiss
      const ms = t.duration ?? 4000
      if (ms > 0) {
        setTimeout(() => dismiss(id), ms)
      }
    },
    [dismiss],
  )

  const success = useCallback((title: string, message?: string) => addToast({ type: 'success', title, ...(message ? { message } : {}) }), [addToast])
  const error = useCallback((title: string, message?: string) => addToast({ type: 'error', title, ...(message ? { message } : {}) }), [addToast])
  const info = useCallback((title: string, message?: string) => addToast({ type: 'info', title, ...(message ? { message } : {}) }), [addToast])
  const warning = useCallback((title: string, message?: string) => addToast({ type: 'warning', title, ...(message ? { message } : {}) }), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, dismiss, success, error, info, warning }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
