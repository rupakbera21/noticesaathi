import React from 'react'
import { NoticeAnalyzer } from '@/components/NoticeAnalyzer'
import { Header, TrustPills, Footer } from '@/components/HomeHeaderFooter'
import {
  HowItWorksSection,
  FeaturesSection,
  SupportedNoticesSection,
  FaqSection,
} from '@/components/HomeSections'

export default function HomePage() {
  return (
    <div
      data-testid="home-page"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      className="relative flex min-h-dvh flex-col overflow-hidden"
    >
      {/* Tactile film grain, ambient drifting light, and bottom black vignette */}
      <div className="grain-overlay" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />
      <div className="ambient-vignette" aria-hidden="true" />

      <Header />

      <main
        id="main-content"
        className="relative z-10 flex flex-1 flex-col items-center justify-start gap-8 px-4 py-12 md:px-8"
      >
        <div className="max-w-2xl text-center space-y-3">
          <h1
            className="text-3xl font-extrabold tracking-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            data-testid="heading"
          >
            Understand Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">GST Notice</span> in Minutes
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-400 leading-relaxed">
            Instant itemized demand breakdown in ₹, verified CBIC statutory citations,
            deterministic response deadlines, and grounded legal replies for Indian traders.
          </p>
          <TrustPills />
        </div>

        <NoticeAnalyzer />

        <HowItWorksSection />
        <FeaturesSection />
        <SupportedNoticesSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  )
}
