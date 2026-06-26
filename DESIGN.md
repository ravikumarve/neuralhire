# NeuralHire — Design System

## Color Strategy

**Restrained palette** — tinted neutrals with a warm amber+rose accent carrying ≤10% of surface area. The UI is dark-first; no light mode exists or is planned.

### Surface & Background

| Token | Value | Role | Contrast Ratio |
|-------|-------|------|---------------|
| `--bg` | `#0c0906` | Page background (near-black warm) | — |
| `--surface` | `#111009` | Header, footer, card surfaces | — |
| `--panel` | `rgba(255,255,255,0.02)` | Nested panel backgrounds | — |
| `--border` | `rgba(255,255,255,0.12)` | All borders and dividers | — |

### Brand Accent

| Token | Value | Role |
|-------|-------|------|
| `--amber` | `#fb923c` | Primary accent, active states, highlights |
| `--amber-dim` | `rgba(251,146,60,0.15)` | Hover bg, selection bg, muted accent |
| `--amber-glow` | `rgba(251,146,60,0.4)` | Button shadows, glow effects |
| `--rose` | `#ef4444` | Secondary accent, errors, warnings |
| `--rose-dim` | `rgba(239,68,68,0.12)` | Error bg, warning bg |
| `--rose-glow` | `rgba(239,68,68,0.3)` | Error glow |

### Text

| Token | Value | Role | WCAG AA |
|-------|-------|------|---------|
| `--text` | `#fafaf9` | Primary body text | 16.9:1 on `--bg` |
| `--text-muted` | `#a8a29e` | Secondary text, meta | 7.9:1 on `--bg` |
| `--text-dim` | `#78716c` | Placeholder, labels, stats | 5.3:1 on `--bg` |

### Semantic

| Token | Value | Role |
|-------|-------|------|
| `--success` | `#22c55e` | Positive scores, live indicator |
| `--success-dim` | `rgba(34,197,94,0.15)` | Success bg |

### Stealth Mode (Pro Feature)

The stealth theme mutes every color by ~40% luminance for undetectability on video calls. Applied via `.stealth-mode` class on root.

| Token | Normal → Stealth | Delta |
|-------|-----------------|-------|
| `--bg` | `#0c0906` → `#0a0a0a` | Near-identical |
| `--surface` | `#111009` → `#121212` | Cooler |
| `--border` | `rgba(255,255,255,0.12)` → `rgba(255,255,255,0.04)` | 3× subtler |
| `--amber` | `#fb923c` → `#cc7a00` | -30% lightness |
| `--rose` | `#ef4444` → `#991b1b` | -40% lightness |
| `--text` | `#fafaf9` → `#d4d4d4` | -15% lightness |
| `--text-muted` | `#a8a29e` → `#737373` | -20% lightness |

Stealth also disables animations (pulse-dot, recording glow) and removes background gradients for zero screen shimmer.

---

## Typography

### Font Stack

| Role | Family | Weights | Fallback |
|------|--------|---------|----------|
| Headings & UI | `Outfit` | 300, 400, 500, 600, 700 | `sans-serif` |
| Code & labels | `Space Mono` | 400, 700 | `monospace` |

### Type Scale (app UI)

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Brand | `1.375rem` / 22px | 700 | — | — |
| Question text | `1rem` / 16px | 400 | 1.7 | — |
| Answer text | `0.9375rem` / 15px | 400 | 1.8 | — |
| Modal title | `1.125rem` / 18px | 600 | — | — |
| Section title | `1rem` / 16px | 600 | — | — |
| Body / card text | `0.875rem` / 14px | 400 | 1.7 | — |
| Button text | `1rem` / 16px | 600 | — | `0.25px` |
| Label | `0.75rem` / 12px | 500 | — | `0.25px` |
| Mono label | `0.75rem` / 12px | 400 | — | `0.5px` |
| Micro label | `0.5625rem` / 9px | 400 | — | `0.5–1px` |
| Stat value | `1.5rem` / 24px | 700 | 1 | — |

