'use client'

import { type ReactNode } from 'react'
import { AuthProvider } from '@/hooks/use-auth'
import { NotificationsProvider } from '@/hooks/use-notifications'
import { MessagingProvider } from '@/hooks/use-messaging'
import { CallProvider } from '@/hooks/use-call'
import { ToastProvider } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ToastContainer'
import { CallModal } from '@/components/messaging/CallModal'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <GlobalErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NotificationsProvider>
            <MessagingProvider>
              <CallProvider>
                {children}
                <CallModal />
              </CallProvider>
            </MessagingProvider>
          </NotificationsProvider>
        </AuthProvider>
        <ToastContainer />
      </ToastProvider>
    </GlobalErrorBoundary>
  )
}
