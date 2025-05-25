import type { Metadata } from 'next'
import './globals.css'
// import { StagewiseToolbarClient } from '../components/StagewiseToolbarClient' // Keep commented
import { ThemeProvider } from '@/components/theme-provider'
import { StagewiseToolbar } from '@stagewise/toolbar-next' // Import StagewiseToolbar

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
  const stagewiseConfig = { plugins: [] } // Define stagewiseConfig

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* {isDev && <StagewiseToolbarClient />} */} {/* Keep commented */}
          {isDev && <StagewiseToolbar config={stagewiseConfig} />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
