import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import StagewiseToolbarWrapper from '@/components/StagewiseToolbarWrapper'

const stagewiseConfig = { plugins: [] }

export const metadata: Metadata = {
  title: 'Saifauto - Yaour journey starts here',
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
          {isDev && <StagewiseToolbarWrapper />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
