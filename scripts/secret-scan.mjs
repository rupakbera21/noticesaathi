import fs from 'fs'
import path from 'path'

// High-confidence patterns for secrets
const SECRET_PATTERNS = [
  /(?:api[_-]?key|access[_-]?token|secret[_-]?key|auth[_-]?token)[\s]*[=:][\s]*["']([a-zA-Z0-9_\-]{20,})["']/i,
  /AIza[0-9A-Za-z\-_]{35}/, // Google API key
  /gsk_[a-zA-Z0-9]{30,}/,   // Groq API key
  /ghp_[a-zA-Z0-9]{36}/,   // GitHub Personal Access Token
  /gho_[a-zA-Z0-9]{36}/,   // GitHub OAuth Token
]

const IGNORE_DIRS = new Set([
  '.git',
  '.next',
  'node_modules',
  'coverage',
  'dist',
  'build',
  'out',
])

const IGNORE_FILES = new Set([
  'package-lock.json',
  '.env.example',
  'secret-scan.mjs',
])

let foundSecrets = false

function scanFile(filePath) {
  const fileName = path.basename(filePath)
  if (IGNORE_FILES.has(fileName) || fileName.endsWith('.png') || fileName.endsWith('.ico')) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  for (const pattern of SECRET_PATTERNS) {
    const match = content.match(pattern)
    if (match) {
      console.error(`[SECRET SCAN ERROR] Potential secret found in ${filePath}`)
      foundSecrets = true
      break
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (entry.isFile()) {
      scanFile(fullPath)
    }
  }
}

console.log('Running local secret scan...')
walkDir(process.cwd())

if (foundSecrets) {
  console.error('Secret scan failed! Please remove sensitive tokens before committing.')
  process.exit(1)
} else {
  console.log('Secret scan passed: No hardcoded secrets found.')
}