### Type Scale (landing page)

| Element | Size | Weight | Letter Spacing |
|---------|------|--------|----------------|
| Hero H1 | `clamp(2.5rem, 7vw, 5.5rem)` | 800 | `-1.5px` |
| Section H2 | `clamp(1.75rem, 4vw, 2.75rem)` | 700 | `-0.5px` |
| Feature title | `1.0625rem` | 600 | — |
| Body text | `1rem` | 400 | — |
| Section tag | `0.5625rem` | 400 | `1.5px` uppercase |

### Rules
- Mono font for: ALL labels, stat keys, badges, timestamps, code fragments, footer stats
- Body text never below `16px` (WCAG AA minimum)
- Landing hero H1 uses `clamp()` with upper bound of `5.5rem` (88px) — below the 6rem ceiling
- Mono text faces use uppercase + tracking for hierarchy (but **no** eyebrow kicker on every section — only the Features/How it works/Pricing tags)

---

## Spacing

| Context | Value | Notes |
|---------|-------|-------|
| Page padding | `1.25rem` | Right panel gutters |
| Section gap | `1rem` | Between major blocks |
| Card padding | `1rem` | Inner card gutter |
| Left panel | `180px` | Desktop sidebar |
| Header height | `~3.25rem` | Padding `.75rem 1.25rem` |
| Footer height | `~2.5rem` | Padding `.625rem 1.25rem` |
| Button padding | `.875rem 1.25rem` | Large CTA buttons |
| Micro spacing | `.375rem`, `.5rem` | Gaps between chips, tags |

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| Mobile S | 380px | Smaller mic, full-width buttons |
| Mobile | 480px | Stack layout, vertical sidebar |
| Tablet | 600px | Narrowed sidebar, smaller stats |
| Desktop | >600px | Full side-by-side layout |

---

## Borders & Radii

| Token | Value | Used On |
|-------|-------|---------|
| `--radius-sm` | `8px` | Buttons, inputs, score cards, timer |
| `--radius-md` | `12px` | Cards, sections, modals |
| `--radius-lg` | `16px` | Modal top corners |
| Rounded pill | `100px` | Tabs, chips, badges, toggles |
| Border weight | `1px` | All borders (`solid`) |

---

## Motion

### Timing
- `--transition`: `0.2s cubic-bezier(0.4, 0, 0.2, 1)` — ease-out-quad. Used everywhere.
- Slide-up: `0.4s ease`
- Fade in: `0.3s ease`
- Progress bar: `0.5s ease`
- Score fill: `0.6s ease`
- Toast: `0.4s ease` (slide + fade)
- Mic glow (normal): `1s ease-in-out infinite`

### Keyframes
| Name | Purpose |
|------|---------|
| `pulse-dot` | Live recording indicator, wake-lock |
| `fadeIn` | Panels, toasts, elements appearing |
| `slideUp` | Content revealing (answers, modals) |
| `score-pop` | Score cards entering |
| `spin` | Loading spinner |
| `panic-flash` | Panic mode mic activation (0.6s) |

### Reduced Motion
All animations wrap via `@media (prefers-reduced-motion: reduce)` — transitions are disabled. Stealth mode also disables animations by default (opacity-only state changes).

### Contrast with Landing Page
Landing page uses `float` (3s), `pulse` (2s), `fadeUp` (0.6s), and `shimmer` (4s) — more decorative motion. The app itself avoids decorative motion.

---

## Component Patterns

### Tabs / Navigation
- Pill-style tabs (`nav-pill`) with amber active state
- `switchTab()` JS function toggles `.active` class
- 4 panels: Live, Mock, History, Setup
- Bottom sheet: tab bar on mobile

### Buttons
| Variant | Background | Hover |
|---------|-----------|-------|
| `.btn-primary` | Amber→Rose gradient | TranslateY(-1px), glow |
| `.btn-ghost` | Transparent + border | Amber border + text |
| `.btn-icon` | Panel bg + border | Amber border + text |

