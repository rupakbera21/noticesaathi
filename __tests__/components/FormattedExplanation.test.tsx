import React from 'react'
import { render, screen } from '@testing-library/react'
import { FormattedExplanation, parseExplanationBlocks } from '@/components/FormattedExplanation'

describe('FormattedExplanation Component', () => {
  const userEnglishExample = `**What the notice is about**
The tax department has sent you a “Notice to return defaulter” under **Section 46** because it could not find a GSTR‑3A return filed for the period in question. In everyday terms, the department is simply reminding you that a required GST return is missing from its records. There is no allegation of fraud; the notice is only a procedural step to give you a chance to explain why the return was not filed or to submit the missing return.

**Amounts due and reply deadline**
According to the notice, the total demand shown is **₹ 0** (both tax and interest are zero). This means that, at present, the department has not calculated any tax liability against you for the missing return. However, the notice does not state a clear “reply by” date. The reply window can vary, and the exact deadline is printed on the individual notice you received. Please check the top‑right corner of your notice or the “Reply by” field and note the date given there. If you cannot locate it, call the helpline number on the notice or log in to the GST portal to confirm the exact deadline.

**What you should do next**
1. **Gather the documents** – pull together the sales‑tax invoices, purchase registers, and any other records for the period for which the GSTR‑3A is missing.
2. **Prepare the return** – if you still have the data, file the pending GSTR‑3A on the GST portal (you can do this yourself if you are comfortable, or use the “Draft” mode first to double‑check).
3. **Draft a reply** – write a short letter stating why the return was not filed (e.g., technical glitch, oversight) and attach the filed return as proof.
4. **Consider professional help** – if you are unsure about the filing steps or the wording of the reply, it is wise to consult a Chartered Accountant or a GST practitioner. They can ensure the reply meets the department’s requirements and help you avoid any future notices.

Take the notice as an opportunity to clear the record; once you submit the missing return and the reply, the department will close the case. Good luck!`

  const userBengaliExample = `**১. নোটিশের মূল বিষয় ও কারণ**
এই নোটিশটি আপনার ব্যবসার জন্য গৃহীত হয়েছে কারণ আপনি নির্ধারিত সময়ের মধ্যে GSTR‑3B রিটার্ন দাখিল করেননি। CGST আইনের ধারা 46 অনুযায়ী, রিটার্ন না দিলে কর বিভাগ আপনাকে স্মরণ করিয়ে দিতে নোটিশ পাঠায়। এখানে কোনো করের বকেয়া (Tax) ₹0 দেওয়া হয়েছে, তাই এটি মূলত রিটার্ন না দেওয়ার জন্য একটি সতর্কতা, কোনো জালিয়াতি বা ইচ্ছাকৃত ভুলের অভিযোগ নেই।

**২. পরিশোধযোগ্য টাকা ও উত্তর দেওয়ার শেষ তারিখ**
নোটিশে উল্লেখ আছে যে মোট দাবী ₹0 — অর্থাৎ এই মুহূর্তে কোনো কর বা জরিমানা আপনার থেকে নেওয়া হবে না। তবে আপনাকে **২০২৪‑০৯‑০৯** তারিখের মধ্যে উত্তর দিতে হবে। যদি এই শেষ তারিখটি নোটিশ পাওয়ার তারিখ থেকে গণনা করা হয়, তবে আপনার হাতে থাকা নোটিশের তারিখ থেকে গুনে দেখুন কত দিন বাকি আছে; যদি নোটিশে স্পষ্টভাবে "প্রাপ্তি থেকে ৩০ দিন" বলা থাকে, তবে সেটি অনুসরণ করুন।

**৩. করণীয় কাজের তালিকা**
- **প্রয়োজনীয় ডকুমেন্ট:** আপনার সর্বশেষ GSTR‑3B ফাইলিং স্ক্রিনশট (যদি থাকে), পূর্বের রিটার্নের কপি, এবং ব্যবসার বিক্রয়‑ক্রয়ের রেকর্ড।
- **উত্তর প্রস্তুতি:** নোটিশের কপির সাথে একটি সংক্ষিপ্ত চিঠি লিখে জানান যে আপনি রিটার্ন দাখিলের জন্য কাজ করছেন এবং যদি ইতিমধ্যে দাখিল করে থাকেন তবে রেজিস্ট্রেশন নম্বর ও দাখিলের তারিখ উল্লেখ করুন।
- **সিএ (চার্টার্ড অ্যাকাউন্ট্যান্ট) পরামর্শ:** যদিও এখানে কোনো ট্যাক্স বকেয়া নেই, রিটার্ন না দেওয়ার কারণে ভবিষ্যতে পেনাল্টি বা অতিরিক্ত নোটিশ এড়াতে সিএ-এর সাহায্য নেওয়া বুদ্ধিমানের কাজ। তিনি আপনার রিটার্ন সঠিকভাবে দাখিল করতে এবং নোটিশের উত্তর সঠিক ফরম্যাটে প্রস্তুত করতে সহায়তা করবেন।

এই তিনটি ধাপ অনুসরণ করলে আপনি নোটিশের প্রয়োজনীয়তা পূরণ করতে পারবেন এবং ভবিষ্যতে কোনো অতিরিক্ত সমস্যার মুখোমুখি হবেন না।`

  it('renders English explanation cleanly without any raw ** asterisks', () => {
    const { container } = render(<FormattedExplanation text={userEnglishExample} />)
    const content = container.textContent || ''

    // Ensure NO raw ** appears in rendered text
    expect(content).not.toContain('**')

    // Headings rendered
    expect(screen.getByText('What the notice is about')).toBeInTheDocument()
    expect(screen.getByText('Amounts due and reply deadline')).toBeInTheDocument()
    expect(screen.getByText('What you should do next')).toBeInTheDocument()

    // Bolds rendered as <strong> tags
    const strongs = container.querySelectorAll('strong')
    const strongTexts = Array.from(strongs).map(s => s.textContent)
    expect(strongTexts).toContain('Section 46')
    expect(strongTexts).toContain('₹ 0')
    expect(strongTexts).toContain('Gather the documents')

    // Ordered list rendered
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(4)
  })

  it('renders Bengali explanation cleanly without any raw ** asterisks', () => {
    const { container } = render(<FormattedExplanation text={userBengaliExample} />)
    const content = container.textContent || ''

    // Ensure NO raw ** appears in rendered text
    expect(content).not.toContain('**')

    // Bengali headings rendered
    expect(screen.getByText('১. নোটিশের মূল বিষয় ও কারণ')).toBeInTheDocument()
    expect(screen.getByText('২. পরিশোধযোগ্য টাকা ও উত্তর দেওয়ার শেষ তারিখ')).toBeInTheDocument()
    expect(screen.getByText('৩. করণীয় কাজের তালিকা')).toBeInTheDocument()

    // Bengali bolds rendered as <strong> tags
    const strongs = container.querySelectorAll('strong')
    const strongTexts = Array.from(strongs).map(s => s.textContent)
    expect(strongTexts).toContain('২০২৪‑০৯‑০৯')
    expect(strongTexts).toContain('প্রয়োজনীয় ডকুমেন্ট:')

    // Unordered list rendered
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(3)
  })

  it('renders live Bengali API explanation cleanly without raw asterisks', () => {
    const liveBn = `**১. নোটিশের মূল বিষয় ও কারণ**  
এই নোটিশটি আপনার জমা দেওয়া GST রিটার্নে কিছু ভুল‑বিভ্রান্তি (ডিসক্রেপেন্সি) পাওয়া গিয়েছে বলে Central Board of Indirect Taxes and Customs (CBIC) আপনাকে জানাচ্ছে।

**২. মোট দাবী ও উত্তর‑দানের শেষ তারিখ**  
- মোট দাবী: **₹45,500**  
  - GST ট্যাক্স: **₹42,000**  
  - বকেয়া পেনাল্টি/ইন্টারেস্ট (যদি থাকে): **₹3,500**  

**৩. পরবর্তী করণীয় (ডকুমেন্ট ও পরামর্শ)**  
- **প্রস্তুত করতে হবে:** আপনার GST রিটার্নের কপি।
- **CA (চার্টার্ড অ্যাকাউন্ট্যান্ট) এর সাহায্য:** দ্রুতই একজন CA‑কে পরামর্শ করুন।`

    const { container } = render(<FormattedExplanation text={liveBn} />)
    const content = container.textContent || ''
    expect(content).not.toContain('**')

    expect(screen.getByText('১. নোটিশের মূল বিষয় ও কারণ')).toBeInTheDocument()
    expect(screen.getByText('২. মোট দাবী ও উত্তর‑দানের শেষ তারিখ')).toBeInTheDocument()
    expect(screen.getByText('৩. পরবর্তী করণীয় (ডকুমেন্ট ও পরামর্শ)')).toBeInTheDocument()

    const strongs = Array.from(container.querySelectorAll('strong')).map(s => s.textContent)
    expect(strongs).toContain('₹45,500')
    expect(strongs).toContain('প্রস্তুত করতে হবে:')
  })

  it('handles empty or blank text gracefully', () => {
    const { container } = render(<FormattedExplanation text="" />)
    expect(container.firstChild).toBeNull()
  })

  it('parses mixed markdown blocks correctly into headings, lists, and paragraphs', () => {
    const blocks = parseExplanationBlocks(userEnglishExample)
    expect(blocks.some(b => b.type === 'heading')).toBe(true)
    expect(blocks.some(b => b.type === 'ordered')).toBe(true)
    expect(blocks.some(b => b.type === 'paragraph')).toBe(true)
  })
})
