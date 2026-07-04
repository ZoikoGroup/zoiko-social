'use client'

import { type ReactNode } from 'react'
import { AuthProvider } from '@/hooks/use-auth'
import { NotificationsProvider } from '@/hooks/use-notifications'

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  )
}