### Modals
- Bottom-sheet style on mobile (`align-items: flex-end`)
- Full `fadeIn` overlay + `slideUp` panel
- Amber gradient top border
- Handle bar for drag affordance
- `z-index: 200` — above everything except toasts (500)

### Toggle (`toggle-*`)
- 44×24px track with 18×18px thumb
- Amber glow on active
- Used for TTS, Stealth Mode toggle

### Timer
- SVG ring countdown (stroke-dashoffset animation)
- Amber → Rose warning at low time
- 48×48px ring

### Score Display
- 3-column score grid with staggered `score-pop` animation (0s, 0.1s, 0.2s delays)
- Color-coded: high (green), mid (amber), low (rose)
- Progress bar below each score

### Chips
- Rounded pill `.chip` with amber active state
- Used for role, difficulty, and answer mode selection

### History Items
- Card layout with hover translateX(4px) feedback
- Amber left-border accent for scored items
- Score badges: excellent (green), good/average (amber), poor (rose)

### Empty State
- Large icon (`3rem`, 30% opacity)
- Centered text in `--text-dim`
- Used when no history, no PDF uploaded

### Inputs
- Dark bg (`rgba(255,255,255,0.03)`) with `--border` outline
- `--amber-dim` focus ring
- Placeholder in `--text-dim`
- Select has custom pill styling

---

## Z-Index Scale

| Layer | Value | Elements |
|-------|-------|----------|
| Base | 0 | Content |
| Sticky header | 50 | Header bar |
| Modal backdrop | 200 | Premium/license modals |
| Toast | 500 | Notifications |

No arbitrary values (999, 9999). Only semantic tiers.

---

## Accessibility

### Focus States
- Comprehensive `:focus-visible` with 2px amber outline + 4px amber glow
- `:focus:not(:focus-visible)` removes outline for mouse users
- `.keyboard-nav-active` class provides 3px+6px glow when keyboard detected
- Skip link at top of page for keyboard users
- ARIA attributes on all interactive elements (`aria-selected`, `aria-controls`, `aria-label`, `aria-pressed`, `aria-live`)

### Color Contrast
- Body text: 16.9:1 on bg (exceeds 4.5:1 AA)
- Muted text: 7.9:1 on bg (exceeds 3:1 AA for large text)
- Dim text: 5.3:1 on bg (exceeds 4.5:1 AA — no placeholder exemption)

### Screen Reader
- `.sr-only` class for screen-reader-only content
- Live region (`aria-live="polite"`) on answer section
- Proper heading hierarchy (h1-h3)
- Role attributes on tablist, tabs, panels

---

## Known Code Issues

1. **CSS Duplication** — `app/index.html` has ~200 lines of inline CSS in `<style>` that duplicate rules from `app/style.css`. The inline block should be removed in favor of the external stylesheet.
2. **Dead SW Reference** — `sw.js` cache list includes `./app/app.js` which does not exist. Should be removed from `urlsToCache`.
3. **Font Size Inconsistency** — `app/index.html` sets `body font-size: 14px` inline but `style.css` sets `16px`. The 16px (external) is correct for WCAG.
4. **Inline Layout CSS** — Much of the app's layout CSS is duplicated between the inline `<style>` and `style.css`. The inline block was likely created during extraction to avoid breaking changes.
5. **Landing Page Duplicates** — Landing `index.html` has its own CSS variables (similar but not identical to app's `:root`). Not necessarily an issue (different context), but `--text-dim` differs (`#57534e` on landing vs `#78716c` in app).

---

## File Architecture

```
neuralhire/
├── index.html           # Landing / marketing page (644 lines, inline CSS only)
├── PRODUCT.md            # This file
├── DESIGN.md             # This file
└── app/
    ├── index.html        # Main app (3,406 lines — JS inline, CSS partially duplicate)
    ├── style.css         # Design system + all app styles (2,086 lines)
    ├── manifest.json     # PWA manifest (v6.0.0)
    └── sw.js             # Service Worker (has dead app.js ref)
```
