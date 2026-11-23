import React from 'react'
import { NoticeAnalyzer } from '@/components/NoticeAnalyzer'
import { Header, Footer } from '@/components/HomeHeaderFooter'
import { HomeHero } from '@/components/HomeHero'
import {
  HowItWorksSection,
  SupportedNoticesSection,
  MeasurementSection,
  FaqSection,
} from '@/components/HomeSections'

export default function HomePage() {
  return (
    <div
      data-testid="home-page"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      className="relative flex min-h-dvh flex-col overflow-hidden canvas-bg"
    >
      <Header />

      <main
        id="main-content"
        className="relative z-10 flex flex-1 flex-col items-center justify-start gap-12 px-4 py-8 md:px-8 max-w-6xl mx-auto w-full"
      >
        <HomeHero />

        <div id="analyzer-workspace" className="w-full flex justify-center">
          <NoticeAnalyzer />
        </div>

        <HowItWorksSection />
        <SupportedNoticesSection />
        <MeasurementSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  )
}
