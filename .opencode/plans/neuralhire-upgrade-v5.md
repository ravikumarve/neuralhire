# NeuralHire v5.0 Upgrade Roadmap

> **Scope:** 3 weeks. Solo developer. Ship to Gumroad at the end.
> **Rule:** If it doesn't help someone ace an interview or close a sale, it's v6.0.

---

## 📊 Current State

**What works:**
- PWA with service worker caching
- Voice recognition via Web Speech API
- PDF.js resume parsing
- Groq API with rate limiting
- Local storage session history
- Responsive dark theme UI

**What's blocking launch:**
- Single provider (Groq only) — users without Groq key are stuck
- UI not premium enough for a paid Gumroad listing
- No .env support — API keys hardcoded or manually entered
- No answer refinement — one response mode only
- No hotkeys — too slow for real interview use

---

## ✅ v5.0 Scope (Ship in 3 Weeks)

### Pillar 1 — Multi-Provider + Local AI
- Provider abstraction layer (Groq, Gemini, Ollama)
- `.env` file support with `localStorage` fallback
- API key manager UI (add/switch/clear keys per provider)
- Ollama as default zero-cost local option

> **Agents:** `ollama-ai` for local LLM integration

### Pillar 2 — Premium UI Overhaul
- Dual-pane layout: live transcription left, AI answer right
- Ghost Mode: semi-transparent overlay (stealth during interviews)
- Global hotkeys: `Ctrl+Shift+S` (mic toggle), `Ctrl+Shift+G` (generate answer)
- Status indicators: mic active, processing, provider connected, error
- Loading skeletons and smooth transitions
- Mobile-optimized layout

> **Agents:** `frontend-design` for component overhaul, `nextjs-app-router` if migrating UI shell

### Pillar 3 — Answer Refinement
- 3 answer modes: **Concise** / **Deep Dive** / **Culture Fit**
- STAR format toggle for behavioral questions
- One-click copy per answer block
- Answer history within session (scroll back)

### Pillar 4 — Launch Readiness
- `README.md` rewrite with screenshots and setup guide
- `.env.example` committed to repo
- Gumroad product page copy
- Demo video (screen record, 3 min max)
- GitHub repo polished for public listing

> **Agents:** `git-ops` for branch strategy and release tagging, `docs-write` for README

---

## ❄️ Moved to v6.0 (Do Not Touch Now)

| Feature | Reason Deferred |
|---|---|
| Monaco code editor | Complex dependency, not core to interview flow |
| WebSocket / headless mode | No users yet, premature infrastructure |
| Company profile memory system | Nice to have, not blocking sales |
| Session analytics dashboard | Build after you have users to analyze |
| OpenAI + Anthropic providers | Groq + Gemini + Ollama covers 95% of users |
| Enterprise tier ($99/month) | Needs support infra you don't have |
| OWASP security testing | Post-revenue investment |
| White-label API access | v6.0 enterprise play |
| Micro-interactions & animations | Polish after core works |

---

## 🔧 Technical Implementation

### Provider Abstraction (implement Day 1)

```javascript
// providers.js
const PROVIDERS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyEnv: 'GROQ_API_KEY',
    model: 'llama3-8b-8192'
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    keyEnv: 'GEMINI_API_KEY',
    model: 'gemini-pro'
  },
  ollama: {
    url: 'http://localhost:11434/api/generate',
    keyEnv: null,           // no key needed
    model: 'mistral'        // or any Ollama model
  }
};

function getProvider(name) {
  const p = PROVIDERS[name];
  const key = localStorage.getItem(`key_${name}`) 
    || (p.keyEnv && process.env[p.keyEnv]);
  return { ...p, key };
}
```

### Environment Configuration

```bash
# .env.example
NEURALHIRE_DEFAULT_PROVIDER=ollama
GROQ_API_KEY=
GEMINI_API_KEY=
OLLAMA_HOST=http://localhost:11434
```

### Ghost Mode (CSS only)

```css
.ghost-mode {
  opacity: 0.15;
  transition: opacity 0.2s ease;
}
.ghost-mode:hover {
  opacity: 0.95;
}
```

### Hotkey Registration

```javascript
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'S') toggleMic();
  if (e.ctrlKey && e.shiftKey && e.key === 'G') generateAnswer();
});
```

---

## 📅 3-Week Sprint Plan

