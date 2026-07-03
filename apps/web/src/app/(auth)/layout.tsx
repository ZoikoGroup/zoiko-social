import type { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
