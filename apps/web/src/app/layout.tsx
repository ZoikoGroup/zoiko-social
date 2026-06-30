import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZoikoSocial',
  description: 'The governed social platform for animal lovers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
