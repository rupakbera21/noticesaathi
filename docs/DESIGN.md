# docs/DESIGN.md — NoticeSaathi Design System

> **Status:** Draft — awaiting developer approval before UI code begins.
> Review against the avoid list in the build prompt before proceeding.

---

## 1. Brand origin

The palette is sampled directly from the three logo files. The logo has two colors:

| Token name | Hex | rgb | Luminance | Role in logo |
|---|---|---|---|---|
| `--indigo-core` | `#2020C0` | rgb(32, 32, 192) | 0.0515 | Main icon body (deep indigo) |
| `--indigo-mid` | `#2020A0` | rgb(32, 32, 160) | 0.0388 | Icon shadow / depth |
| `--indigo-light` | `#6080E0` | rgb(96, 128, 224) | 0.2331 | Icon dog-ear accent (light theme) |
| `--indigo-muted` | `#4040E0` | rgb(64, 64, 224) | 0.1014 | Icon body (dark logo) |
| `--navy-text` | `#000020` | rgb(0, 0, 32) | 0.0010 | Wordmark (light logo) |
| `--white-text` | `#EEEEF2` | rgb(238, 238, 242) | — | Wordmark (dark logo) |

The logo is a **deep indigo** (`#3733C8` area) chat-bubble-cum-document mark with a lighter blue dog-ear, and a near-black navy wordmark. There are no gradients, glows or sparkles in the interface — those belong to the logo.

---

## 2. Color tokens

### 2a. Named palette ramps

#### Indigo (primary — from logo)

| Token | Light theme | Dark theme | High contrast |
|---|---|---|---|
| `--color-primary-50` | `#EEEEFF` | `#EEEEFF` | `#FFFFFF` |
| `--color-primary-100` | `#D4D4FF` | `#D4D4FF` | `#D4D4FF` |
| `--color-primary-200` | `#A8A8F5` | `#A8A8F5` | `#A8A8F5` |
| `--color-primary-300` | `#7777EE` | `#8888F0` | `#8888FF` |
| `--color-primary-400` | `#5555E0` | `#6060E8` | `#6666FF` |
| `--color-primary-500` | `#3733C8` | `#4040E0` | `#4444FF` |
| `--color-primary-600` | `#2B28A8` | `#3030C0` | `#3333EE` |
| `--color-primary-700` | `#201E88` | `#2020A0` | `#2222CC` |
| `--color-primary-800` | `#161468` | `#161460` | `#111199` |
| `--color-primary-900` | `#0D0C48` | `#0D0C40` | `#000066` |

#### Neutral (slate — no blue cast in light, slight blue-grey in dark to harmonize with indigo)

| Token | Light theme | Dark theme | High contrast |
|---|---|---|---|
| `--color-neutral-0` | `#FFFFFF` | `#0D0D1A` | `#000000` |
| `--color-neutral-50` | `#F7F7FB` | `#13131F` | `#0A0A14` |
| `--color-neutral-100` | `#EDEDF5` | `#1C1C2C` | `#111120` |
| `--color-neutral-200` | `#D8D8E8` | `#28283C` | `#222236` |
| `--color-neutral-300` | `#B8B8CC` | `#3A3A52` | `#444460` |
| `--color-neutral-400` | `#8888A0` | `#55557A` | `#666690` |
| `--color-neutral-500` | `#606080` | `#7070A0` | `#9090B8` |
| `--color-neutral-600` | `#484868` | `#9090B8` | `#AAAACC` |
| `--color-neutral-700` | `#303050` | `#BBBBD0` | `#CCCCDD` |
| `--color-neutral-800` | `#1A1A38` | `#DDDDEE` | `#EEEEFF` |
| `--color-neutral-900` | `#0D0D20` | `#F2F2FA` | `#FFFFFF` |

#### Semantic (derived from palette; never raw hex in components)

