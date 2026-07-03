import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ZoikoSocial',
  description: 'The professional community for animal lovers, rescuers, and pet care experts',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-body antialiased bg-background text-on-surface">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
