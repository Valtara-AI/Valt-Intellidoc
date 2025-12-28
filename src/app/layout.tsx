import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Valt Intellidoc',
  description: 'Enterprise Document Intelligence Platform - Secure, compliant AI assistance for legal professionals, compliance officers, and consultants.',
  keywords: ['document intelligence', 'AI assistant', 'enterprise', 'compliance', 'legal tech'],
  authors: [{ name: 'Valt Intellidoc' }],
  openGraph: {
    title: 'Valt Intellidoc',
    description: 'Enterprise Document Intelligence Platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />

          {/* LeadConnector chat widget (loads after interactive) */}
          <Script
            src="https://widgets.leadconnectorhq.com/loader.js"
            data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
            data-widget-id="67ff121f119caa7e6578236b"
            strategy="afterInteractive"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}