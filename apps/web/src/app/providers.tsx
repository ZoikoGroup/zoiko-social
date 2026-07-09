'use client'

import { type ReactNode } from 'react'
import { AuthProvider } from '@/hooks/use-auth'
import { NotificationsProvider } from '@/hooks/use-notifications'
import { MessagingProvider } from '@/hooks/use-messaging'
import { ToastProvider } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ToastContainer'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <GlobalErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NotificationsProvider>
            <MessagingProvider>
              {children}
            </MessagingProvider>
          </NotificationsProvider>
        </AuthProvider>
        <ToastContainer />
      </ToastProvider>
    </GlobalErrorBoundary>
  )
}
