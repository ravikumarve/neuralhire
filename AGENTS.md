# NeuralHire Agent Guidelines

## Project Overview

NeuralHire is a vanilla HTML/CSS/JS PWA for AI-powered interview assistance.
Live at: **https://ravikumarve.github.io/neuralhire/**

Core dependencies:
- **Multi-Provider AI** — Groq, OpenAI, Anthropic, Gemini, Ollama
- **Web Speech API** — voice recognition (Chrome/Edge only)
- **PDF.js** — resume parsing (text-layer PDFs only)

## Project Structure

```
neuralhire/
├── index.html          # Landing page
├── README.md
├── AGENTS.md           # This file
└── app/
    ├── index.html      # Main PWA app (all-in-one HTML/CSS/JS)
    ├── manifest.json   # PWA manifest
    └── sw.js           # Service Worker (cache-first strategy)
```

## Known Limitations

- **Web Speech API** — only works on Chrome desktop and Chrome Android.
  Not supported on Firefox, Safari iOS 16 and below, or any browser
  in private/incognito mode.
- **PDF.js** — requires a text-layer PDF. Scanned or image-only PDFs
  will extract empty text. Warn the user if extracted text is blank.
  Max 8 pages parsed; no Web Worker (runs on main thread).
- **Provider rate limits** — Each provider has different limits:
  - Groq: 30 requests/minute, 6000 tokens/minute free tier
  - OpenAI/Anthropic/Gemini: Follow their respective pricing and limits
  Handle 429 errors gracefully with user-visible messages for all providers.
- **localStorage** — cleared by browser in private mode and on iOS
  Safari when "Prevent Cross-Site Tracking" is on. Never assume data
  will persist; always check before reading. Storage cap ~5-10MB
  depending on browser.
- **No offline API calls** — only app shell is cached. API requests
  require internet; show clear offline state to user.
- **Screen timeout** — mobile devices may sleep during use, killing
  voice capture. Warn user to keep screen awake if possible.
- **Background apps** — voice recognition stops when app backgrounds.
  No way to resume automatically.
- **PWA install** — not supported on all browsers (iOS Safari limited).
- **No analytics** — no way to track errors, crashes, or usage patterns.
- **API key in localStorage** — low risk for local-only app, but not
  ideal. Avoid logging or exposing the key.
- **Single-file architecture** — no module system or build tools.
  All code in one HTML file; extracting JS requires refactoring.

## Build / Lint / Test Commands

This is a no-build-tool project. There is no bundler, transpiler, or
package.json. All code runs directly in the browser.

### Local Development

```bash
# Option A — Python (no install needed)
cd app && python -m http.server 8001
# then open http://localhost:8001

# Option B — Node serve
npx serve app
```

Open `index.html` (landing) at the project root with a separate server
on port 8000 if needed:
```bash
python -m http.server 8000   # from project root
```

### Linting

No linter is configured. If adding one, extract JS into a `.js` file
first — ESLint cannot lint inline `<script>` blocks inside HTML directly.

```bash
# After extracting JS to app/app.js:
npx eslint app/app.js

# CSS (if extracted to app/style.css):
npx stylelint app/style.css
```

Do NOT run `npx eslint app/index.html` — it will error on the HTML.

### Testing

No automated test suite. Use this manual checklist before every commit:

- [ ] App loads on Chrome desktop (primary platform)
- [ ] App loads on Chrome Android (voice features)
- [ ] App loads on Safari iOS (expect voice to be disabled gracefully)
- [ ] PDF upload extracts visible text (use a real text-layer PDF)
- [ ] API call to Groq succeeds with a valid key
- [ ] 429 rate-limit error shows a friendly toast, not a crash
- [ ] localStorage persists across page refresh
- [ ] Service worker caches app shell (check DevTools → Application → SW)
- [ ] PWA installs correctly on Android Chrome
- [ ] No console errors on load or during normal use
- [ ] Responsive layout on 375px (iPhone SE) and 768px (iPad)

### Deployment

