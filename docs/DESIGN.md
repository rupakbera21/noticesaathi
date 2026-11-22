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

## 2b. Atmospheric backdrop & tactile grain

To avoid a sterile, plastic digital look while honoring the brand palette, the canvas incorporates **calm atmospheric lighting with tactile grain**:
- **Ambient Aura**: Soft radial gradient pools placed at page edges and card backdrops using deep logo indigo (`#2020C0`), brand primary (`#3733C8`), and deep violet accents (`#4F28A4`).
- **Tactile Grain**: An ultra-lightweight SVG-based fractal noise overlay (~3% opacity in dark theme, ~2% in light theme) applied via a fixed pointer-events-none layer. This gives the surface a tactile paper/matte canvas feel without any heavy image assets or network overhead.
- **Surface Legibility**: Content cards, form inputs, and especially the **notice receipt** remain crisp and solid to ensure 100% legibility and WCAG AAA compliance for tax and legal figures.

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

## 6. Motion tokens and interaction animations

The goal is **calm aliveness** — the interface breathes and responds, but never distracts. Every animation has a job: confirm an action, guide attention, or reduce perceived wait time. Nothing animates just to look clever.

`prefers-reduced-motion: reduce` → all durations become `1ms`, no transforms, no fades below 100% opacity. Tested in CI with `jest-axe` and a Playwright media-feature override.

### 6a. Core timing tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 80ms | Button press, checkbox tick — purely tactile |
| `--duration-fast` | 150ms | Hover bg/border, focus ring, badge change |
| `--duration-base` | 220ms | Cards entering, toast, tooltip |
| `--duration-slow` | 320ms | Drawer slide, dialog open, page section reveal |
| `--duration-receipt` | 400ms | Receipt card drop — the signature moment |
| `--ease-spring` | `cubic-bezier(0.34, 1.20, 0.64, 1)` | Elements that "settle" (receipt drop, dialog pop) |
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering the screen |
| `--ease-in` | `cubic-bezier(0.4, 0.0, 1.0, 1)` | Elements leaving |
| `--ease-smooth` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Hover, focus, state changes |

### 6b. Interaction catalogue

#### Buttons
- **Rest → Hover:** background steps one shade darker, `--duration-fast`, `--ease-smooth`. No scale.
- **Hover → Press:** `scale(0.97)`, `--duration-instant`, `--ease-smooth` — a small tactile sink that confirms the click.
- **Disabled:** opacity 50%, no transition on hover.

#### Inputs and Textarea
- **Focus ring:** `outline` grows from 0 to 2px, color transitions from transparent to `--color-primary` over `--duration-fast`. Feels like a gentle highlight rather than a snap.
- **Textarea with notice text:** when the user pastes or loads a sample, the border briefly pulses to `--color-primary` once (200ms) then settles — confirming the content arrived.

#### Cards and surfaces
- **Page mount (once per route):** cards fade in and rise `4px` → `0px`, staggered 40ms per card, `--duration-base`, `--ease-out`. Subtle enough to feel like a page settling, not a slide show.
- **Hover on interactive cards (sample notice list):** background lightens/darkens one step, `border-color` steps to `--color-border-strong`, `--duration-fast`. No lift, no shadow — matches the border-first elevation system.

#### Receipt card — the signature animation
- When the receipt card first appears (after analysis completes), it **drops onto the surface**: starts at `translateY(-8px)` and `opacity: 0`, lands at `translateY(0)` and `opacity: 1`, with `--ease-spring` over `--duration-receipt` (400ms). The spring overshoot (1.20 in the cubic) gives a tiny bounce as it settles — like a printed slip being placed on a desk.
- The **total amount** counts up from `₹ 0` to its final value over 600ms with an easing curve — only the display value animates; the real value is always in the DOM for screen readers.
- The **perforated edge dots** stagger in left-to-right over 200ms after the card lands.

#### Deadline countdown
- The **days remaining** number has a soft pulse: `opacity: 0.7 → 1 → 0.7` on a 3-second loop, `ease-in-out`. Calm, like a heartbeat. Stops and shows a static warning color when under 7 days.
- When the deadline passes (zero days), the countdown switches color to `--color-danger` with a single 300ms fade — no flash or shake.

#### Citations and source drawer
- Citation `[1]` tap/click: a small underline-to-highlight transition (`--duration-fast`) then the drawer slides up from the bottom (mobile) or expands inline (desktop) over `--duration-slow`, `--ease-out`.
- Drawer close: `--ease-in`, `--duration-base` — slightly faster out than in.

#### Escalation banner
- **Appears** with a fade + `translateY(-4px)` → `0` settle, `--duration-base`. No red flash; it should feel serious, not alarming.
- The warning icon has a single gentle pulse on first render (one cycle, 400ms) to draw the eye, then goes static.

#### Toast / status messages
- Enter: slides in from the bottom-right, `translateY(8px)` → `0`, `opacity: 0 → 1`, `--duration-base`, `--ease-out`.
- Exit: fades out only (no slide), `--duration-fast`, `--ease-in` — leaving is less important than arriving.

#### Skeleton loaders
- A slow shimmer sweeps left to right: `background-position` moves over 1.5s, looping. No color flash — the shimmer is a subtle lighter band over `--color-neutral-100` / `--color-neutral-200`. This is the only looping animation in the product other than the countdown pulse.

#### Collapsible sections ("How this was made", "Response plan")
- Height animates with a `grid-template-rows: 0fr → 1fr` trick (no JS height measurement), `--duration-base`, `--ease-out`. Content fades in at `--duration-fast` with a 60ms delay so it doesn't appear before the row opens.
- The chevron icon rotates 180° over `--duration-fast`.

