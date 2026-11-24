export interface HighlightSpan {
  phrase: string
  start: number
  end: number
}

// Patterns matching core semantic points across English, Hindi, and Bengali:
// 1. Stated demand with surrounding words distinguishing from estimate
// 2. Deadline status (uncertain receipt instruction OR confirmed reply window)
// 3. Next useful action (CA consultation recommendation OR formal reply preparation)

const AMOUNT_PATTERNS = [
  // English
  /(?:total (?:stated )?demand(?: stated)?(?: is)?|demand stated is|department has demanded a total of)\s*₹[0-9,]+(?:\s*(?:under|for|in))?/i,
  /total demand of\s*₹[0-9,]+/i,
  /Total Stated Demand:\s*₹[0-9,]+/i,
  // Hindi
  /विभाग ने कुल\s*₹[0-9,]+\s*की मांग की है/,
  /कुल मांग\s*₹[0-9,]+/,
  /कुल\s*₹[0-9,]+\s*की मांग/,
  // Bengali
  /মোট দাবিকৃত অর্থ\s*₹[0-9,]+/,
  /মোট\s*₹[0-9,]+\s*দাবি করা হয়েছে/,
]

const DEADLINE_PATTERNS = [
  // Uncertain deadline instructions (priority)
  /please check your actual date of receipt/i,
  /advise checking the actual date of receipt/i,
  /check your actual date of receipt/i,
  /कृपया अपने नोटिस की वास्तविक प्राप्ति तिथि जांचें/,
  /वास्तविक प्राप्ति तिथि जांचें/,
  /অনুগ্রহ করে আপনার নোটিশ প্রাপ্তির সঠিক তারিখ দেখে নিন/,
  /নোটিশ প্রাপ্তির সঠিক তারিখ দেখে নিন/,
  // Confirmed reply windows
  /tendered within the allowed reply window/i,
  /within the allowed reply window/i,
  /furnish an explanation within [0-9]+ days/i,
  /show cause within [0-9]+ days/i,
  /नियत समय सीमा में अपना विधिवत उत्तर प्रस्तुत करें/,
  /नियत समय सीमा में अपना विधिवत उत्तर/,
  /নির্দিষ্ট সময়সীমার মধ্যে যথাযথ জবাব দাখিল করুন/,
  /নির্দিষ্ট সময়সীমার মধ্যে যথাযথ জবাব/,
]

const ACTION_PATTERNS = [
  // CA consultation
  /Mandatory CA consultation required/i,
  /Recommended to be reviewed by a Chartered Accountant/i,
  /consult a Chartered Accountant/i,
  /consult a CA/i,
  /तुरंत सीए से परामर्श लेना अनिवार्य है/,
  /सीए से परामर्श लेना अनिवार्य है/,
  /सीए \(चार्टर्ड अकाउंटेंट\) से परामर्श/,
  /একজন যোগ্য সিএ-র পরামর্শ নেওয়া আবশ্যক/,
  /সিএ-র পরামর্শ নেওয়া আবশ্যক/,
  // Standard action
  /formal submission should be tendered/i,
  /prepare a draft response/i,
  /prepare your response/i,
  /furnish an explanation in FORM GST ASMT-11/i,
  /अपना विधिवत उत्तर प्रस्तुत करें/,
  /यथाযথ জবাব দাখিল করুন/,
]

const ALL_CATEGORY_PATTERNS = [AMOUNT_PATTERNS, DEADLINE_PATTERNS, ACTION_PATTERNS]

export function findReportHighlights(text: string): HighlightSpan[] {
  if (!text || text.trim().length === 0) return []
  const matches: HighlightSpan[] = []

  for (const category of ALL_CATEGORY_PATTERNS) {
    let bestMatch: HighlightSpan | null = null
    for (const pattern of category) {
      const m = text.match(pattern)
      if (m && typeof m.index === 'number') {
        const candidate: HighlightSpan = {
          phrase: m[0],
          start: m.index,
          end: m.index + m[0].length,
        }
        if (!bestMatch || candidate.phrase.length > bestMatch.phrase.length) {
          bestMatch = candidate
        }
      }
    }
    if (bestMatch) {
      matches.push(bestMatch)
    }
  }

  // Sort matches in reading order (by text start index)
  matches.sort((a, b) => a.start - b.start)

  // Deduplicate and filter out any overlaps
  const nonOverlapping: HighlightSpan[] = []
  let lastEnd = -1

  for (const span of matches) {
    if (span.start >= lastEnd) {
      nonOverlapping.push(span)
      lastEnd = span.end
    }
  }

  // Keep between 2 and 4 important phrases
  return nonOverlapping.slice(0, 4)
}
