import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Bengali, Outfit } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-bengali',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'NoticeSaathi', template: '%s — NoticeSaathi' },
  description:
    'NoticeSaathi helps small Indian traders understand a GST notice, see what is due and by when, and prepare a sourced draft reply.',
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_BASE_URL'] ?? 'http://localhost:3000'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSansBengali.variable} ${outfit.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
