/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { proxy } from './proxy'

describe('Security proxy middleware', () => {
  it('attaches required security headers to responses', () => {
    const request = new NextRequest('http://localhost:3000/')
    const response = proxy(request)

    expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=63072000')
    expect(response.headers.get('Permissions-Policy')).toContain('camera=()')

    const csp = response.headers.get('Content-Security-Policy')
    expect(csp).toBeDefined()
    expect(csp).toContain("frame-ancestors 'none'")
    // Critical security check: unsafe-eval must NEVER be in CSP
    expect(csp).not.toContain("'unsafe-eval'")
  })
})