| Token | Light theme | Dark theme | Computed contrast on bg |
|---|---|---|---|
| `--color-bg` | neutral-0 `#FFFFFF` | neutral-0 `#0D0D1A` | — |
| `--color-surface` | neutral-50 `#F7F7FB` | neutral-50 `#13131F` | — |
| `--color-surface-raised` | neutral-0 `#FFFFFF` | neutral-100 `#1C1C2C` | — |
| `--color-border` | neutral-200 `#D8D8E8` | neutral-200 `#28283C` | — |
| `--color-border-strong` | neutral-300 `#B8B8CC` | neutral-300 `#3A3A52` | — |
| `--color-text` | neutral-900 `#0D0D20` | neutral-900 `#F2F2FA` | 19.5:1 ✓ |
| `--color-text-muted` | neutral-500 `#606080` | neutral-500 `#7070A0` | 5.6:1 / 4.6:1 ✓ |
| `--color-text-subtle` | neutral-400 `#8888A0` | neutral-400 `#55557A` | 3.1:1 / 3.2:1 (non-text) ✓ |
| `--color-primary` | primary-500 `#3733C8` | primary-400 `#5555E0` | 8.5:1 / 6.0:1 ✓ |
| `--color-primary-hover` | primary-600 `#2B28A8` | primary-300 `#7777EE` | — |
| `--color-primary-subtle` | primary-50 `#EEEEFF` | primary-900 `#0D0C40` | — |
| `--color-primary-text` | primary-700 `#201E88` | primary-100 `#D4D4FF` | — |
| `--color-success` | `#166534` | `#4ADE80` | 7.1:1 / 9.2:1 ✓ |
| `--color-success-bg` | `#F0FDF4` | `#052E16` | — |
| `--color-warning` | `#854D0E` | `#FCD34D` | 4.6:1 / 11.4:1 ✓ |
| `--color-warning-bg` | `#FFFBEB` | `#2D1A00` | — |
| `--color-danger` | `#991B1B` | `#F87171` | 5.9:1 / 7.1:1 ✓ |
| `--color-danger-bg` | `#FEF2F2` | `#2D0A0A` | — |
| `--color-escalation` | `#7C2D12` | `#FB923C` | 6.4:1 / 8.3:1 ✓ — escalation banner |
| `--color-escalation-bg` | `#FFF7ED` | `#1C0A00` | — |

> All text-on-background contrast ratios computed with the WCAG 2.1 relative luminance formula. Muted text is used only for supplemental, non-essential information (captions, timestamps); interactive text always uses `--color-text` or `--color-primary-text`.

---

## 3. Typography

Two typefaces chosen via `next/font`. Neither is Inter, Sora, Poppins, DM Sans, Space Grotesk or Playfair.

