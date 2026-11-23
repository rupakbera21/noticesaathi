import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  HowItWorksSection,
  FeaturesSection,
  MeasurementSection,
  SupportedNoticesSection,
  FaqSection,
} from '@/components/HomeSections'
import {
  TrustHero,
  TrustArchitectureSection,
  TrustCalculationsSection,
  TrustEscalationSection,
  TrustBenchmarkSection,
  TrustDisclaimerSection,
} from '@/components/TrustSections'
import { Header, Footer, TrustPills } from '@/components/HomeHeaderFooter'

describe('Static Presentational Sections', () => {
  it('renders home sections without crashing', () => {
    render(
      <div>
        <TrustPills />
        <FeaturesSection />
        <HowItWorksSection />
        <MeasurementSection />
        <SupportedNoticesSection />
        <FaqSection />
      </div>
    )
    expect(screen.getByText(/How NoticeSaathi Works/i)).toBeInTheDocument()
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
  })

  it('renders trust sections without crashing', () => {
    render(
      <div>
        <TrustHero />
        <TrustArchitectureSection />
        <TrustCalculationsSection />
        <TrustEscalationSection />
        <TrustBenchmarkSection />
        <TrustDisclaimerSection />
      </div>
    )
    expect(screen.getByText(/Trust, Privacy & Verification/i)).toBeInTheDocument()
    expect(screen.getByText(/Data Flow & Honest Privacy Disclosure/i)).toBeInTheDocument()
    expect(screen.getByText(/How We Measure Accuracy: Benchmark Suite/i)).toBeInTheDocument()
  })

  it('renders header and footer without crashing', () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>
    )
    expect(screen.getAllByText(/NoticeSaathi/i).length).toBeGreaterThan(0)
  })
})
