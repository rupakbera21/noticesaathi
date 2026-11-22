'use client'

import React from 'react'

export const SAMPLES = {
  asmt10: `FORM GST ASMT-10
[See rule 99(1)]
Notice for intimating discrepancies in the return after scrutiny
Reference No: ASMT10/DL/2024/0912
Date: 10/08/2024
GSTIN: 07TESTU9999R1Z9
Legal Name: M/s Apex Synthetic Supplies
Tax Period: FY 2023-24

This is to intimate that scrutiny of your return for the tax period under Section 61 of the CGST Act, 2017 read with Rule 99 has revealed discrepancy:
Input Tax Credit availed in Table 4(A)(5) of GSTR-3B exceeds ITC available in GSTR-2B by Rs 42,000.

Tax: Rs 42,000
Interest under Sec 50: Rs 3,500
Penalty: Rs 0
Total Stated Demand: Rs 45,500

You are requested to furnish an explanation within 30 days of receipt of this notice in FORM GST ASMT-11.`,

  drc01Fraud: `FORM GST DRC-01
[See rule 142(1)]
Summary of Show Cause Notice
Reference No: DRC01/MH/2024/7712
Date: 04/09/2024
GSTIN: 27FAKEX0000R1Z2
Legal Name: M/s Fictional Metal Works
Tax Period: July 2022 to March 2023

Show Cause Notice under Section 74 of the CGST Act, 2017.
It appears that outward tax liability has been evaded by reason of fraud and wilful misstatement of turnover with deliberate suppression of facts.

Tax: Rs 6,80,000
Interest under Sec 50: Rs 1,12,000
Penalty under Sec 74: Rs 6,80,000
Total Stated Demand: Rs 14,72,000

You are directed to show cause within 30 days why the demand should not be confirmed.`,

  gstr3a: `FORM GST GSTR-3A
[See rule 68]
Notice to return defaulter under Section 46 for not filing return
Reference No: GSTR3A/WB/2024/1105
Date: 25/08/2024
GSTIN: 19TESTK0000R1Z5
Legal Name: M/s Fictional Kirana Stores

Being a registered taxable person, you have not furnished return in GSTR-3B for the month of July 2024.
You are hereby given notice under Section 46 of the CGST Act, 2017 to furnish the said return within 15 days, failing which the tax liability will be assessed under Section 62.`,
}

export type SampleKey = 'asmt10' | 'drc01' | 'gstr3a'

export function SampleNoticeButtons({
  selectedSample,
  onSelect,
}: {
  selectedSample: SampleKey | null
  onSelect: (key: SampleKey, text: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-400">Try sample notice:</span>
      <button
        onClick={() => onSelect('asmt10', SAMPLES.asmt10)}
        className={
          selectedSample === 'asmt10'
            ? 'rounded-md border-2 border-indigo-600 bg-indigo-100 text-indigo-900 font-semibold ring-1 ring-indigo-400 px-3 py-1 text-xs dark:border-indigo-400 dark:bg-indigo-900/80 dark:text-white dark:shadow-[0_0_12px_rgba(129,140,248,0.5)] transition-all'
            : 'rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 text-xs dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors'
        }
        aria-pressed={selectedSample === 'asmt10'}
        data-testid="sample-asmt10-btn"
      >
        ASMT-10 (Scrutiny)
      </button>
      <button
        onClick={() => onSelect('drc01', SAMPLES.drc01Fraud)}
        className={
          selectedSample === 'drc01'
            ? 'rounded-md border-2 border-red-600 bg-red-100 text-red-900 font-semibold ring-1 ring-red-400 px-3 py-1 text-xs dark:border-red-400 dark:bg-red-900/80 dark:text-red-100 dark:shadow-[0_0_12px_rgba(248,113,113,0.5)] transition-all'
            : 'rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 text-xs dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60 transition-colors'
        }
        aria-pressed={selectedSample === 'drc01'}
        data-testid="sample-drc01-btn"
      >
        DRC-01 (Section 74 Fraud)
      </button>
      <button
        onClick={() => onSelect('gstr3a', SAMPLES.gstr3a)}
        className={
          selectedSample === 'gstr3a'
            ? 'rounded-md border-2 border-amber-600 bg-amber-100 text-amber-900 font-semibold ring-1 ring-amber-400 px-3 py-1 text-xs dark:border-amber-400 dark:bg-amber-900/80 dark:text-amber-100 dark:shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-all'
            : 'rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1 text-xs dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60 transition-colors'
        }
        aria-pressed={selectedSample === 'gstr3a'}
        data-testid="sample-gstr3a-btn"
      >
        GSTR-3A (Non-Filer)
      </button>
    </div>
  )
}
