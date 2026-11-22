# NoticeSaathi — GST Notice Copilot for Indian Small Traders

[![Verification Pipeline](https://img.shields.io/badge/Verification-Passing%20(100%25)-success)](https://github.com/rupakbera21/noticesaathi)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **NoticeSaathi** turns complex, intimidating Indian GST notices into an itemized demand breakdown in **`₹`**, plain-language explanations in English, Hindi, and Bengali, verified CBIC legal citations, clear Chartered Accountant (CA) escalation advisories, and an automated formal draft reply under Section 75(4).

---

## The Problem & The $15-an-Hour Expert

Built for **Homingo Hack Days 2026 (Track: LLM Apps — Problem Statement C1: "The $15-an-hour expert")**.

In India, millions of micro, small, and medium enterprises (MSMEs), kirana store owners, and independent traders receive GST notices such as **ASMT-10** (scrutiny of returns), **DRC-01** (show-cause notice of demand), or **GSTR-3A** (notice to return defaulters). 

For an ordinary business owner:
1. **The Credential Bottleneck**: A Chartered Accountant (CA) or tax lawyer charges thousands of rupees per consultation and is often unavailable on short notice.
2. **The Countdown Trap**: GST notices have strict statutory deadlines (typically 15 to 30 days). Missing a deadline causes ex-parte penalty assessment or bank attachment.
3. **The Calculation Maze**: Demands mix basic tax, Section 50 interest (18%–24% p.a.), Section 47 late fees, and Section 73/74 penalties.
4. **The Language Barrier**: Notices are drafted in dense statutory English legalese that small traders and clerks cannot easily interpret.

**NoticeSaathi removes the credential bottleneck** by acting as a 24/7 expert copilot. It computes liabilities deterministically in code, retrieves official CBIC gazettes, explains the implications in regional languages, and drafts an official legal reply—while strictly alerting the user when a high-risk case requires a qualified human CA.

---

## Traceability to Hackathon Statement

| Hackathon Core Idea | NoticeSaathi Implementation |
|---|---|
| **Ordinary worker empowered** | A shop clerk or small business owner pastes or uploads a notice and immediately gets an itemized receipt in **`₹`**, a deadline countdown, a document checklist, and an official draft reply. |
| **Credential bottleneck removed** | Automated triage, statutory cross-checking, and Section 75(4) draft reply preparation without waiting for an expensive specialist. |
| **Clear boundary for human escalation** | Deterministic escalation flags for fraud allegations (§74), high demands (> ₹5,00,000), search/inspection (§67), or cancellation of registration. |
| **Built with rigor and verifiable proof** | Automated evaluation benchmark suite verifying extraction accuracy, demand calculations, citation recall, and grounding against official CBIC knowledge chunks. |

---

## End-to-End Architecture & Processing Pipeline

```
   ┌───────────────────────────────────────────────────────────────┐
   │                  Next.js 16 Web Interface                    │
   │  • Sample Notice Intake (ASMT-10 / DRC-01 / GSTR-3A)          │
   │  • Paper Bill Receipt Summary with Total Consistency Check    │
   │  • Multilingual Explanations (EN / HI / BN)                   │
   │  • Official CBIC Statutory Citations Cards                    │
   │  • CA Escalation Risk Banner & Actionable Advisory            │
   │  • Sourced Formal Draft Reply Modal (§75(4) Personal Hearing) │
   └──────────────────────────────┬────────────────────────────────┘
                                  │ POST /api/analyze
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │           Security Proxy & Rate Limiter (`src/proxy.ts`)        │
   │  • Upstash Redis Sliding Window Rate Limiter (20 req/min)     │
   │  • Input Character Guard (max 25,000 chars)                   │
   │  • Anti-Prompt Injection Filter (XML Delimiter Isolation)     │
   └──────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │            Deterministic Fingerprint & Cache Lookup           │
   │  • SHA-256 Notice Fingerprinting (`src/domain/fingerprint.ts`)│
   │  • In-Memory / Upstash Redis Response Cache                   │
   └──────────────────────────────┬────────────────────────────────┘
                                  │ Cache Miss
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │           Multi-Tier AI Fallback Orchestration Ladder          │
   │  ┌─────────────────────────────────────────────────────────┐  │
   │  │ Primary: Google Gemini (`gemini-3.5-flash-lite`)         │  │
   │  └───────────────────────────┬─────────────────────────────┘  │
   │                              │ On failure / quota exceeded    │
   │  ┌───────────────────────────▼─────────────────────────────┐  │
   │  │ Fallback: Groq Cloud (`openai/gpt-oss-120b`)             │  │
   │  └───────────────────────────┬─────────────────────────────┘  │
   │                              │ On failure / circuit OPEN      │
   │  ┌───────────────────────────▼─────────────────────────────┐  │
   │  │ Safe Baseline: Deterministic Rule-Based Extractor        │  │
   │  └─────────────────────────────────────────────────────────┘  │
   └──────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │              Deterministic Domain Calculations                │
   │  • `src/domain/interest.ts`: Section 50 Interest (18%/24% p.a.)│
   │  • `src/domain/lateFee.ts`: Section 47 Statutory Late Fees    │
   │  • `src/domain/dates.ts`: Strict Indian Standard Time (IST)   │
   │  • `src/domain/totals.ts`: Strict ₹ Summation Integrity Check  │
   │  • `src/domain/escalation.ts`: Section 74 Fraud / Risk Rules  │
   └──────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │       Knowledge Base Retrieval & Grounding Verification       │
   │  • 8 Official CBIC Statutory Chunks (`data/kb/chunks.json`)    │
   │  • Statutory Form Validation (ASMT-10, DRC-01, GSTR-3A, etc.)  │
   │  • Grounding Validator (`src/services/ai/groundingValidator.ts`)│
   └──────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                 Verified Response Synthesis                   │
   │  Delivered to client in < 1,500ms with verified citations     │
   └───────────────────────────────────────────────────────────────┘
```

---

## Phase Gates Summary

| Phase | Description | Deliverables | Status |
|---|---|---|---|
| **Phase 0** | Scaffold, Licensing & Brand Assets | MIT License, README, UI design token system (`docs/DESIGN.md`), custom brand SVG assets | **Done** |
| **Phase 1** | Project Foundations & Infrastructure | Next.js 16, React 19, strict TypeScript, Tailwind v4, security proxy (`src/proxy.ts`), Playwright test suite | **Done** |
| **Phase 2** | Deterministic Engines & Knowledge Base | Financial calculation engines (`src/domain/`), CBIC knowledge base (`data/kb/`), deterministic rule extractor | **Done** |
| **Phase 3** | AI Layer & Grounded Legal Drafting | Gemini 3.5 & Groq fallback ladder, circuit breaker, grounding validator, Section 75(4) draft generator | **Done** |
| **Phase 4** | Hardening, Rate Limiting & Benchmarks | Automated eval runner (`scripts/eval.mjs`), Upstash Redis sliding window, prompt injection testing | **Done** |
| **Phase 5** | User Interface & Multi-Viewport Layout | Paper bill receipt in **`₹`**, CA alert card, multilingual tabs (EN/HI/BN), full Playwright visual test pass | **Done** |
| **Phase 6** | Production Readiness & Verification | Live smoke test pass, end-to-end quality gate (`npm run verify`), deployment documentation | **Done** |

---

## Benchmark Evaluation Results

Every release is evaluated against a curated gold-standard benchmark dataset (`evals/dataset/samples.json`) containing synthetic Indian GST notices across diverse scenarios (ITC discrepancies under ASMT-10, fraud/wilful suppression under DRC-01, and return defaults under GSTR-3A).

Results recorded in `evals/results/baseline-eval.json`:

| Metric | Target | Achieved Score | Notes |
|---|---|---|---|
| **Notice Type Classification** | ≥ 95% | **100%** | Accurately identifies ASMT-10, DRC-01, and GSTR-3A forms |
| **Total Demand Accuracy (₹)** | 100% | **100%** | Zero arithmetic divergence against statutory rules |
| **Escalation Decision Accuracy** | 100% | **100%** | Zero false negatives on fraud (§74) and high risk |
| **Citation Recall** | ≥ 90% | **100%** | Correctly retrieves all relevant statutory provisions |
| **Grounding Rate** | ≥ 80% | **82%** | All legal claims anchored to official CBIC knowledge chunks |

---

## AI Tools, Models, and Libraries

| Name | Type | Purpose |
|---|---|---|
| **Antigravity** | AI Coding Assistant | Primary tool for architecting, building, and verifying the application |
| **Gemini** | Language Model (`gemini-3.5-flash-lite`) | Primary extraction, multilingual summarization, and reply drafting engine |
| **Groq** | Language Model (`openai/gpt-oss-120b`) | Multi-tier fallback provider when Gemini is rate-limited or unavailable |
| **Olostep** | Web Data API | Ingesting official GST rules and circulars into structured knowledge chunks |
| **Upstash Redis** | Managed Redis Service | Distributed sliding window rate limiting and response caching |
| **Next.js** | React Framework (`^16.4.6`) | React Server Components, App Router, and Edge/Node API route handlers |
| **React** | UI Library (`^19.0.0`) | Declarative component model and state management |
| **react-dom** | React Rendering (`^19.0.0`) | DOM rendering engine for React 19 |
| **@google/generative-ai** | Google Gen AI SDK (`^0.21.0`) | Official client SDK for Google Gemini models |
| **groq-sdk** | Groq SDK (`^0.9.1`) | High-performance inference client for fallback models |
| **Zod** | Schema Validation (`^4.6.7`) | Strict schema validation for API inputs, outputs, and notice models |
| **Zustand** | State Management (`^5.0.2`) | In-browser state for notice history and user preferences |
| **MiniSearch** | Full-Text Search Engine (`^7.1.1`) | In-memory lexical search across CBIC knowledge base chunks |
| **pdf-parse** | Document Extraction (`^1.1.1`) | Text extraction from uploaded official GST notice PDFs |
| **@upstash/ratelimit** | Rate Limiting (`^2.0.5`) | Distributed per-IP and per-route rate limiting |
| **@upstash/redis** | Redis Client (`^1.34.3`) | Serverless HTTP Redis client for edge environments |
| **fast-check** | Property Testing (`^3.23.2`) | Property-based testing for interest and late fee calculation engines |
| **jest-axe** | Accessibility Testing (`^9.0.0`) | Automated WCAG AA accessibility compliance verification |
| **@playwright/test** | End-to-End Testing (`^1.49.1`) | Multi-viewport visual and interaction testing across 4 viewports |

---

## Safety, Privacy, and Guardrails

1. **Not Legal Advice**: NoticeSaathi is an assistive tool for understanding and drafting; it does not represent taxpayers before tax authorities or file replies directly.
2. **Deterministic Financial Math**: Models are never permitted to do arithmetic. All amounts, interest (§50), late fees (§47), and totals are computed strictly in code in `src/domain/`.
3. **Mandatory Human CA Escalation**: Clear visual banners mandate engaging a human professional whenever:
   - Allegations of fraud, wilful misstatement, or suppression of facts (§74) are detected.
   - Demands exceed ₹5,00,000.
   - Enforcement actions like search, seizure (§67), or cancellation of registration are threatened.
4. **Data Privacy**: No taxpayer names, addresses, or notice text are logged or saved to server databases. The notice history resides entirely in the user's browser local storage.
5. **Synthetic Evaluation Data**: All testing and evaluation samples use fictional taxpayer names, synthetic business entities, and deliberate test-pattern GSTINs.

---

## Local Development & Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# 1. Clone repository
git clone https://github.com/rupakbera21/noticesaathi.git
cd noticesaathi

# 2. Install dependencies
npm ci

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run local development server
npm run dev
```

Visit `http://localhost:3000` to interact with NoticeSaathi.

### Environment Variables

| Variable | Required | Description | Default |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API key | — |
| `GROQ_API_KEY` | **Yes** | Groq Cloud API key | — |
| `UPSTASH_REDIS_REST_URL` | **Yes** | Upstash Redis REST URL | — |
| `UPSTASH_REDIS_REST_TOKEN` | **Yes** | Upstash Redis REST Token | — |
| `OLOSTEP_API_KEY` | Optional | Olostep API key for web document ingestion | — |
| `GEMINI_MODEL` | Optional | Custom Gemini model | `gemini-3.5-flash-lite` |
| `GROQ_MODEL` | Optional | Custom Groq model | `openai/gpt-oss-120b` |

---

## Verification & Quality Gates

Run the complete suite of quality checks:

```bash
# Run all gates: secret-scan, lint, typecheck, kb-check, validate-dataset, eval, unit tests, and production build
npm run verify

# Run live provider smoke test
node --env-file=.env.local scripts/smoke.mjs

# Run Playwright multi-viewport layout tests
npm run test:layout
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
