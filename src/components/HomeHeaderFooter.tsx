'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem('theme')
      const hasDarkClass = document.documentElement.classList.contains('dark')
      const activeDark = savedTheme === 'dark' || (savedTheme === null && hasDarkClass)
      setIsDark(activeDark)
      if (activeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  function toggleTheme() {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-indigo-500/40 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      data-testid="theme-toggle-btn"
    >
      <span>{isDark ? '☀️ Light' : '🌙 Dark'}</span>
    </button>
  )
}

export function Header() {
  function handleScrollToAnalyzer() {
    const el = document.getElementById('notice-input')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      el.focus()
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3.5 backdrop-blur-md bg-[var(--surface)]/85 border-indigo-100/70 dark:border-indigo-950/70 shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        <Image
          src="/logo/logo-light.png"
          alt="NoticeSaathi"
          width={150}
          height={50}
          priority
          className="block dark:hidden"
          data-testid="logo-light"
        />
        <Image
          src="/logo/logo-dark.png"
          alt="NoticeSaathi"
          width={150}
          height={50}
          priority
          className="hidden dark:block"
          data-testid="logo-dark"
        />
      </div>

      <nav
        aria-label="Main Navigation"
        className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]"
      >
        <a href="#how-it-works" className="hover:text-[var(--primary-action)] transition-colors">
          How It Works
        </a>
        <a
          href="#supported-notices"
          className="hover:text-[var(--primary-action)] transition-colors"
        >
          Supported Forms
        </a>
        <Link href="/trust" className="hover:text-[var(--primary-action)] transition-colors">
          Trust &amp; Privacy
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={handleScrollToAnalyzer}
          className="rounded-xl bg-[var(--primary-action)] hover:bg-[var(--primary-hover)] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors"
        >
          Analyze a notice
        </button>
      </div>
    </header>
  )
}

export function TrustPills() {
  return (
    <div className="flex items-center justify-center gap-3 text-xs text-[var(--text-secondary)]">
      <span>English • हिन्दी • বাংলা</span>
      <span>•</span>
      <Link href="/trust" className="hover:underline font-medium text-[var(--color-primary)]">
        Trust &amp; Verification Policy →
      </Link>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t px-6 py-10 text-center text-xs backdrop-blur-sm bg-white/80 border-slate-200 dark:bg-transparent dark:border-[#252542]">
      <div className="mx-auto max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-gray-400">
          <Link
            href="/trust"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold"
          >
            Trust &amp; Verification Policy
          </Link>
          <a
            href="https://cbic.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            CBIC Official Portal ↗
          </a>
          <a
            href="https://gst.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            GST Common Portal ↗
          </a>
          <a
            href="https://github.com/rupakbera21/noticesaathi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            GitHub Repository ↗
          </a>
        </div>
        <p className="font-semibold text-slate-700 dark:text-gray-400">
          NoticeSaathi — Automated GST Notice Triage &amp; Legal Reply Drafting
        </p>
        <p className="text-[11px] text-slate-500 dark:text-gray-500 leading-relaxed">
          Statutory Disclaimer: NoticeSaathi is an assistive computational and educational tool
          designed to help Indian taxpayers understand official communications. It does not
          constitute formal legal or financial advice. For complex notices involving fraud (Section
          74), cancellation (Section 29), or substantial demands, always consult a qualified
          Chartered Accountant.
        </p>
        <div className="pt-2 text-[10px] text-slate-400 dark:text-gray-600">
          Built for Homingo Hack Days 2026. Certified synthetic benchmarks and open CBIC gazette
          data only.
        </div>
      </div>
    </footer>
  )
}