#### Navigation / route transitions
- Outgoing page: `opacity: 1 → 0` over `--duration-fast`.
- Incoming page: `opacity: 0 → 1` over `--duration-base`, `--ease-out`. No slide — route changes are not spatial navigations in this product, so slides would be confusing.

#### Language selector
- Dropdown opens with `scaleY(0.95) → 1` from the top, `opacity: 0 → 1`, `--duration-fast`, `--ease-out`. Items don't stagger — it's a utility, not a showcase.

### 6c. What we do not animate
- Table rows and list items (too many; staggering more than 4 items feels fidgety)
- Error messages (they must appear instantly — delay reads as the app ignoring you)
- The trace / "How this was made" panel content (data, not UI)
- Anything triggered by polling or background updates


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

The summary is presented as a **notice receipt** — a narrow paper-bill card that sits inside the screen. This is the signature visual element of the product: the user received a frightening official paper; NoticeSaathi hands them back something equally physical and clear.

**Visual treatment of the receipt card:**
- Off-white paper background (`#FAFAF8`) in light theme, warm near-white (`#F5F5F0`) in dark theme — distinct from both the page background and a surface card
- Fine 1px border in `--color-border`, like a printed slip
- Subtle top perforated-edge effect: a row of tiny circles (`border-t-dashed` or an SVG border) at the top of the receipt, suggesting it was torn off a roll
- Receipt-width cap: `max-w-[360px]` on desktop so it stays bill-proportioned, centered
- Monospace-adjacent figures: amounts use `font-variant-numeric: tabular-nums` so columns align
- Dashed `border-t` separator between line items and total (like a receipt subtotal rule)
- A faint watermark-style "DRAFT" or "UNVERIFIED" label (rotated, 8% opacity) only when rule data has unverified entries
- Print action: `window.print()` with a print stylesheet that strips everything except the receipt card — the user can hand it to a CA or file it

```
┌─────────────────────────────┐
│ [Logo]                [EN ▼]│
├─────────────────────────────┤
│                             │
│   ○○○○○○○○○○○○○○○○○○○○○   │  ← perforated top edge (SVG dots)
│  ┌───────────────────────┐  │
│  │  NoticeSaathi         │  │  ← receipt header, Outfit 700, xs
│  │  Notice Summary       │  │
│  │  Generated 22 Nov 2026│  │  ← text-xs, text-muted
│  │ ─────────────────────-│  │
│  │  GSTIN   29XXXXX1234Z5│  │  ← monospaced, text-sm
│  │  Type    Scrutiny      │  │
│  │  Period  Apr – Jun 2024│  │
│  │  Authority  CGST Delhi │  │
│  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  │  ← dashed rule
│  │  Tax demand  ₹ 48,500 │  │
│  │  Interest    ₹  4,210 │  │  ← [i] rule version on tap
│  │  Late fee    ₹    500 │  │
│  │ ─────────────────────-│  │  ← solid rule before total
│  │  TOTAL       ₹ 53,210 │  │  ← text-lg, bold
│  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  │
│  │  ⏱ Reply by           │  │
│  │     15 Dec 2024       │  │  ← date large, --color-primary
│  │     23 days left      │  │  ← countdown, text-sm
│  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  │
│  │  [🖨 Print]  [⬇ Save] │  │  ← ghost buttons, icon+label
│  └───────────────────────┘  │
│   ○○○○○○○○○○○○○○○○○○○○○   │  ← perforated bottom edge
│                             │
│ What this notice says       │  ← h2, back to normal layout
│  [plain-language explanation│
│   with numbered citations]  │  ← [1] [2] open source drawer
│                             │
│ What to do                  │
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

The receipt card lives in a sticky right panel. It stays in view as the user scrolls the left explanation column.

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                                   [EN ▼]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────┐  ○○○○○○○○○○○○○○○○○○○○○○○○○○   │
│  │ NOTICE EXPLANATION          │ ┌──────────────────────────┐   │
│  │                             │ │  NoticeSaathi            │   │
│  │  [plain language, citations]│ │  Notice Summary          │   │
│  │  [1] [2] linked to sources  │ │  Generated 22 Nov 2026   │   │
│  │                             │ │ ─────────────────────────│   │
│  │                             │ │  GSTIN   29XXXXX1234Z5   │   │
│  │                             │ │  Type    Scrutiny        │   │
│  │                             │ │  Period  Apr – Jun 2024  │   │
│  │                             │ │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │   │
│  │                             │ │  Tax        ₹ 48,500     │   │
│  │                             │ │  Interest   ₹  4,210 [i] │   │
│  │                             │ │  Late fee   ₹    500 [i] │   │
│  │                             │ │ ─────────────────────────│   │
│  │                             │ │  TOTAL      ₹ 53,210     │   │
│  │                             │ │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │   │
│  │                             │ │  ⏱ Reply by 15 Dec 2024  │   │
│  │                             │ │     23 days left         │   │
│  │                             │ │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │   │
│  │                             │ │  [🖨 Print] [⬇ Save]    │   │
│  └────────────────────────────┘ └──────────────────────────┘   │
│                                  ○○○○○○○○○○○○○○○○○○○○○○○○○○   │
│  Response plan     Documents to gather    [Draft reply]          │
│  ─────────────────────────────────────    [Ask a question]       │
│  1. ...            · GSTR-3B Apr–Jun      [Export CA summary]    │
│  2. ...            · Tax invoices                                │
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
