'use client'

import { type ReactNode } from 'react'
import { AuthProvider } from '@/hooks/use-auth'

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
