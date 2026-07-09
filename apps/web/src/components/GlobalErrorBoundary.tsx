'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  /** Optional fallback UI when an error is caught and toast fails */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Catches React render errors globally and surfaces them via console.error.
 * Since this sits outside the ToastProvider, it uses a direct state-based
 * fallback rather than trying to call toast() from a broken tree.
 *
 * The ToastProvider and its children also get wrapped, so errors inside the
 * app tree will be caught here AND by individual API-call error handlers
 * that use the toast system.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[GlobalErrorBoundary] Caught render error:', error)
    console.error('[GlobalErrorBoundary] Component stack:', info.componentStack)
  }

  handleReset(): void {
    this.setState({ hasError: false, error: null })
  }

  handleHardReset(): void {
    try {
      sessionStorage.clear()
      Object.keys(localStorage)
        .filter((k) => k.startsWith('zk.') || k.startsWith('sb-'))
        .forEach((k) => localStorage.removeItem(k))
    } catch { /* ignore */ }
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-on-surface">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <div className="space-y-1.5">
              <h1 className="font-headline text-headline-md">Something went wrong</h1>
              <p className="text-label-md text-on-surface-variant">
                The app hit an unexpected error. Try again, or reset your local data.
              </p>
            </div>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="text-left text-[11px] leading-relaxed bg-surface-container-low rounded-xl p-3 overflow-x-auto text-red-500 max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.handleReset()}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Try again
              </button>
              <button
                onClick={() => this.handleHardReset()}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md font-semibold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Reset & reload
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