### Week 1 — Core Infrastructure
| Day | Task | Agent | Effort |
|---|---|---|---|
| 1 | Provider abstraction layer | `ollama-ai` | M |
| 2 | `.env` support + localStorage fallback | — | S |
| 3 | API key manager UI (add/switch/clear) | `frontend-design` | M |
| 4 | Ollama integration + local test | `ollama-ai` | M |
| 5 | Gemini provider + test all 3 providers | — | S |

### Week 2 — UI Overhaul
| Day | Task | Agent | Effort |
|---|---|---|---|
| 6 | Dual-pane layout scaffold | `frontend-design` | M |
| 7 | Ghost Mode + opacity toggle | `frontend-design` | S |
| 8 | Global hotkeys (mic + generate) | — | S |
| 9 | Status indicator system | `frontend-design` | S |
| 10 | Answer modes (Concise / Deep Dive / Culture Fit) | — | M |

### Week 3 — Polish + Launch
| Day | Task | Agent | Effort |
|---|---|---|---|
| 11 | STAR format toggle + one-click copy | — | S |
| 12 | Loading skeletons + error handling | `frontend-design` | S |
| 13 | README rewrite + `.env.example` | `git-ops` | S |
| 14 | Screen record demo video (3 min) | — | M |
| 15 | Gumroad listing live + GitHub polished | `git-ops` | M |

---

## 🛡️ Risks & Mitigations (v5.0 only)

| Risk | Mitigation |
|---|---|
| Ollama not running on user machine | Clear setup docs + Groq as fallback default |
| PDF parsing breaks on some resumes | Keep existing PDF.js, add manual text paste fallback |
| Voice recognition fails (non-Chrome) | Show browser compatibility warning on load |
| localStorage key storage insecure | Warn user in UI, document risk, full encryption in v6.0 |
| Ghost Mode too transparent on some screens | Make opacity a user-adjustable slider |

---

## 🧪 Testing Checklist (v5.0)

- [ ] Groq provider works end-to-end
- [ ] Gemini provider works end-to-end
- [ ] Ollama works with at least 2 local models
- [ ] Provider switching mid-session works
- [ ] Ghost Mode toggles cleanly
- [ ] Hotkeys work in Chrome and Firefox
- [ ] All 3 answer modes return different output
- [ ] PDF upload + voice still work after refactor
- [ ] PWA installs and caches offline correctly
- [ ] Mobile layout usable on 375px screen

---

## 🚀 Go-to-Market (v5.0 Launch)

### Pricing
- **Free tier:** Groq + Ollama only, 10 sessions/day
- **Pro — $29 one-time (Gumroad):** All providers, unlimited sessions, Ghost Mode, hotkeys

One-time price beats subscription for Gumroad buyers. Upgrade to subscription model in v6.0.

### Launch Channels
1. Gumroad listing (Day 15)
2. GitHub public repo with stars push
3. Post on r/cscareerquestions, r/interviews, r/SideProject
4. IndieHackers launch post
5. Product Hunt (Week 4, after gathering first reviews)

### Target Audience (v5.0)
- Job seekers prepping for technical + behavioral interviews
- Bootcamp graduates entering job market
- Anyone switching careers into tech

---

## 📊 Realistic Success Metrics (v5.0)

| Metric | Target |
|---|---|
| Gumroad sales — Month 1 | 10–20 sales ($290–$580) |
| GitHub stars — Month 1 | 50+ |
| PWA Lighthouse score | > 85 |
| Answer generation time | < 4s on Groq, < 8s on Ollama |
| Load time | < 2s |

---

## 🔍 Agent Usage Map

| Agent | Used For |
|---|---|
| `frontend-design` | Dual-pane layout, Ghost Mode, status indicators, loading states |
| `ollama-ai` | Provider abstraction, local LLM integration, model selection UI |
| `nextjs-app-router` | Only if UI shell migrates to Next.js — optional |
| `git-ops` | Branch strategy (feature branches per pillar), release tagging v5.0 |
| `docs-write` | README rewrite, `.env.example`, user setup guide |
| `manager` | Run `/gumroad` on Day 14 before listing goes live |

---

## 🗂️ v6.0 Backlog (Locked Until v5.0 Ships)

- Monaco editor for coding questions
- WebSocket headless mode for agent integration
- Company profile + memory system
- Session analytics dashboard
- OpenAI + Anthropic providers
- Enterprise / white-label tier
- Subscription billing (Polar or LemonSqueezy)
- OWASP security audit
- Micro-interactions and animation polish
- Resume-answer highlighting

---

*Version: v5.0*
*Status: Ready to Build*
*Timeline: 3 weeks → Gumroad live*
*Last Updated: 2026-03-29*
