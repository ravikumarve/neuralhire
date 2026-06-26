# NeuralHire — UX Heuristic Critique

**Target:** `app/index.html` (all surfaces: Live, Mock, History, Setup, Modals)
**Evaluator:** Heuristic evaluation (Nielsen's 10 + product register)
**Date:** 2026-06-26
**Score:** **7.2/10** — Strong foundation, 3 P0 issues, 7 P1 issues, 5 P2 issues

---

## P0 — Must Fix

### 1. Skip-link target `#main-content` resolves to nothing

**Heuristic:** 4 (Consistency & Standards) · **Severity:** P0

The skip link at line 3366-3371 correctly renders and is keyboard-accessible, but targets `#main-content` via `href="#main-content"`. The JS fallback on line 3374-3378 searches for `document.querySelector('main') || document.querySelector('.app-container')`. Neither matches — the app uses `.app-body` and `.panel`, not `main` or `.app-container`. The fallback silently does nothing, so keyboard users tabbing to the skip link get no useful behavior.

**Fix:** Change the fallback to target `document.querySelector('.app-body')` or add `id="main-content"` to the right panel directly.

### 2. History panel blank when empty — no empty state

**Heuristic:** 5 (Error Prevention) · **Severity:** P0

When `history` is `[]`, `#historyList` renders nothing — the entire panel shows a header with "Session History" and a CLEAR button (also invisible via `display:none` on `#clearHistBtn`) but no empty-state message. Users who haven't completed any sessions see a blank white panel. The `.empty-state` class exists in CSS (line 195-197 of index.html, lines 1178-1193 of style.css) but is never used in the History panel.

**Fix:** In `renderHistory()`, if history is empty, show:
```html
<div class="empty-state">
  <div class="eso">📋</div>
  <p>No sessions yet. Start a live interview or try a mock interview to build your history.</p>
</div>
```

### 3. Gradient text in `.score-val` is a readability anti-pattern

**Heuristic:** 8 (Aesthetic & Minimalist Design) · **Severity:** P0

The score values (SESSION, AVG, Relevance, Specificity, STAR etc.) use `background-clip: text` with an amber→rose gradient. This is a structural violation of the impeccable design bans: "Gradient text — background-clip: text combined with a gradient background. Decorative, never meaningful. Use a single solid color." The score numbers carry critical information and should be `var(--amber)` solid.

**Fix:** Replace `background: linear-gradient(...)` / `-webkit-background-clip: text` with `color: var(--amber)`.

---

## P1 — Should Fix

### 4. Timer always rendered on Live panel, even when disabled

**Heuristic:** 8 (Aesthetic & Minimalist Design) · **Severity:** P1

`.timer-display` uses `display: none` by default and `.active` to show. But it's always present in the DOM, occupying layout space when hidden. The Setup panel has a toggle for Pressure Mode, but toggling it off doesn't remove the timer from the Live panel — it just stays hidden. Worse, the timer interval still runs in the background.

**Fix:** Use JS to not render the timer block at all when disabled in settings, or properly check `settings.timerEnabled` before showing.

### 5. Provider → Model cascade broken

**Heuristic:** 3 (User Control & Freedom) · **Severity:** P1

The Setup panel has a Provider dropdown and a Model dropdown. When a user switches from Groq to OpenAI, the model list still shows Groq models (`llama-3.3-70b-versatile`, `mixtral-8x7b-32768` etc.). The model select never repopulates based on the selected provider. A user who selects "OpenAI" but keeps "Llama 3.3 70B" will get an API error.

**Fix:** Add an `onchange` handler on `#providerSelect` that repopulates `#modelSelect` with that provider's models.

### 6. Stealth Mode has no UI toggle — only keyboard shortcut

**Heuristic:** 6 (Recognition vs Recall) · **Severity:** P1

Stealth Mode is toggled exclusively via `Ctrl+Shift+D`. No button, no toggle switch, no menu item. The stealth indicator badge only appears once the mode is active. A user who doesn't know the shortcut will never discover this feature exists.

**Fix:** Add a toggle button in Setup panel (where other preferences live) alongside the keyboard shortcut:
```html
<div class="tts-row">
  <div><div class="label-title">Stealth Mode</div><div class="label-desc">Low-contrast for video calls</div></div>
  <label class="toggle">
    <input type="checkbox" id="stealthToggle" onchange="toggleStealthMode()">
    <div class="toggle-track"></div>
    <div class="toggle-thumb"></div>
  </label>
</div>
```

### 7. Mock panel VOICE button has no browser-support feedback

**Heuristic:** 1 (Visibility of System Status) · **Severity:** P1

The VOICE button in Mock panel (line 477) calls `toggleMockListen()` but has no status indicator showing whether the browser supports the Web Speech API. On Firefox or Safari iOS, tapping VOICE silently does nothing.

**Fix:** On init, check `'webkitSpeechRecognition' in window || 'SpeechRecognition' in window`. If unsupported, disable the VOICE button and show a tooltip: "Voice input requires Chrome".

### 8. Footer stat padding inconsistent on 480px breakpoint

**Heuristic:** 4 (Consistency & Standards) · **Severity:** P1

At 480px, `.footer-actions` becomes `flex-direction: column` with full-width buttons. But the EXPORT and NEXT buttons have different padding (.btn-ghost vs .btn-primary), causing them to appear at different heights. The stacking is functional but visually misaligned.

**Fix:** Ensure both footer buttons have consistent height/alignment in the stacked layout.

### 9. Zoom disabled via `maximum-scale=1.0`

**Heuristic:** 4 (Consistency & Standards / WCAG 1.4.4) · **Severity:** P1

The viewport meta tag sets `maximum-scale=1.0`, which disables pinch-zoom on mobile. This is a WCAG 1.4.4 violation (Resize Text). Users with low vision cannot zoom the interface.

**Fix:** Change to `maximum-scale=5.0` or remove the max-scale entirely.

### 10. Version inconsistency: footer says "v4.0", manifest says "v6.0.0"

**Heuristic:** 4 (Consistency & Standards) · **Severity:** P1

The Setup panel footer reads "NeuralHire v4.0 · All data local" (line 626) but `manifest.json` declares `"version": "6.0.0"`. The GitHub release tags also reference v6.

**Fix:** Update to "NeuralHire v6.0 · All data local".

---

## P2 — Nice to Have

### 11. No answer loading skeleton

**Heuristic:** 1 (Visibility of System Status) · **Severity:** P2

When an answer is generating, the status line updates but the answer area doesn't show a skeleton or shimmer state. The transition from empty to full answer is sudden.

**Fix:** Show a shimmer skeleton in the answer section during the `THINKING...` state.

### 12. Premium modals not focus-trapped

**Heuristic:** 3 (User Control & Freedom) · **Severity:** P2

When a premium modal opens (e.g., `showPremiumPrompt`), focus is not trapped inside the modal. Tab navigation can reach elements behind the overlay. The global Escape handler does close it, but keyboard users can Tab out of the modal into hidden elements.

**Fix:** Add focus trapping to dynamically created modals (first element → last element Tab cycle).

### 13. Error boundary is full-screen and dramatic

**Heuristic:** 9 (Help Users Recognize, Diagnose, and Recover) · **Severity:** P2

The error boundary (`showErrorBoundary`) covers the full screen with a dark overlay, which is appropriate for catastrophic errors but also fires for minor recoverable issues like a single API call failure. The error boundary also uses inline `style.cssText` with hardcoded values instead of CSS variables or classes.

**Fix:** Distinguish between fatal errors (full overlay) and non-fatal errors (toast notification). Use CSS classes instead of inline styles.

### 14. No "skip intro" on onboarding tour

**Heuristic:** 3 (User Control & Freedom) · **Severity:** P2

The onboarding tour (if implemented) should have a "Skip tour" button. Not confirmed whether this exists — checking the code, the onboarding tour is mentioned in the AGENTS.md but I don't see it in the current JS.

**Fix:** Ensure onboarding has a visible "Skip" or "Close" affordance in the first step.

### 15. History items don't show question preview

**Heuristic:** 6 (Recognition vs Recall) · **Severity:** P2

Each history item shows the full question text, but long questions are truncated by browser default (no `max-height` or `line-clamp`). Adding a 2-line clamp with "..." would make the list scannable.

---

## Global Assessment

| Heuristic | Score | Notes |
|-----------|-------|-------|
| 1. Visibility of system status | 7/10 | Mic state good, but timer always running, no skeleton states |
| 2. Match to real world | 9/10 | Interview terminology is natural and accurate |
| 3. User control & freedom | 6/10 | No escape on premium modals, no stealth UI, no model cascade |
| 4. Consistency & standards | 7/10 | Version inconsistency, zoom disabled, skip link broken |
| 5. Error prevention | 8/10 | Good retry/backoff, but provider/model mismatch allowed |
| 6. Recognition vs recall | 7/10 | Stealth Mode undiscoverable, history lacks previews |
| 7. Flexibility & efficiency | 8/10 | Keyboard nav is excellent; could add more shortcuts |
| 8. Aesthetic & minimalist | 8/10 | Clean dark UI; gradient text is the main offender |
| 9. Error recovery | 7/10 | Error boundary exists but too aggressive |
| 10. Help & documentation | 6/10 | Onboarding exists but no tooltip hints on complex features |

**Overall: 7.2/10** — Production-capable with known issues. Fixing the 3 P0 items and the top 3 P1 items would bring this to 8.5+/10.

---

## Scoring Rubric

- **P0:** Blocks user task or causes data loss. Ship-blocking.
- **P1:** Impairs task completion but has a workaround.
- **P2:** Friction, cosmetic, or enhancement surface.
