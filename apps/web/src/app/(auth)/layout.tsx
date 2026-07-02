import type { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-deep/5 via-amber-light/5 to-teal-pale/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
