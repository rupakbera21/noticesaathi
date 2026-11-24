import React from 'react'
import { render } from '@testing-library/react'
import { findReportHighlights } from '@/components/reportHighlighting'
import { FormattedExplanation } from '@/components/FormattedExplanation'

describe('Report Highlighting & FormattedExplanation', () => {
  const enSample = `This notice relates to ASMT-10. Total demand stated is ₹45,500. In accordance with statutory requirements, a formal submission should be tendered within the allowed reply window.

Important Deadline Notice: The reply period (30 days) runs from the date of receipt of this notice, not the notice issue date. Because the date of receipt is not recorded on the notice, please check your actual date of receipt.

Statutory Context & Review:
• Section 61 (Scrutiny): Departmental verification. Mandatory CA consultation required.`

  const hiSample = `यह नोटिस ASMT-10 के संबंध में जारी किया गया है। विभाग ने कुल ₹45,500 की मांग की है। आधिकारिक प्रावधानों के अनुसार कृपया नियत समय सीमा में अपना विधिवत उत्तर प्रस्तुत करें।

महत्वपूर्ण समय सीमा: उत्तर देने की अवधि (30 दिन) नोटिस प्राप्त होने (receipt) की तारीख से शुरू होती है, नोटिस जारी होने की तारीख से नहीं। कृपया अपने नोटिस की वास्तविक प्राप्ति तिथि जांचें।

समीक्षा एवं कानूनी प्रावधान:
• धारा 74: तुरंत सीए से परामर्श लेना अनिवार्य है।`

  const bnSample = `এই নোটিশটি ASMT-10 সংক্রান্ত। মোট দাবিকৃত অর্থ ₹45,500। সরকারি নিয়মাবলী মেনে নির্দিষ্ট সময়সীমার মধ্যে যথাযথ জবাব দাখিল করুন।

গুরুত্বপূর্ণ সময়সীমা: জবাব দাখিলের মেয়াদ (30 দিন) নোটিশ প্রাপ্তির (receipt) तारीख থেকে শুরু হয়, নোটিশ জারির তারিখ থেকে নয়। অনুগ্রহ করে আপনার নোটিশ প্রাপ্তির সঠিক তারিখ দেখে নিন।

আইনগত বিধান ও পর্যালোচনা:
• ধারা 74: একজন যোগ্য সিএ-র পরামর্শ নেওয়া আবশ্যক।`

  it('identifies 2 to 4 key semantic phrases across English, Hindi, and Bengali', () => {
    const enHighlights = findReportHighlights(enSample)
    expect(enHighlights.length).toBeGreaterThanOrEqual(2)
    expect(enHighlights.length).toBeLessThanOrEqual(4)
    expect(enHighlights.some(h => h.phrase.includes('₹45,500'))).toBe(true)
    expect(enHighlights.some(h => h.phrase.includes('check your actual date of receipt'))).toBe(
      true
    )

    const hiHighlights = findReportHighlights(hiSample)
    expect(hiHighlights.length).toBeGreaterThanOrEqual(2)
    expect(hiHighlights.length).toBeLessThanOrEqual(4)
    expect(hiHighlights.some(h => h.phrase.includes('₹45,500'))).toBe(true)
    expect(hiHighlights.some(h => h.phrase.includes('वास्तविक प्राप्ति तिथि जांचें'))).toBe(true)

    const bnHighlights = findReportHighlights(bnSample)
    expect(bnHighlights.length).toBeGreaterThanOrEqual(2)
    expect(bnHighlights.length).toBeLessThanOrEqual(4)
    expect(bnHighlights.some(h => h.phrase.includes('₹45,500'))).toBe(true)
    expect(bnHighlights.some(h => h.phrase.includes('সঠিক তারিখ দেখে নিন'))).toBe(true)
  })

  it('renders semantic <mark> elements with report-highlight-mark and staggered animation delays', () => {
    const { container } = render(<FormattedExplanation text={enSample} />)
    const marks = container.querySelectorAll('mark.report-highlight-mark')
    expect(marks.length).toBeGreaterThanOrEqual(2)
    expect(marks.length).toBeLessThanOrEqual(4)

    // Check first and second mark animation delays
    expect(marks[0]).toHaveStyle({ animationDelay: '0ms' })
    expect(marks[1]).toHaveStyle({ animationDelay: '140ms' })

    // Text remains intact and selectable
    expect(container.textContent).toContain('Total demand stated is ₹45,500')
    expect(container.textContent).toContain('please check your actual date of receipt')
  })

  it('renders Bengali and Hindi marks cleanly', () => {
    const { container: bnContainer } = render(<FormattedExplanation text={bnSample} />)
    const bnMarks = bnContainer.querySelectorAll('mark.report-highlight-mark')
    expect(bnMarks.length).toBeGreaterThanOrEqual(2)

    const { container: hiContainer } = render(<FormattedExplanation text={hiSample} />)
    const hiMarks = hiContainer.querySelectorAll('mark.report-highlight-mark')
    expect(hiMarks.length).toBeGreaterThanOrEqual(2)
  })
})
