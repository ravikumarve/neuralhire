# NeuralHire — Product Context

## Identity

**NeuralHire** is an AI-powered interview copilot — a PWA that lives on your phone during live interviews, listens to questions via the microphone, and generates role-specific, experience-grounded answers in real time. It is not a study tool; it is an **in-the-moment performance amplifier**.

## Scene

A software engineer is on a video call for a Senior Frontend interview at Google. Their phone sits beside the laptop, NeuralHire open in a browser tab. The interviewer asks: *"Explain how React reconciliation works."* The candidate taps the microphone button, reads the question aloud (or the interviewer's voice is picked up), and within 2 seconds a structured answer appears on the phone screen. The candidate paraphrases it naturally. The interviewer sees confidence and precision. No one sees the phone.

**Scene sentence:** *A job seeker mid-interview, needing a real-time cognitive co-pilot that eliminates blank-moment panic and delivers expert-caliber responses without detection.*

This scene forces the answer: **dark mode, always**. The user is on a video call; bright UIs reflect in glasses, draw attention, and look unprofessional. Every pixel serves utility under low ambient light.

## Register

**Product UI** — this is a dashboard/tool where design serves function. NeuralHire is not a marketing site where design IS the product; it is a utility where every visual decision must optimize for:
- **Glanceability** — the user reads the answer in a split second during a live conversation
- **Discretion** — the UI must not be detectable on a phone screen in a video-call setting
- **Reliability** — the app must feel solid, never fragile, because the stakes are real

## Audience

| Persona | % of Users | Need | Monetization |
|---------|-----------|------|-------------|
| Active job seeker (engineer, PM, data scientist) | 80% | Real-time answers during interviews | Free tier + Pro $29 |
| Career coach | 10% | Multi-client prep, PDF reports | Ultimate $49 |
| Enterprise / bootcamp | 5% | White-label for students | SaaS $149 |
| Freemium user (exploring) | 5% | Evaluate before buying | Free $0 |

## Monetization Structure

| Tier | Price | Key unlocks | Distribution |
|------|-------|-------------|-------------|
| Free | $0 | Voice sessions, mock interviews, 5 providers, history | Gumroad (free launch) |
| Pro | $29 | Stealth Mode, Panic Mode, source code, commercial license | Gumroad |
| Ultimate | $49 | 500+ prompts, company guides, resume optimizer | Gumroad |
| SaaS | $149 | White-label, rebrand, 1hr consultation | Gumroad |
| Add-on | $2.99 | PDF Export standalone | Gumroad |

All tiers are **one-time purchases, no subscriptions**. License keys stored in localStorage.

## Brand Attributes

- **Confidence** — the user must feel prepared, not exposed
- **Discretion** — Stealth Mode is not a gimmick; it's a core trust signal
- **Speed** — sub-second response is the functional brand
- **Dark** — the UI lives in video-call shadows; light is a liability
- **Warm-amber accent** — approachable, energetic, human. Not cold blue like "enterprise AI"

## Design Principles

1. **Dark-first, no light mode.** The app is never viewed in direct sunlight or bright rooms. Optimization for low-light, focused use.
2. **Content hierarchy over decoration.** No illustrations, no decorative gradients on surfaces. Information is the ornament.
3. **Motion with purpose.** Animations communicate state changes (question received → answer generating → answer ready). No decorative parallax or wandering floats.
4. **Accessibility is not optional.** WCAG AA contrast minimums. Keyboard-navigable. Screen-reader compatible. This is used by people under stress; cognitive load must be minimized.
5. **Responsive by constraint.** The primary form factor is a phone in portrait orientation held beside a laptop. Layout must be legible at 375px width without horizontal scroll.
6. **Privacy as a feature.** All data stays in localStorage. No accounts, no backend, no telemetry. The PWA must work fully offline after initial load (app shell cached).

## Key Surfaces

| Surface | Purpose | Priority |
|---------|---------|----------|
| Live panel | Voice capture, real-time answer display | P0 |
| Mock panel | Role/difficulty selection, practice questions | P0 |
| History panel | Past sessions, scores, export | P1 |
| Setup panel | API keys, provider selection, preferences | P0 |
| Answer score feedback | Per-answer quality + improvement tips | P1 |
| Stealth Mode toggle | Low-contrast theme for video calls | P1 |
| Premium/license modal | Gumroad unlock flow | P1 |
| Onboarding tour | First-run feature discovery | P2 |
| PDF Export | Session report generation | P2 |
