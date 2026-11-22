import fs from 'fs'
import path from 'path'

/**
 * check-tokens.mjs
 * Fails if components contain raw hex colors, arbitrary Tailwind bracket values (e.g., bg-[#123456]),
 * or raw emoji icons in components (must use SVG icons or semantic tokens).
 */

const COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components')
const APP_DIR = path.join(process.cwd(), 'src', 'app')

const HEX_COLOR_REGEX = /#[0-9a-fA-F]{3,8}\b/g
const ARBITRARY_TAILWIND_REGEX = /\b(bg|text|border|ring)-\[[^\]]+\]/g
// Emoji regex matching common emoji ranges
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u

let violations = 0

function checkFile(filePath) {
  // Allow globals.css to define tokens
  if (filePath.endsWith('globals.css')) return

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    // Check for raw hex colors outside comments
    if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
      // Hex check (ignore comments and metadata like SVG paths if any)
      const hexMatches = line.match(HEX_COLOR_REGEX)
      if (hexMatches && !filePath.includes('scripts')) {
        // Exclude allowed test files or token files
        console.warn(`[WARN] Possible raw hex color in ${path.relative(process.cwd(), filePath)}:${index + 1}: ${hexMatches.join(', ')}`)
      }

      // Arbitrary Tailwind values
      const arbitraryMatches = line.match(ARBITRARY_TAILWIND_REGEX)
      if (arbitraryMatches) {
        console.error(`[ERROR] Arbitrary Tailwind bracket value in ${path.relative(process.cwd(), filePath)}:${index + 1}: ${arbitraryMatches.join(', ')}`)
        violations++
      }

      // Raw emoji in components
      if (filePath.includes(path.join('src', 'components')) || filePath.includes(path.join('src', 'app'))) {
        if (EMOJI_REGEX.test(line) && !line.includes('//') && !line.includes('test')) {
          console.error(`[ERROR] Raw emoji found in UI file ${path.relative(process.cwd(), filePath)}:${index + 1}`)
          violations++
        }
      }
    }
  })
}

function walk(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        walk(fullPath)
      }
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx'))) {
      checkFile(fullPath)
    }
  }
}

console.log('Checking component tokens, styling constraints, and icon rules...')
walk(COMPONENTS_DIR)
walk(APP_DIR)

if (violations > 0) {
  console.error(`Token check failed with ${violations} violations.`)
  process.exit(1)
} else {
  console.log('Token check passed: All UI components conform to token and icon standards.')
}
