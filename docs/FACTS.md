# docs/FACTS.md — Verified Numbers and Facts

> Maintained for the team, pitch deck, and submission notes. Every number and feature listed here has been verified by an automated test, build output, or browser test.

## Current Build Status (Phase 1)
- **Repo URL**: https://github.com/rupakbera21/noticesaathi
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript (strict, `noUncheckedIndexedAccess`), Tailwind CSS v4, PostCSS 8.5
- **Languages Supported**: English, Hindi (`Noto Sans`), Bengali (`Noto Sans Bengali`)
- **Brand Colors**: Deep Indigo `#3733C8` (primary), Slate-blue-grey `#F7F7FB` (neutral), Slate `#0D0D1A` (dark bg)
- **Contrast Compliance**: Wordmark 18.2:1 (light), 16.7:1 (dark) — exceeds WCAG AA 4.5:1 requirement
- **Security**: 0 npm audit vulnerabilities (`npm audit --omit=dev`), automated secret scan in CI and `npm run verify`
- **Health Endpoint**: `GET /api/health` returning provider connectivity booleans
