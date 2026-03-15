import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import AppLayout from '@/components/layout/AppLayout'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Spiritual Insights',
    template: '%s | Spiritual Insights',
  },
  description:
    'A calm, modern spiritual platform for devotional content, guided meditation, AI spiritual guidance, and a safe Kids Zone.',
  keywords: ['spiritual', 'meditation', 'mantra', 'bhajan', 'jap mala', 'kids zone', 'devotional'],
  authors: [{ name: 'Spiritual Insights' }],
  openGraph: {
    title: 'Spiritual Insights',
    description: 'Your daily spiritual companion — mantras, stories, meditation, and more.',
    type: 'website',
    locale: 'en_US',
  },
}

import { AuthProvider } from '@/components/providers/AuthProvider'
import { NotificationProvider } from '@/components/providers/NotificationProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ToastContainer from '@/components/ui/Toast'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-[#FEFCF8] dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-sans antialiased ${poppins.className}`}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ErrorBoundary>
                <AppLayout>{children}</AppLayout>
              </ErrorBoundary>
            </NotificationProvider>
          </AuthProvider>
          <ToastContainer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-XYZ123TEST" />
      </body>
    </html>
  )
}
