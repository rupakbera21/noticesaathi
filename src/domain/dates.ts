/**
 * IST (Indian Standard Time, UTC+05:30) Date Arithmetic Engine.
 * Pure functions with injected clock for deterministic testing.
 */

export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000

/**
 * Returns current Date in IST, using an optional injected clock.
 */
export function nowInIST(clock: () => Date = () => new Date()): Date {
  const utcNow = clock()
  return new Date(utcNow.getTime() + IST_OFFSET_MS)
}

/**
 * Parses an ISO date string (YYYY-MM-DD) or DD/MM/YYYY into an IST Date object.
 */
export function parseDateIST(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error('Invalid date string provided to parseDateIST')
  }

  // Handle DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyyMatch = dateStr.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (ddmmyyyyMatch && ddmmyyyyMatch[1] && ddmmyyyyMatch[2] && ddmmyyyyMatch[3]) {
    const day = parseInt(ddmmyyyyMatch[1], 10)
    const month = parseInt(ddmmyyyyMatch[2], 10) - 1
    const year = parseInt(ddmmyyyyMatch[3], 10)
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  }

  // Handle YYYY-MM-DD
  const yyyymmddMatch = dateStr.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (yyyymmddMatch && yyyymmddMatch[1] && yyyymmddMatch[2] && yyyymmddMatch[3]) {
    const year = parseInt(yyyymmddMatch[1], 10)
    const month = parseInt(yyyymmddMatch[2], 10) - 1
    const day = parseInt(yyyymmddMatch[3], 10)
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  }

  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) {
    throw new Error(`Unable to parse date string: "${dateStr}"`)
  }
  return parsed
}

/**
 * Adds an integer number of calendar days to an IST date.
 */
export function addDaysIST(baseDate: Date, days: number): Date {
  const result = new Date(baseDate.getTime())
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

/**
 * Calculates calendar days between two dates (toDate - fromDate).
 */
export function daysBetweenIST(fromDate: Date, toDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  const utc1 = Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate())
  const utc2 = Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate())
  return Math.floor((utc2 - utc1) / msPerDay)
}

/**
 * Computes remaining calendar days from now (in IST) until deadline.
 */
export function getRemainingDaysIST(deadline: Date, clock: () => Date = () => new Date()): number {
  const now = nowInIST(clock)
  return daysBetweenIST(now, deadline)
}

/**
 * Formats a date in standard Indian format (DD MMM YYYY, e.g. "15 Dec 2024").
 */
export function formatDateIST(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = months[date.getUTCMonth()] ?? ''
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

export interface DeadlineResolution {
  status: 'explicit' | 'derived' | 'uncertain'
  deadlineDate: Date | null
  formattedDate: string | null
  remainingDays: number | null
  isExpired: boolean
  message: string
}

/**
 * Resolves the statutory deadline for a GST notice without inventing fallback dates.
 * - 'explicit': Stated explicitly on the notice.
 * - 'derived': Stated reply window (e.g. 30 days) from date of service or notice date.
 * - 'uncertain': Missing dates or windows, conflicting data; prompts user to check the notice.
 */
function resolveExplicitDeadline(rawDate: string, clock: () => Date): DeadlineResolution | null {
  try {
    const deadlineDate = parseDateIST(rawDate)
    const remainingDays = getRemainingDaysIST(deadlineDate, clock)
    const isExpired = remainingDays < 0
    return {
      status: 'explicit',
      deadlineDate,
      formattedDate: formatDateIST(deadlineDate),
      remainingDays,
      isExpired,
      message: isExpired
        ? `Response Expired (${formatDateIST(deadlineDate)})`
        : `${remainingDays} Days Left (${formatDateIST(deadlineDate)})`,
    }
  } catch {
    return null
  }
}

function resolveDerivedDeadline(
  startDateStr: string,
  replyDays: number,
  clock: () => Date
): DeadlineResolution | null {
  try {
    const startDate = parseDateIST(startDateStr)
    const deadlineDate = addDaysIST(startDate, replyDays)
    const remainingDays = getRemainingDaysIST(deadlineDate, clock)
    const isExpired = remainingDays < 0
    return {
      status: 'derived',
      deadlineDate,
      formattedDate: formatDateIST(deadlineDate),
      remainingDays,
      isExpired,
      message: isExpired
        ? `Response Expired (${formatDateIST(deadlineDate)})`
        : `${remainingDays} Days Left (${formatDateIST(deadlineDate)})`,
    }
  } catch {
    return null
  }
}

export function resolveNoticeDeadline(
  notice: {
    noticeDate?: string | null
    serviceDate?: string | null
    replyDeadlineDate?: string | null
    replyDaysAllowed?: number | null
    isReceiptBased?: boolean
  },
  clock: () => Date = () => new Date()
): DeadlineResolution {
  if (notice.replyDeadlineDate) {
    const explicit = resolveExplicitDeadline(notice.replyDeadlineDate, clock)
    if (explicit) return explicit
  }

  if (notice.isReceiptBased && !notice.serviceDate) {
    return {
      status: 'uncertain',
      deadlineDate: null,
      formattedDate: null,
      remainingDays: null,
      isExpired: false,
      message: 'Check the deadline on your notice',
    }
  }

  const startDateStr = notice.serviceDate || (!notice.isReceiptBased ? notice.noticeDate : null)
  if (startDateStr && notice.replyDaysAllowed && notice.replyDaysAllowed > 0) {
    const derived = resolveDerivedDeadline(startDateStr, notice.replyDaysAllowed, clock)
    if (derived) return derived
  }

  return {
    status: 'uncertain',
    deadlineDate: null,
    formattedDate: null,
    remainingDays: null,
    isExpired: false,
    message: 'Check the deadline on your notice',
  }
}
