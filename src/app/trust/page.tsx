import React from 'react'
import { Header, Footer } from '@/components/HomeHeaderFooter'
import { InteractiveDots } from '@/components/InteractiveDots'
import {
  TrustHero,
  TrustArchitectureSection,
  TrustCalculationsSection,
  TrustEscalationSection,
  TrustBenchmarkSection,
  TrustDisclaimerSection,
} from '@/components/TrustSections'

export const metadata = {
  title: 'Trust, Safety & Verification — NoticeSaathi',
  description:
    'Complete transparency on data flow, privacy disclosures, calculation methodology, CA escalation policy, and benchmark metrics for NoticeSaathi.',
}

export default function TrustPage() {
  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      className="relative flex min-h-dvh flex-col overflow-hidden canvas-bg"
    >
      <InteractiveDots />
      <Header />

      <main
        id="main-content"
        className="relative z-10 flex flex-1 flex-col items-center px-4 py-12 md:px-8 max-w-5xl mx-auto w-full"
      >
        <div className="w-full space-y-10">
          <TrustHero />
          <TrustArchitectureSection />
          <TrustCalculationsSection />
          <TrustEscalationSection />
          <TrustBenchmarkSection />
          <TrustDisclaimerSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
