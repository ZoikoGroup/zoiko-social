'use client'

import { type ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/hooks/use-auth'
import { NotificationsProvider } from '@/hooks/use-notifications'
import { MessagingProvider } from '@/hooks/use-messaging'
import { ToastProvider } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ToastContainer'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'
import { LazyCallLayer } from '@/components/messaging/LazyCallLayer'

/**
 * Root providers, ordered inner→outer:
 *
 *  GlobalErrorBoundary --- catches render crashes in the whole app
 *  ├ ToastProvider     --- app-wide toast notifications
 *  ├ AuthProvider      --- user session + profile (always needed)
 *  ├ NotificationsProvider --- live notification state (always needed)
 *  ├ MessagingProvider --- DM + group chat state (always needed)
 *  ├ LazyCallLayer     --- CallProvider + CallModal loaded on-demand
 *  │                      (defers ~100KB livekit-client chunk)
 *  └ ToastContainer    --- rendered outside the error boundary
 */
export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="zoiko-theme">
    <GlobalErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NotificationsProvider>
            <MessagingProvider>
              <LazyCallLayer>
                {children}
              </LazyCallLayer>
            </MessagingProvider>
          </NotificationsProvider>
        </AuthProvider>
        <ToastContainer />
      </ToastProvider>
    </GlobalErrorBoundary>
    </ThemeProvider>
  )
}
