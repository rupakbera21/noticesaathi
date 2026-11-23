# docs/FACTS.md — Verified Numbers and Facts

> Maintained for the team, pitch deck, and submission notes. Every number and feature listed here has been verified by automated unit/integration tests, evaluation benchmarks, or Playwright browser tests.

## Current Build Status (Phase 6 Final)
- **Repo URL**: https://github.com/rupakbera21/noticesaathi
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript (strict, `noUncheckedIndexedAccess`), Tailwind CSS v4, PostCSS
- **Languages Supported**: English (EN), Hindi (HI, `Noto Sans`), Bengali (BN, `Noto Sans Bengali`)
- **Brand Identity**: Atmospheric `#0A0A16` canvas, procedural SVG grain filter, floating luminous indigo auras, Deep Indigo `#3733C8` primary, Slate `#0D0D1A` surface, official Indian Rupee currency standard (`₹` formatted via `en-IN`)
- **Security & Hardening**:
  - 0 npm audit vulnerabilities (`npm audit --omit=dev`)
  - Automated secret scanner checking commits and workspace
  - In-memory rate limiting and distributed Upstash Redis sliding window limiter
  - Anti-prompt injection pattern matching (XML delimiter isolation)
  - Strict input size boundaries (max 25,000 characters per notice)
- **AI Orchestration & Fallback Ladder**:
  1. Primary: Google Gemini (`gemini-3.5-flash-lite`)
  2. Fallback: Groq Cloud (`openai/gpt-oss-120b`) via circuit breaker
  3. Safe Baseline: Deterministic Rule-Based Extractor (`src/services/extract/ruleBasedExtract.ts`)
- **Benchmark Evaluation Metrics** (`evals/results/baseline-eval.json`):
  - Notice Type Classification Accuracy: **100%**
  - Total Demand Computation Accuracy: **100%** (strictly matched in `₹`)
  - Escalation Decision Accuracy: **100%** (zero missed Section 74 fraud/suppression notices)
  - Citation Recall: **100%** (retrieves applicable sections §73, §74, §47, §50, §16)
  - Grounding Compliance Score: **82%** (validated against official CBIC knowledge chunks)
- **Deterministic Domain Engines**:
  - `src/domain/interest.ts`: Section 50 simple interest calculation (18% p.a. standard, 24% p.a. undue ITC)
  - `src/domain/lateFee.ts`: Section 47 late fees with statutory daily caps based on turnover/returns (standalone domain helper)
  - `src/domain/dates.ts`: Strict Indian Standard Time (IST, UTC+5:30) date parsing and deadline countdowns
  - `src/domain/totals.ts`: Strict summation integrity and rounding checks
  - `src/domain/escalation.ts`: Deterministic risk flagging for fraud, inspection (§67), cancellation, or demands > ₹5,00,000
- **Responsive Multi-Viewport Verification**:
  - Desktop (1280x800): 100% visual fidelity, side-by-side paper receipt and explanation panels
  - Tablet (768x1024): Adaptive stacked card layout
  - Mobile (390x844 - iPhone 14): Touch-friendly tabs, full-bleed receipt summary
  - Compact Mobile (360x640 - Android Budget): Verified zero horizontal scroll overflow
- **Health & Diagnostic Endpoint**: `GET /api/health` returning live provider connectivity booleans
