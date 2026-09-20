import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'
import './cursor.css'

export const metadata: Metadata = {
  title: 'Aparna S Binu — Architecture & Spatial Design',
  description: 'The architectural portfolio of Aparna S Binu, exploring space, materiality and visual storytelling.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FBFAF7',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
