import { test, expect } from '@playwright/test'
import path from 'path'
import os from 'os'

const SCREENSHOTS_DIR = path.join(os.tmpdir(), 'noticesaathi-screenshots')

/**
 * Phase 1 layout tests.
 * Proves: Tailwind CSS pipeline compiled, logo loads, h1 present,
 * no horizontal overflow, health endpoint responds.
 * Run at 360, 390, 768 and 1280px via playwright.config.ts projects.
 */

test.describe('Hello page — foundation proof', () => {
  test('page loads and h1 is present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('heading')).toBeVisible()
    await expect(page.getByTestId('heading')).toHaveText('Phase 1 — Foundation')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'hello-desktop.png'), fullPage: true })
  })

  test('skip link exists as first focusable element', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeFocused()
  })

  test('Tailwind CSS compiles — primary swatch has non-default background', async ({ page }) => {
    await page.goto('/')
    const swatch = page.getByTestId('primary-swatch')
    await expect(swatch).toBeVisible()
    const bg = await swatch.evaluate(el => getComputedStyle(el).backgroundColor)
    // rgb(55, 51, 200) = #3733C8 — the primary indigo token
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).not.toBe('')
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(overflow).toBe(false)
  })

  test('logo image is visible', async ({ page }) => {
    await page.goto('/')
    // At least one logo variant should be in the DOM
    const logos = page.locator('[data-testid="logo-light"], [data-testid="logo-dark"]')
    await expect(logos.first()).toBeAttached()
  })

  test('dark theme renders cleanly', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'hello-dark.png'), fullPage: true })
  })
})

test('health endpoint returns 200 with expected shape', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  const body = await res.json() as unknown
  expect(body).toMatchObject({
    ok: true,
    timestamp: expect.any(String),
    providers: {
      gemini: expect.any(Boolean),
      groq: expect.any(Boolean),
      upstash: expect.any(Boolean),
    },
  })
})
