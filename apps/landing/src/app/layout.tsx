import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZoikoSocial — The Social Platform for Animal Lovers',
  description:
    'A governed, safety-first social platform for pet owners, animal rescue organisations, vets, and wildlife advocates.',
  icons: {
    icon: '/zoikosocialicon_modified.svg',
  },
  openGraph: {
    title: 'ZoikoSocial',
    description: 'The governed social platform for animal lovers',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to origins the landing page will fetch from */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-paper text-teal-deep antialiased">{children}</body>
    </html>
  )
}
