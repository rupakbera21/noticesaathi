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
  return (
    <header
      className="relative z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md bg-white/95 border-slate-200/80 shadow-xs dark:bg-[#0A0A16]/85 dark:border-[#252542]"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logo/logo-light.png"
          alt="NoticeSaathi"
          width={160}
          height={53}
          priority
          className="block dark:hidden"
          data-testid="logo-light"
        />
        <Image
          src="/logo/logo-dark.png"
          alt="NoticeSaathi"
          width={160}
          height={53}
          priority
          className="hidden dark:block"
          data-testid="logo-dark"
        />
      </div>

      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-gray-300">
        <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
        <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Core Engines</a>
        <a href="#supported-notices" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Supported Forms</a>
        <a href="#faqs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQs</a>
        <Link href="/trust" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Trust &amp; Privacy</Link>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-3.5 py-1 text-xs font-bold text-white shadow-xs dark:from-indigo-500 dark:to-purple-500">
          GST AI Companion
        </span>
      </div>
    </header>
  )
}

export function TrustPills() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/90 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300 px-3 py-1 shadow-xs">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Rule-Based Math Check
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1 shadow-xs">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Statutory Law Citations
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50/90 text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-300 px-3 py-1 shadow-xs">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        English • हिन्दी • বাংলা
      </span>
      <Link
        href="/trust"
        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/90 text-sky-800 hover:bg-sky-100 hover:border-sky-300 dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/60 px-3 py-1 shadow-xs transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Zero Taxpayer Storage (Trust Page →)
      </Link>
    </div>
  )
}

export function Footer() {
  return (
    <footer
      className="relative z-10 border-t px-6 py-10 text-center text-xs backdrop-blur-sm bg-white/80 border-slate-200 dark:bg-transparent dark:border-[#252542]"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-gray-400">
          <Link href="/trust" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold">
            Trust &amp; Verification Policy
          </Link>
          <a href="https://cbic.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            CBIC Official Portal ↗
          </a>
          <a href="https://gst.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            GST Common Portal ↗
          </a>
          <a href="https://github.com/rupakbera21/noticesaathi" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            GitHub Repository ↗
          </a>
        </div>
        <p className="font-semibold text-slate-700 dark:text-gray-400">
          NoticeSaathi — Automated GST Notice Triage &amp; Legal Reply Drafting
        </p>
        <p className="text-[11px] text-slate-500 dark:text-gray-500 leading-relaxed">
          Statutory Disclaimer: NoticeSaathi is an assistive computational and educational tool designed to help Indian taxpayers understand official communications. It does not constitute formal legal or financial advice. For complex notices involving fraud (Section 74), cancellation (Section 29), or substantial demands, always consult a qualified Chartered Accountant.
        </p>
        <div className="pt-2 text-[10px] text-slate-400 dark:text-gray-600">
          Built for Homingo Hack Days 2026. Certified synthetic benchmarks and open CBIC gazette data only.
        </div>
      </div>
    </footer>
  )
}
