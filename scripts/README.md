# scripts/

One-off and utility scripts. Each is documented here. None are production dependencies.

| Script | Command | Purpose |
|---|---|---|
| `analyze-logos.py` | `python scripts/analyze-logos.py` | Reports logo dimensions, file sizes and rough color sampling (stdlib only, no Pillow) |
| `process-logos.py` | `python scripts/process-logos.py` | Samples exact brand colors, creates optimized header copies in `public/logo/`, generates `src/app/icon.png`, `apple-icon.png` and `favicon.ico`, saves icon previews to temp. Requires Pillow (`pip install pillow`). One-off; not run in CI. |

> Scripts are run manually by the developer. They write output to `public/logo/` and `src/app/` (committed) and to the system temp folder (not committed).
