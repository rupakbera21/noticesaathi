import fs from 'fs'
import path from 'path'

/**
 * check-docs.mjs
 * Fails if:
 * 1. A backticked file path in docs/ or README.md does not exist
 * 2. package.json dependencies are missing from the README AI tools and libraries table
 */

let errors = 0

// 1. Check dependencies in package.json against README.md
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const readme = fs.readFileSync('README.md', 'utf-8')

const coreDeps = Object.keys(pkg.dependencies || {})
const devDepsToTrack = ['@playwright/test', 'jest-axe', 'fast-check']
const depsToCheck = [...coreDeps, ...devDepsToTrack]

console.log('Checking README dependencies table against package.json...')
for (const dep of depsToCheck) {
  // Normalize dependency name check in README
  const simpleName = dep.replace(/^@[^/]+\//, '')
  if (
    !readme.toLowerCase().includes(dep.toLowerCase()) &&
    !readme.toLowerCase().includes(simpleName.toLowerCase())
  ) {
    console.error(
      `[ERROR] Dependency '${dep}' is present in package.json but not documented in README.md`
    )
    errors++
  }
}

// 2. Check backticked file paths in README and docs
function isCandidateIgnored(candidate) {
  return (
    candidate.startsWith('http') ||
    candidate.includes('(') ||
    candidate.includes('*') ||
    candidate.includes(':') ||
    candidate.startsWith('--') ||
    candidate.endsWith('.mjs') ||
    candidate.includes(' ')
  )
}

function checkFilePathsInText(filePath, text) {
  const matches = text.match(/`([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)`/g)
  if (!matches) return

  for (const m of matches) {
    const candidate = m.replace(/`/g, '')
    if (isCandidateIgnored(candidate)) continue

    if (
      candidate.startsWith('docs/') ||
      candidate.startsWith('src/') ||
      candidate.startsWith('public/') ||
      candidate.startsWith('scripts/') ||
      candidate.startsWith('evals/') ||
      candidate.startsWith('data/')
    ) {
      const fullPath = path.join(process.cwd(), candidate)
      if (!fs.existsSync(fullPath)) {
        console.error(`[ERROR] In ${filePath}: Backticked path does not exist: '${candidate}'`)
        errors++
      }
    }
  }
}

checkFilePathsInText('README.md', readme)

const docsDir = path.join(process.cwd(), 'docs')
if (fs.existsSync(docsDir)) {
  for (const docFile of fs.readdirSync(docsDir)) {
    if (docFile.endsWith('.md')) {
      const docPath = path.join(docsDir, docFile)
      checkFilePathsInText(docPath, fs.readFileSync(docPath, 'utf-8'))
    }
  }
}

if (errors > 0) {
  console.error(`check-docs failed with ${errors} errors.`)
  process.exit(1)
} else {
  console.log(
    'check-docs passed: All file references and dependencies are documented and verified.'
  )
}
