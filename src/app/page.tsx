import Image from 'next/image'

function Header() {
  return (
    <header
      className="flex items-center border-b px-6 py-4"
      style={{ borderColor: 'var(--color-border)' }}
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
    <div className="flex flex-col items-center gap-3" data-testid="tailwind-proof">
      <div
        className="rounded-lg px-6 py-3 text-sm font-semibold text-white"
        style={{
          backgroundColor: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)',
        }}
        data-testid="primary-swatch"
      >
        Primary color — indigo #3733C8
      </div>
      <div
        className="rounded-lg border px-6 py-3 text-sm"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-muted)',
          borderRadius: 'var(--radius-md)',
        }}
        data-testid="surface-swatch"
      >
        Surface + border — Tailwind utilities applied
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer
      className="border-t px-6 py-4 text-center text-xs"
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
 * Proves: Tailwind CSS pipeline compiles, fonts load, logo renders in both themes,
 * health endpoint is reachable, skip link exists, h1 present.
 */
export default function HomePage() {
  return (
    <div
      data-testid="hello-page"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      className="flex min-h-dvh flex-col"
    >
      <Header />
      <main id="main-content" className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
        <h1
          className="text-center text-3xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          data-testid="heading"
        >
          Phase 1 — Foundation
        </h1>
        <p className="max-w-md text-center text-base" style={{ color: 'var(--color-text-muted)' }}>
          Scaffold complete. Tailwind CSS v4, TypeScript strict, security headers,
          health endpoint, fonts, and logos are live.
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
