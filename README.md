# NoticeSaathi

NoticeSaathi helps small Indian traders and their clerks understand a GST notice, see exactly what is due and by when, and prepare a sourced draft reply, and it says clearly when a chartered accountant must take over.

---

## Status

**Work in progress.** Built during Homingo Hack Days, 21 Nov to 6 Dec 2026.
Track: LLM apps. Statement: C1 — "The $15-an-hour expert."

---

## Who it is for and what it does

**Who:** the owner or clerk of a small Indian business — a shop, a freelancer, a small manufacturer — who receives a GST notice and does not have a chartered accountant on call.

**The one task:** turn a GST notice into a clear, sourced, safe response plan.

**Why it matters:** the credential (a CA or tax lawyer) is the bottleneck. Missed deadlines and wrong replies are expensive. NoticeSaathi removes that bottleneck for the cases where it can, and tells the user clearly when a CA must step in.

**Finished means:** on the evaluation set of synthetic notices the app extracts structured facts, explains the notice in plain English, Hindi or Bengali with citations to official sources, shows the response deadline with a countdown, computes interest and late fees in code where the rules allow, lists the documents to gather, drafts a reply, and flags when to escalate — with accuracy, latency and cost reported honestly here and on `/trust`.

---

## Traceability to the hackathon statement

| Statement idea | In the build |
|---|---|
| An ordinary worker can do work that used to need a specialist | A clerk gets a notice understood, a deadline, a checklist and a sourced draft reply without a CA |
| Wherever a credential is the bottleneck, remove it | GST notice triage and reply preparation, with explicit escalation to a CA for cases that need one |
| Do it well | An evaluation harness with measured accuracy, citation validity, hallucination rate, latency and cost per notice |

---

## AI tools, models and libraries

| Name | What it is | What we use it for |
|---|---|---|
| Antigravity | AI coding assistant | Primary tool for building, reviewing and testing this project |
| Gemini | Primary language model (Google Gen AI SDK) | Notice extraction, explanation, planning, reply drafting, follow-up Q&A |
| Groq | Fallback language model (OpenAI-compatible API) | Provider ladder fallback when Gemini is unavailable |
| Olostep | Web data API | Ingesting official GST source documents into the knowledge base |
| Upstash Redis | Managed Redis | Rate limiting and circuit-breaker state |
| Next.js | React framework | App Router, API routes, SSR/streaming |
| React | UI library | Component model |
| Zod | Schema validation | Input validation on every route and AI output parsing |
| Zustand | Client state | Persisted notice history, language preference |
| MiniSearch | Lexical search | Knowledge base retrieval over chunks |
| pdf-parse | PDF text extraction | Extracting text from uploaded GST notice PDFs |
| @upstash/ratelimit | Rate limiting client | Per-IP and per-route limits |
| @upstash/redis | Redis client | Circuit-breaker state, cache |
| fast-check | Property-based testing | Engine edge case testing |
| jest-axe | Accessibility testing | Automated WCAG checks in component tests |
| @playwright/test | End-to-end testing | Browser tests at multiple viewports |

> This table is kept in sync with `package.json` by `npm run check:docs`. Last verified: _pending first install._

---

## Team and how we work

| Role | Responsibility |
|---|---|
| Developer (Rupak Bera) | All application code, architecture, build |
| Domain and data lead | Synthetic notice dataset, gold labels, rule file verification |
| UX and QA lead | Issue-template feedback after previews, manual test runs, Hindi and Bengali review |
| Documents lead | README prose, pitch deck, demo script |

**Rules for contributors:**
- Only the developer changes application code.
- Teammates contribute documents through pull requests that touch only `docs/`.
- UI feedback is filed as GitHub issues using the UI feedback template.
- Never commit secrets or real personal data.
- All sample data is synthetic and labelled as such.
- AI tools are allowed and must be disclosed; every tool used appears in the table above.

---

## Data policy

This project uses only synthetic or open data. No real person's personal data is ever stored, logged or committed. Every sample GST notice in `evals/dataset/` is entirely fictional: invented business names, GSTINs that deliberately fail the check-digit validation, and no real people. The app labels sample data as synthetic on screen.

---

## Sources

Official Indian government websites only. Each source is stored in `data/sources.json` with URL, title, authority and attribution note.

> Sources fetched via Olostep on: _pending ingestion run._

---

## Setup

> _Pending: will be filled in after Phase 1 scaffold is complete._

```
git clone https://github.com/rupakbera21/noticesaathi.git
cd noticesaathi
npm ci
cp .env.example .env.local   # fill in your keys
npm run dev
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Gemini language model |
| `GROQ_API_KEY` | Yes | Groq fallback model |
| `OLOSTEP_API_KEY` | Yes | Knowledge base ingestion |
| `UPSTASH_REDIS_REST_URL` | Yes | Rate limiting and circuit breaker |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Rate limiting and circuit breaker |
| `GEMINI_MODEL` | No | Override; default works with no value |
| `GROQ_MODEL` | No | Override; default works with no value |

---

## Demo

> _Video link: pending._
> _Live site: pending._

---

## How it works

> _Architecture diagram: pending Phase 1 scaffold._

---

## Evaluation results

> _Pending Phase 5. Method: 60 synthetic notices, extraction field accuracy, deadline correctness, citation validity, unsupported-claim rate, escalation precision and recall, retrieval recall at 5, latency p50 and p95, cost per notice. Ablation: plain LLM vs full pipeline. Results committed to `evals/results/latest.json` and shown on `/trust`._

---

## Safety, privacy and limitations

- NoticeSaathi prepares and explains; it does not file anything and is not legal advice.
- Every legal claim is cited to a fetched official source or labelled unsupported with an escalation note.
- Every number comes from a deterministic engine with a visible rule version.
- Fraud allegations, searches, large demands and low-confidence extractions trigger a "involve a CA" message.
- No notice text is stored on the server; history lives only in the browser.
- See `docs/SAFETY.md` for the full safety design.

---

## Facts (for teammates)

> See `docs/FACTS.md` for a running list of verified numbers and features.
