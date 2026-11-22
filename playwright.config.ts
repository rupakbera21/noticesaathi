import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Use the installed Chrome (not Playwright's bundled Chromium)
    channel: 'chrome',
  },
  projects: [
    {
      name: 'layout',
      testMatch: '**/*.layout.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'layout-mobile-360',
      testMatch: '**/*.layout.spec.ts',
      use: { viewport: { width: 360, height: 800 }, channel: 'chrome' },
    },
    {
      name: 'layout-mobile-390',
      testMatch: '**/*.layout.spec.ts',
      use: { viewport: { width: 390, height: 844 }, channel: 'chrome' },
    },
    {
      name: 'layout-tablet',
      testMatch: '**/*.layout.spec.ts',
      use: { viewport: { width: 768, height: 1024 }, channel: 'chrome' },
    },
    {
      name: 'e2e',
      testMatch: '**/*.e2e.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
})
