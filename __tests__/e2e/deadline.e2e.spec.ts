import { test, expect } from '@playwright/test'

test.describe('Receipt-Based Deadline Regression', () => {
  test('notice with "within 30 days of receipt" and issue date renders uncertain deadline badge', async ({
    page,
  }) => {
    await page.goto('/')

    const receiptNoticeText = `
FORM GST ASMT-10
[See rule 99(1)]
Notice for intimating discrepancies in the return after scrutiny
Reference No: ASMT10/DL/2024/0912
Date: 10/08/2024
GSTIN: 07TESTU9999R1Z9
Legal Name: M/s Apex Synthetic Supplies
Tax Period: FY 2023-24

Scrutiny of your return under Section 61 revealed discrepancy.
Tax: Rs 42,000
Interest under Sec 50: Rs 3,500
Penalty: Rs 0
Total Stated Demand: Rs 45,500

You are requested to furnish an explanation within 30 days of receipt of this notice in FORM GST ASMT-11.
    `.trim()

    const textarea = page.getByTestId('notice-input-textarea')
    await textarea.fill(receiptNoticeText)

    const analyzeBtn = page.getByTestId('analyze-notice-btn')
    await analyzeBtn.click()

    // 1. Structured deadline is uncertain and displays "Check the deadline on your notice"
    const uncertainBadge = page.getByTestId('deadline-badge-uncertain')
    await expect(uncertainBadge).toBeVisible({ timeout: 15000 })
    await expect(uncertainBadge).toHaveText('Check the deadline on your notice')

    // 2. No inferred date, countdown ("Days Left"), or expired badge
    await expect(page.getByTestId('deadline-badge')).toHaveCount(0)
    await expect(page.locator('text=Days Left')).toHaveCount(0)
    await expect(page.locator('text=Response Expired')).toHaveCount(0)

    // 3. User-visible explanation communicates uncertainty
    const explanation = page.getByTestId('explanation-content')
    await expect(explanation).toBeVisible()
    await expect(explanation).toContainText('receipt')
    await expect(explanation).not.toContainText('09 Sep 2024')
    await expect(explanation).not.toContainText('09/09/2024')
  })

  test('notice with explicitly stated reply deadline renders explicit deadline badge', async ({
    page,
  }) => {
    await page.goto('/')

    const explicitNoticeText = `
FORM GST ASMT-10
[See rule 99(1)]
Reference No: ASMT10/DL/2024/0915
Date: 10/08/2024
GSTIN: 07TESTU9999R1Z9
Tax Demand: Rs 30,000
Total Stated Demand: Rs 30,000

Reply on or before 15/12/2024.
    `.trim()

    const textarea = page.getByTestId('notice-input-textarea')
    await textarea.fill(explicitNoticeText)

    const analyzeBtn = page.getByTestId('analyze-notice-btn')
    await analyzeBtn.click()

    const explicitBadge = page.getByTestId('deadline-badge')
    await expect(explicitBadge).toBeVisible({ timeout: 15000 })
    await expect(explicitBadge).toContainText('15 Dec 2024')
    await expect(page.getByTestId('deadline-badge-uncertain')).toHaveCount(0)
  })
})
