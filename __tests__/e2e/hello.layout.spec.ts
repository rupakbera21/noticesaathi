import { test, expect } from '@playwright/test'
import path from 'path'
import os from 'os'

const SCREENSHOTS_DIR = path.join(os.tmpdir(), 'noticesaathi-screenshots')

/**
 * NoticeSaathi UI Layout & Accessibility Tests.
 * Verifies: heading, notice intake UI, responsive layout across viewports,
 * no horizontal overflow, skip link focus, dark theme rendering.
 */

test.describe('NoticeSaathi Main Interface Layout', () => {
  test('page loads and heading is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('heading')).toBeVisible()
    await expect(page.getByTestId('heading')).toHaveText('Understand your GST notice.')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'home-desktop.png'), fullPage: true })
  })

  test('skip link exists as first focusable element', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeFocused()
  })

  test('notice analyzer and sample buttons render', async ({ page }) => {
    await page.goto('/')
    const analyzer = page.getByTestId('notice-analyzer')
    await expect(analyzer).toBeVisible()
    await expect(page.getByTestId('sample-asmt10-btn')).toBeVisible()
    await expect(page.getByTestId('notice-input-textarea')).toBeVisible()
  })

  test('no horizontal overflow across viewports', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(overflow).toBe(false)
  })

  test('logo image is attached in DOM', async ({ page }) => {
    await page.goto('/')
    const logos = page.locator('[data-testid="logo-light"], [data-testid="logo-dark"]')
    await expect(logos.first()).toBeAttached()
  })

  test('dark theme renders cleanly', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'home-dark.png'), fullPage: true })
  })
})

test('health endpoint returns 200 with expected shape', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  const body = (await res.json()) as unknown
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
