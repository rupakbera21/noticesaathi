import React from 'react'
import { Header, Footer } from '@/components/HomeHeaderFooter'
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
      className="relative flex min-h-dvh flex-col overflow-hidden"
    >
      <div className="grain-overlay" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />
      <div className="ambient-vignette" aria-hidden="true" />

      <Header />

      <main
        id="main-content"
        className="relative z-10 flex flex-1 flex-col items-center px-4 py-12 md:px-8"
      >
        <div className="w-full max-w-4xl space-y-10">
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
