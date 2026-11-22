import Image from 'next/image'
import { NoticeAnalyzer } from '@/components/NoticeAnalyzer'

function Header() {
  return (
    <header
      className="relative z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(10, 10, 22, 0.75)' }}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logo/logo-light@2x.png"
          alt="NoticeSaathi"
          width={160}
          height={53}
          priority
          className="block dark:hidden"
          data-testid="logo-light"
        />
        <Image
          src="/logo/logo-dark@2x.png"
          alt="NoticeSaathi"
          width={160}
          height={53}
          priority
          className="hidden dark:block"
          data-testid="logo-dark"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300">
          GST AI Companion
        </span>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer
      className="relative z-10 border-t px-6 py-8 text-center text-xs backdrop-blur-sm"
      style={{
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-subtle)',
      }}
    >
      <div className="mx-auto max-w-3xl space-y-2">
        <p className="font-semibold text-gray-400">
          NoticeSaathi — Automated GST Notice Triage &amp; Legal Reply Drafting
        </p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Statutory Disclaimer: NoticeSaathi is an assistive computational and educational tool designed to help Indian taxpayers understand official communications. It does not constitute formal legal or financial advice. For complex notices involving fraud (§74), cancellation (§29), or substantial demands, always consult a qualified Chartered Accountant.
        </p>
        <div className="pt-2 text-[10px] text-gray-600">
          Built for Homingo Hack Days 2026. Certified synthetic benchmarks and open CBIC gazette data only.
        </div>
      </div>
    </footer>
  )
}

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
            Understand Your GST Notice in Minutes
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Instant itemized demand breakdown in ₹, verified CBIC statutory citations,
            deterministic response deadlines, and grounded legal replies for Indian traders.
          </p>
        </div>

        <NoticeAnalyzer />
      </main>

      <Footer />
    </div>
  )
}
