# scripts/

One-off, maintenance, and verification scripts. Each script is documented below.

| Script | Command | Purpose |
|---|---|---|
| `analyze-logos.py` | `python scripts/analyze-logos.py` | Reports logo dimensions, file sizes, and color sampling (stdlib only). |
| `process-logos.py` | `python scripts/process-logos.py` | Samples exact brand colors, generates 2x header copies in `public/logo/`, produces icons (`src/app/icon.png`, `apple-icon.png`, `favicon.ico`), and generates 16px/32px previews. |
| `secret-scan.mjs` | `node scripts/secret-scan.mjs` | Local secret scanner enforcing zero API keys or credentials committed to the repository. Part of `npm run verify`. |
| `check-tokens.mjs` | `node scripts/check-tokens.mjs` | Enforces no raw hex colors, no arbitrary Tailwind brackets (`bg-[#...]`), and no raw emoji icons in UI components. |
| `check-docs.mjs` | `node scripts/check-docs.mjs` | Validates that all backticked repository paths exist and all `package.json` dependencies are documented in `README.md`. |
| `smoke.mjs` | `node scripts/smoke.mjs` | Live connectivity smoke test for Gemini, Groq, and Upstash with redacted output. |
| `ingest.mjs` | `node scripts/ingest.mjs` | Knowledge base ingestion via Olostep API (implemented in Phase 2). |
| `kb-check.mjs` | `node scripts/kb-check.mjs` | Knowledge base chunk integrity and manifest checker (implemented in Phase 2). |
| `eval.mjs` | `node scripts/eval.mjs` | Full evaluation harness runner on synthetic GST notices (implemented in Phase 3/5). |
