import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import CustomCursor from '@/components/CustomCursor'
import Preloader from '@/components/Preloader'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import './cursor.css'

export const metadata: Metadata = {
  title: 'Aparna S Binu — Architecture & Spatial Design',
  description: 'The architectural portfolio of Aparna S Binu, exploring space, materiality and visual storytelling.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#FBFAF7',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio-theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Preloader />
          <CustomCursor />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
