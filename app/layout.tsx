import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import StagewiseToolbarWrapper from '@/components/StagewiseToolbarWrapper'
import { BlinkingTitle } from '@/components/BlinkingTitle'

const stagewiseConfig = { plugins: [] }

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
}

// Default metadata without title (since we'll handle it dynamically)
export const metadata: Metadata = {
  description: 'Premium car rental service for all your travel needs',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Saifauto',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Saifauto - Your journey starts here</title>
      </head>
      <body suppressHydrationWarning>
        <BlinkingTitle defaultTitle="Saifauto - Your journey starts here" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isDev && <StagewiseToolbarWrapper />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
