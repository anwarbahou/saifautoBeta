import type { Metadata } from 'next'
import '../LandingPage/app/globals.css'
import { StagewiseToolbarClient } from '../components/StagewiseToolbarClient'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === 'development'
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isDev && <StagewiseToolbarClient />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
