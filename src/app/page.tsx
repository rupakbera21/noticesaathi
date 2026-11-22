import Image from 'next/image'

function Header() {
  return (
    <header
      className="relative z-10 flex items-center border-b px-6 py-4 backdrop-blur-md"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(var(--color-bg), 0.7)' }}
    >
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
    </header>
  )
}

function ProofSection() {
  return (
    <div className="flex flex-col items-center gap-4" data-testid="tailwind-proof">
      <div
        className="rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
        style={{
          backgroundColor: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)',
        }}
        data-testid="primary-swatch"
      >
        Primary color — indigo #3733C8
      </div>
      <div
        className="rounded-lg border px-6 py-3 text-sm backdrop-blur-sm"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-muted)',
          borderRadius: 'var(--radius-md)',
        }}
        data-testid="surface-swatch"
      >
        Surface + border — tactile atmospheric backdrop
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer
      className="relative z-10 border-t px-6 py-4 text-center text-xs backdrop-blur-sm"
      style={{
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-subtle)',
      }}
    >
      NoticeSaathi — Homingo Hack Days 2026. Not legal advice. Synthetic data only.
    </footer>
  )
}

/**
 * Phase 1 hello page.
 * Proves: Tailwind CSS pipeline compiles, atmospheric lighting and grain render,
 * fonts load, logo renders in both themes, health endpoint is reachable.
 */
export default function HomePage() {
  return (
    <div
      data-testid="hello-page"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      className="relative flex min-h-dvh flex-col overflow-hidden"
    >
      {/* Tactile film grain and ambient light leak overlays */}
      <div className="grain-overlay" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />
      <div className="ambient-vignette" aria-hidden="true" />

      <Header />
      <main id="main-content" className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
        <h1
          className="text-center text-3xl font-bold tracking-tight md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          data-testid="heading"
        >
          Phase 1 — Foundation
        </h1>
        <p className="max-w-md text-center text-base" style={{ color: 'var(--color-text-muted)' }}>
          Scaffold complete. Atmospheric indigo/violet glow, fine tactile grain,
          Tailwind CSS v4, TypeScript strict, and security headers are active.
        </p>
        <ProofSection />
        <a
          href="/api/health"
          className="text-sm underline-offset-4 hover:underline"
          style={{ color: 'var(--color-primary)' }}
          data-testid="health-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          /api/health →
        </a>
      </main>
      <Footer />
    </div>
  )
}
