import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security headers middleware.
 *
 * Trade-offs documented here (never 'unsafe-eval' in production):
 * - `style-src 'unsafe-inline'`: required by Next.js for critical CSS injection.
 *   Production never uses 'unsafe-eval'. Tested in CI.
 * - `script-src 'nonce-...'` nonce approach is deferred to Phase 4 when CSP is tightened.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",    // Next.js inline scripts; no eval
  "style-src 'self' 'unsafe-inline'",     // Next.js critical CSS
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",                    // expanded per-provider in Phase 3
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

export function proxy(_request: NextRequest): NextResponse {
  const response = NextResponse.next()

  response.headers.set('Content-Security-Policy', CSP)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