```bash
git add .
git commit -m "describe change"
git push origin main
# GitHub Pages auto-deploys from main/root
# Live at: https://ravikumarve.github.io/neuralhire/
```

GitHub Pages settings: repo → Settings → Pages → Source: Deploy from
branch → Branch: `main` → Folder: `/ (root)`.

## Code Style Guidelines

### General Principles

- Single-file architecture: all HTML, CSS, and JS live in `app/index.html`
- CSS goes in `<style>` in `<head>`, JS in `<script>` at end of `<body>`
- No build step — keep code self-contained and CDN-only for external deps

### HTML Conventions

- Use semantic HTML5: `<header>`, `<nav>`, `<section>`, `<button>`
- Always include:
  ```html
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#050510">
  ```
- Include `lang="en"` on `<html>`
- Use `aria-*` attributes on interactive elements
- CDN sources in use: Google Fonts, PDF.js (cdnjs), Groq API

### CSS Conventions

#### Variables (in `:root`)

```css
:root {
  --bg: #050510;
  --surface: #10102a;
  --green: #00ffaa;
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

#### Naming

- kebab-case for all class names: `.card-title`, `.q-display`
- BEM-like for components: `.answer-card`, `.answer-header`
- Semantic state classes: `.active`, `.recording`, `.thinking`
- Never use color words as generic classes (no `.red`, `.blue`)

#### Styling Rules

- Use CSS variables for every color and font — no hardcoded hex in rules
- Prefer class selectors; avoid deep nesting or ID selectors
- `rem` for font sizes, `px` for borders/shadows/spacing
- Animation durations: `0.15s`–`0.3s` for UI feedback, `0.5s`–`1s` for emphasis
- Responsive font sizes: `font-size: clamp(28px, 4vw, 44px)`
- Mobile-first: base styles for mobile, override at `@media(min-width: 768px)`

### JavaScript Conventions

#### Constants (top of script)

```javascript
// Provider URLs
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const OLLAMA_URL = 'http://localhost:11434/api/generate';

// Default models for each provider
const PROVIDER_MODELS = {
  groq: {
    fast:  'llama-3.1-8b-instant',      // quick responses, low latency
    smart: 'llama-3.3-70b-versatile'    // deeper analysis, slower
  },
  openai: {
    fast:  'gpt-3.5-turbo',
    smart: 'gpt-4'
  },
  anthropic: {
    fast:  'claude-3-haiku-20240307',
    smart: 'claude-3-sonnet-20240229'
  },
  gemini: {
    fast:  'gemini-pro',
    smart: 'gemini-pro'
  },
  ollama: {
    fast:  'llama2',
    smart: 'codellama'
  }
};
```

#### API Key Helpers

```javascript
// Always use these — never access localStorage directly for the key
const getApiKey = () => { 
  const providerId = settings.provider || 'groq';
  return localStorage.getItem(`nh_apikey_${providerId}`) || localStorage.getItem('nh_apikey') || '';
};
const setApiKey = (k, providerId = 'groq') => localStorage.setItem(`nh_apikey_${providerId}`, k);
```

#### Global State

```javascript
let recognition = null, isListening = false;
let currentAnswer = '', currentQuestion = '';
let history  = JSON.parse(localStorage.getItem('nh_history')  || '[]');
let settings = JSON.parse(localStorage.getItem('nh_settings') || '{}');
```

#### Naming

- camelCase for variables and functions: `toggleListen`, `saveApiKey`
- UPPERCASE_SNAKE for constants: `GROQ_URL`, `GROQ_MODELS`
- Action-verb prefix for functions: `getApiKey()`, `setStatus()`, `renderHistory()`

#### Functions

- Keep functions under 50 lines; split if longer
- Use `async/await` for all API calls — no `.then()` chains
- Wrap every async block in `try/catch`
- Always give user feedback on errors via `showToast()` or `setStatus()`

#### API Calls

```javascript
// Provider abstraction layer
async function callAIProvider(messages, model) {
  const providerId = settings.provider || 'groq';
  const provider = providerFactory.getProvider(providerId);
  const m = model || PROVIDER_MODELS[providerId]?.smart || 'llama-3.3-70b-versatile';
  return await provider.generateAnswer(messages, m);
}