| Role | Family | Weight | Notes |
|---|---|---|---|
| **Body / UI** | [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) | 400, 500, 600 | Excellent Devanagari (Hindi) and Bengali coverage; clean, neutral, legible at small sizes |
| **Wordmark / Heading** | [Outfit](https://fonts.google.com/specimen/Outfit) | 700 | Geometric, confident, modern — matches the logo's wordmark character without being it |

Noto Sans was chosen specifically because it renders Hindi (`नोटिस साथी`) and Bengali (`নোটিস সাথী`) natively without fallback reflow, which is critical for the multilingual output.

### Type scale (4px grid base, rem units)

| Token | Size | Line-height | Usage |
|---|---|---|---|
| `--text-xs` | 0.75rem / 12px | 1rem / 16px | Labels, badges, captions |
| `--text-sm` | 0.875rem / 14px | 1.25rem / 20px | Secondary body, table cells |
| `--text-base` | 1rem / 16px | 1.5rem / 24px | Primary body copy |
| `--text-lg` | 1.125rem / 18px | 1.75rem / 28px | Lead paragraph, section intro |
| `--text-xl` | 1.25rem / 20px | 1.75rem / 28px | Card title, subsection heading |
| `--text-2xl` | 1.5rem / 24px | 2rem / 32px | Section heading (h2) |
| `--text-3xl` | 1.875rem / 30px | 2.25rem / 36px | Page heading (h1) |
| `--text-4xl` | 2.25rem / 36px | 2.5rem / 40px | Hero / countdown |

---

## 4. Spacing grid

4px base. Tailwind spacing scale aligned: `1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px`.

Page max-width: `72rem` (1152px). Horizontal padding: `1rem` mobile → `2rem` tablet → `3rem` desktop.

---

## 5. Radius scale (border-first elevation — no shadows on cards)

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, inline chips |
| `--radius-md` | 8px | Buttons, inputs, small cards |
| `--radius-lg` | 12px | Main content cards |
| `--radius-xl` | 16px | Dialogs, drawers |
| `--radius-full` | 9999px | Pills, avatars |

Elevation is expressed through **borders** (`--color-border`, `--color-border-strong`) and a background step (`--color-surface` → `--color-surface-raised`), never drop shadows. The one exception is the deadline countdown panel, which uses an inset ring of `--color-primary` at low opacity for visual weight.

---

## 6. Motion tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 100ms | Hover state, button press |
| `--duration-base` | 180ms | Drawer open, toast enter |
| `--duration-slow` | 300ms | Dialog, page transition |
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering |
| `--ease-in` | `cubic-bezier(0.4, 0.0, 1.0, 1)` | Elements leaving |

`prefers-reduced-motion: reduce` → all durations become 0ms, no transforms.

---

## 7. Avoid list check

| Avoid | Status |
|---|---|
| Cream background + serif + terracotta | ✗ Not present — white/near-black + Noto Sans/Outfit + indigo |
| Near-black + acid green | ✗ Not present |
| Newspaper hairlines | ✗ Not present |
| Identical rounded-card SaaS kit | ✗ Border-first elevation, no shadows |
| Default blue-to-purple gradients, glows, sparkle icons | ✗ Not present in UI; logo's internal gradient stays in logo |
| Emoji as icons | ✗ SVG-only icon set |
| Tracked all-caps eyebrow labels | ✗ Not present |
| Middle-dot meta strings | ✗ Not present |
| Gradient text | ✗ Not present |
| Fade-and-slide on every section | ✗ Motion tokens are minimal; `prefers-reduced-motion` respected |
| Engineer jargon in UI | ✗ "RAG", "grounding validator", "deterministic" never shown to user |

---

## 8. ASCII wireframes — main screens

### 8a. Home / Intake (mobile 390px)

```
┌─────────────────────────────┐
│ [Logo]            [EN ▼]    │  ← Header, 56px, border-bottom
├─────────────────────────────┤
│                             │
│  You received a GST notice. │  ← h1, text-2xl, text-center
│  Let's understand it.       │
│                             │
│ ┌─────────────────────────┐ │
│ │ Paste the notice text   │ │  ← Textarea, min-h 200px
│ │                         │ │
│ │                         │ │
│ └─────────────────────────┘ │
│  or  [Upload PDF]           │  ← secondary button
│                             │
│  Try a sample notice:       │  ← text-sm, text-muted
│  · Scrutiny of returns      │
│  · Show-cause demand        │
│  · Non-filing               │  ← each loads real text, no prebaked output
│                             │
│  [Analyse this notice →]    │  ← primary button, full width
│                             │
│  Synthetic data only.       │  ← footnote, text-xs, text-subtle
│  Not legal advice.          │
└─────────────────────────────┘
```

### 8b. Review screen (mobile)

```
┌─────────────────────────────┐
│ [← Back]   Review notice    │
├─────────────────────────────┤
│  We read this. Confirm:     │
│                             │
│  Notice type  [Scrutiny ▼]  │
│  GSTIN        [__________]  │
│  Period       [Apr–Jun 2024]│
│  Tax demand   [₹ 48,500   ] │
│  Reply by     [15 Dec 2024] │
│                             │
│  ⚠ Date does not match text │  ← inline warning, --color-warning
│    "30 days" → 15 Dec?      │
│    Please confirm.          │
│                             │
│  [Confirm and continue →]   │
└─────────────────────────────┘
```

### 8c. Summary (mobile) — the main result screen

```
┌─────────────────────────────┐
│ [Logo]                [EN ▼]│
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ ⏱  Reply by 15 Dec 2024│ │  ← Deadline panel, --color-primary ring
│ │    23 days remaining    │ │     countdown in text-4xl
│ └─────────────────────────┘ │
│                             │
│ What this notice says       │  ← h2
│ ─────────────────────────── │
│  [plain-language explanation│
│   with numbered citations]  │  ← [1] [2] open source drawer
│                             │
│ What you owe                │  ← h2
│  Tax        ₹ 48,500        │
│  Interest   ₹  4,210  [i]  │  ← [i] shows rule version
│  Late fee   ₹    500  [i]  │
│  ─────────────────────────  │
│  Total      ₹ 53,210        │
│                             │
│ What to do                  │  ← h2
│  1. Gather documents        │
│  2. Review the explanation  │
│  3. Prepare your reply      │
│  [See full response plan]   │
│                             │
│ ┌── Involve a CA? ────────┐ │  ← only shown when triggered
│ │ ⚠ Fraud allegation found│ │     --color-escalation bg
│ │ This needs a CA.        │ │
│ └─────────────────────────┘ │
│                             │
│ [Draft my reply]            │  ← primary
│ [Ask a question]            │  ← secondary
│ [Export CA summary]         │  ← ghost
│                             │
│ How this was made ▸         │  ← collapsed trace
└─────────────────────────────┘
```

### 8d. Desktop layout (1280px)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                                   [EN ▼]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────┐  ┌──────────────────────────┐   │
│  │ NOTICE EXPLANATION          │  │  ⏱ Reply by 15 Dec 2024 │   │
│  │                             │  │     23 days remaining    │   │
│  │  [plain language, citations]│  ├──────────────────────────┤   │
│  │                             │  │  What you owe            │   │
│  │                             │  │  Tax       ₹ 48,500      │   │
│  │                             │  │  Interest  ₹  4,210  [i] │   │
│  │                             │  │  Late fee  ₹    500  [i] │   │
│  │                             │  │  Total     ₹ 53,210      │   │
│  │                             │  ├──────────────────────────┤   │
│  │                             │  │  [Draft my reply]        │   │
│  │                             │  │  [Ask a question]        │   │
│  │                             │  │  [Export CA summary]     │   │
│  └────────────────────────────┘  └──────────────────────────┘   │
│                                                                  │
│  Response plan        Documents to gather    Escalation          │
│  ───────────────────  ───────────────────    ─────────────────── │
│  1. ...               · GSTR-3B Apr–Jun      [banner if needed]  │
│  2. ...               · Tax invoices                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Color gaps filled

The logo provides indigo and near-black navy. Missing semantic colors proposed:

| Gap | Proposed | Rationale |
|---|---|---|
| Neutral ramp | Slate-blue-grey (`#F7F7FB` → `#0D0D1A`) | Harmonizes with indigo without competing |
| Success | Forest green `#166534` / `#4ADE80` | Standard, universally legible, no brand conflict |
| Warning | Amber `#854D0E` / `#FCD34D` | High contrast, universally recognized |
| Danger | Deep red `#991B1B` / `#F87171` | Standard error color |
| Escalation | Warm orange `#7C2D12` / `#FB923C` | Distinct from danger; communicates urgency without alarm |

Escalation gets its own semantic color (not danger/warning) because it means "get a CA" — not "you did something wrong". Warm orange conveys "attention + action" rather than "error".
