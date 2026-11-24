import type { Metadata } from 'next'
import { Poppins, Noto_Sans_Bengali } from 'next/font/google'
import { InteractiveCursor } from '@/components/InteractiveCursor'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-bengali',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'NoticeSaathi — GST Notice Copilot', template: '%s — NoticeSaathi' },
  description:
    'NoticeSaathi helps small Indian traders understand a GST notice, see what is due and by when, and prepare a sourced draft reply.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_BASE_URL'] ?? 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/logo/tab-icon.png', sizes: 'any', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${notoSansBengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <InteractiveCursor />
        {children}
      </body>
    </html>
  )
}