// Backward compatibility
async function callGroq(messages, model) {
  return await callAIProvider(messages, model);
}
```

#### DOM Manipulation

- Cache elements once: `const el = document.getElementById('id')`
- Toggle classes: `el.classList.add('active')` / `.remove()` / `.toggle()`
- Build HTML with template literals; always escape user content first
- Never use `innerHTML` with raw user input

#### HTML Escaping (required before any innerHTML)

```javascript
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
// Usage: el.innerHTML = `<p>${escHtml(userInput)}</p>`;
```

#### localStorage

- Prefix all keys: `nh_history`, `nh_settings`, `nh_apikey`
- Always parse with a safe default:
  ```javascript
  JSON.parse(localStorage.getItem('nh_history') || '[]')
  ```
- Wrap writes in try/catch (can fail in private mode / storage full)

### Error Handling

- Never silently swallow errors — always log or surface to user
- `console.error()` for dev debugging
- `showToast(message)` for user-visible feedback
- Validate all inputs before processing (file type, key presence, etc.)

### Security

- Never `console.log` an API key or token
- Always run `escHtml()` before inserting user content into the DOM
- Accept PDF files only — check `file.type === 'application/pdf'`
- All data stays in `localStorage`; no external persistence

## Tab / Panel System

### How `switchTab()` works

```javascript
function switchTab(name) {
  // hide all panels, deactivate all tabs
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  // show target
  document.getElementById(`panel-${name}`).classList.add('active');
  document.querySelector(`.tab[data-tab="${name}"]`).classList.add('active');
}
```

### Adding a New Tab

1. Add tab button in the tab bar:
   ```html
   <button class="tab" data-tab="mytab" onclick="switchTab('mytab')">My Tab</button>
   ```
2. Add the panel:
   ```html
   <section class="panel" id="panel-mytab"> ... </section>
   ```
3. Add CSS for any new components inside the panel
4. If the tab needs init logic on first open, add a guard flag:
   ```javascript
   let myTabInitialized = false;
   // inside switchTab or panel-specific logic:
   if (name === 'mytab' && !myTabInitialized) { initMyTab(); myTabInitialized = true; }
   ```

## Service Worker Cache Strategy

`sw.js` uses a **cache-first** strategy for the app shell:

- On install: pre-cache `index.html`, `manifest.json`, CDN fonts
- On fetch: return cached response if available; fall back to network
- On activate: delete old caches

When modifying `sw.js`, increment the cache version constant to force
clients to pick up the new cache:
```javascript
const CACHE_NAME = 'neuralhire-v2'; // bump this on every sw.js change
```

## Adding Features

### New API Integration

1. Create a new provider class extending `AIProvider`
2. Implement `generateAnswer()` method with proper error handling
3. Implement `getCostEstimate()` method for cost tracking
4. Register provider in `ProviderFactory.initializeProviders()`
5. Add provider option to provider selection dropdown in Setup panel
6. Update API key validation in `saveApiKey()` for new provider format
7. Document rate limits in the Known Limitations section above

### New UI Component

1. Follow the CSS variable pattern — no hardcoded colors
2. Use semantic kebab-case class names
3. Test at 375px width (mobile) before 768px+
4. App is dark-only — do not add light mode styles

## Testing Checklist for Changes

- [ ] Works on Chrome desktop
- [ ] Works on Chrome Android (voice)
- [ ] Safari iOS — voice disabled gracefully, rest works
- [ ] PWA offline after first load
- [ ] No console errors
- [ ] localStorage round-trips correctly
- [ ] Responsive at 375px and 768px
- [ ] escHtml() used on all user-provided content in innerHTML
- [ ] Provider switching works correctly
- [ ] API key validation works for each provider format
- [ ] Cost estimation displays for paid providers
- [ ] Error handling shows provider-specific messages
