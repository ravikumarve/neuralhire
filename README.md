# 🎯 NeuralHire v5.2

**AI-powered interview copilot with multi-provider support.** Real-time answer generation, mock interview scoring, session history, and PDF resume upload across 5 AI providers.

[**→ Launch App**](https://ravikumarve.github.io/neuralhire/app/)

---

## ✨ What's New in v5.0

| Feature | Description |
|---|---|
| 🔄 **Multi-Provider Support** | Choose from 5 AI providers — Groq, OpenAI, Anthropic, Gemini, or Ollama |
| 🏗️ **Provider Abstraction Layer** | Unified API interface — switch providers without changing code |
| 💰 **Cost Estimation** | Real-time cost tracking for each provider (free tier awareness) |
| 🔐 **Provider-Specific Keys** | Separate API key storage for each provider |
| 🎯 **Smart Model Selection** | Provider-aware model dropdowns with recommended defaults |
| 📄 **PDF Resume Upload** | Upload your resume PDF — AI personalizes every answer |
| 🏋️ **Mock Interview + Scoring** | Practice with FAANG questions. Scored on Relevance, Specificity & STAR |
| 📋 **Session History** | Every Q&A saved locally. Review, copy, track improvement |
| 🔊 **Earpiece Mode** | Auto-reads answers so you can listen hands-free |
| 🌐 **Multi-language** | Works in any language supported by your provider |
| 🎯 **Answer Modes** | 3 answer styles: Concise (30s), Deep Dive (technical), Culture Fit (behavioral) |
| 💻 **Code Editor** | Built-in Monaco editor for technical questions with syntax highlighting |

---

## 🗂 Project Structure

```
neuralhire/
├── index.html          ← Landing page (root)
├── README.md
└── app/
    ├── index.html      ← Main app (PWA)
    ├── manifest.json
    └── sw.js
```

---

## 🤖 Supported AI Providers

NeuralHire v5.0 supports 5 AI providers with unified interface:

### 🚀 Groq (Default)
- **Best for**: Fastest responses, free tier available
- **Key format**: `gsk_...` (starts with `gsk_`)
- **Free tier**: 30 RPM, 6000 TPM, ~14.4K requests/day
- **Get key**: [console.groq.com/keys](https://console.groq.com/keys)

### 🤖 OpenAI
- **Best for**: GPT-4 quality, reliable performance
- **Key format**: `sk-...` (starts with `sk-`)
- **Cost**: ~$0.002 per 1K tokens (gpt-3.5-turbo)
- **Get key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 🧠 Anthropic
- **Best for**: Claude models, thoughtful responses
- **Key format**: `sk-ant-...` (starts with `sk-ant-`)
- **Cost**: ~$0.003 per 1K tokens (claude-3-sonnet)
- **Get key**: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

### ⭐ Gemini
- **Best for**: Cost-effective, Google ecosystem
- **Key format**: `AIza...` (starts with `AIza`)
- **Cost**: ~$0.0005 per 1K tokens (gemini-pro)
- **Get key**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 💻 Ollama (Local)
- **Best for**: Privacy, offline use, no API costs
- **Key**: None required (local server)
- **Setup**: Run `ollama serve` locally
- **Models**: llama2, mistral, codellama, etc.

---

## 🚀 Features

### Answer Modes
NeuralHire now offers 3 distinct answer modes to tailor your interview responses:

**🎯 Concise Mode**
- Perfect for quick, 30-60 second answers
- Focuses on key points and clarity
- Ideal for rapid-fire interview questions

**🔍 Deep Dive Mode** 
- Technical deep dive with architectural insights
- Includes implementation details and best practices
- Provides specific examples and tradeoff analysis
- Perfect for technical and system design questions

**🤝 Culture Fit Mode**
- Focuses on teamwork, collaboration, and soft skills
- Emphasizes communication, adaptability, and cultural fit
- Uses storytelling and personal examples
- Ideal for behavioral and leadership questions

### Code Editor
NeuralHire now includes a built-in Monaco code editor for technical interview questions:

**💻 Monaco Editor Integration**
- Syntax highlighting for JavaScript, Python, Java, C++, HTML, CSS
- VS Code-like editing experience
- Line numbers and code formatting
- Automatic language detection

**🔍 Smart Code Detection**
- Automatically detects code content in questions
- Shows editor when technical content is identified
- Enhances AI responses with code context
- Supports multiple programming languages

**📋 Code Management**
- Copy code to clipboard with one click
- Language-specific syntax highlighting
- Clean, professional code presentation
- Perfect for technical interviews and coding questions

- **Live Mode** — tap mic, AI captures question and generates tailored answer in 2–3s
- **Mock Mode** — company-specific questions (Google, Amazon, Meta, Microsoft, Apple, Startup)
- **Scoring** — 3-dimension AI scoring with feedback and a model answer
- **PDF Resume** — upload once, AI references your experience in every answer
- **Session History** — up to 100 Q&A pairs stored locally
- **PWA** — add to home screen, works offline for UI
- **Multi-Provider** — switch between 5 AI providers seamlessly
- **Cost Tracking** — real-time cost estimation for paid providers
- **Key Validation** — automatic format checking for each provider
- **Answer Modes** — 3 answer styles: Concise (30s), Deep Dive (technical), Culture Fit (behavioral)
- **Code Editor** — Built-in Monaco editor with syntax highlighting for technical questions

---

## 🔧 Setup Instructions

### Step 1 — Choose Your Provider

1. Open the NeuralHire app
2. Go to **Setup** tab
3. Select your preferred AI provider from the dropdown
4. Add your API key (except Ollama)

### Step 2 — Get API Keys

**Groq**: [console.groq.com/keys](https://console.groq.com/keys) (free)
**OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (paid)
**Anthropic**: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) (paid)
**Gemini**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) (paid)
**Ollama**: Install [ollama.ai](https://ollama.ai) and run `ollama serve`

### Step 3 — Add Your Key

1. Copy your API key
2. Paste into the API Key field
3. Click **SAVE**
4. Status should show "[Provider] Ready"

### Step 4 — Upload Resume (Optional)

1. Drag & drop your PDF resume
2. AI will extract text and reference it in all answers
3. Supports text-layer PDFs only (no scanned documents)

### Step 5 — Choose Answer Mode

1. After asking a question, select your preferred answer mode:
   - **CONCISE**: Quick 30-60 second answers
   - **DEEP DIVE**: Technical deep dives with examples
   - **CULTURE FIT**: Behavioral and soft skill focused
2. The AI will tailor its response style accordingly
3. Your mode preference is saved for future sessions

---

## ⚠️ Limitations & Requirements

### Browser Support
- **Voice Recognition**: Chrome/Edge desktop & Android only
- **No Support**: Firefox, Safari iOS 16-, private/incognito mode
- **PWA Install**: Android Chrome recommended

### PDF Support
- **Works**: Text-layer PDFs (most modern resumes)
- **Fails**: Scanned/image-only PDFs (shows blank text)
- **Max Pages**: 8 pages parsed
- **No Web Worker**: Runs on main thread

### Storage Limitations
- **localStorage**: Cleared in private mode & iOS Safari with "Prevent Cross-Site Tracking"
- **Capacity**: ~5-10MB depending on browser
- **No Persistence**: Never assume data will persist; always check before reading

### Provider-Specific Limits

**Groq Free Tier**:
- 30 requests/minute
- 6000 tokens/minute
- ~14,400 requests/day

**All Providers**:
- Handle 429 errors gracefully with user-visible messages
- API calls require internet (app shell cached only)
- Mobile devices may sleep during voice capture
- Voice recognition stops when app backgrounds

---

## 🏗️ Architecture Overview

### Provider Abstraction Layer
```javascript
class AIProvider {
  // Base class with unified interface
  async generateAnswer(messages, model, temperature, maxTokens)
  getCostEstimate(tokens)
}

class ProviderFactory {
  // Singleton managing all providers
  registerProvider(), getProvider(), getAllProviders()
}
```

### Supported Provider Classes
- `GroqProvider` - Fast, free tier
- `OpenAiProvider` - GPT models, reliable
- `AnthropicProvider` - Claude models, thoughtful
- `GeminiProvider` - Cost-effective, Google
- `OllamaProvider` - Local, private, free

### Key Features
- **Unified API**: Same method calls for all providers
- **Automatic Format Conversion**: Handles provider-specific message formats
- **Cost Tracking**: Real-time token cost estimation
- **Error Handling**: Provider-specific error messages
- **Key Validation**: Format checking for each provider type

---

## 🔧 Git Push Fix (Linux Mint)

### Step 1 — Check your setup
```bash
git remote -v
git branch
```

### Step 2 — Fix remote URL
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/neuralhire.git
```

### Step 3 — Create GitHub Personal Access Token
- GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
- Click **Generate new token** → check ✅ **repo** → Copy

### Step 4 — Store credentials (enter once, saved forever)
```bash
git config --global credential.helper store
```

### Step 5 — Commit & Push
```bash
git add .
git commit -m "v5.0: Multi-provider support, cost tracking, provider abstraction"
git push origin main
# Username: your GitHub username
# Password: your Personal Access Token (NOT your GitHub password)
```

### Step 6 — Enable GitHub Pages
- GitHub → your repo → **Settings** → **Pages**
- Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → **Save**
- Live at: `https://YOUR_USERNAME.github.io/neuralhire/`

---

## 🚀 Development

### Local Development
```bash
# Option A — Python (no install needed)
cd app && python -m http.server 8001
# then open http://localhost:8001

# Option B — Node serve
npx serve app
```

### Testing Checklist
- [ ] App loads on Chrome desktop (primary platform)
- [ ] App loads on Chrome Android (voice features)
- [ ] App loads on Safari iOS (expect voice to be disabled gracefully)
- [ ] PDF upload extracts visible text (use a real text-layer PDF)
- [ ] API calls succeed with valid keys for each provider
- [ ] 429 rate-limit error shows friendly toast, not crash
- [ ] localStorage persists across page refresh
- [ ] Service worker caches app shell (check DevTools → Application → SW)
- [ ] PWA installs correctly on Android Chrome
- [ ] No console errors on load or during normal use
- [ ] Responsive layout on 375px (iPhone SE) and 768px (iPad)
- [ ] Provider switching works correctly
- [ ] Cost estimation displays for paid providers
- [ ] Key validation works for each provider format

---

## 📱 Mobile App Installation

NeuralHire is a Progressive Web App (PWA) that can be installed on your mobile device:

### **Android (Chrome)**
1. Open Chrome browser and navigate to https://ravikumarve.github.io/neuralhire/
2. Tap the "Install" button in the address bar
3. Confirm installation when prompted
4. The app will appear on your home screen

### **iOS (Safari)**
1. Open Safari and navigate to https://ravikumarve.github.io/neuralhire/
2. Tap the Share button (📤)
3. Select "Add to Home Screen"
4. Name it "NeuralHire" and tap "Add"

### **Mobile App Features**
- 📱 **Responsive Design**: Optimized for mobile screens
- 🎤 **Voice Recognition**: Works best on Chrome Android
- 📄 **PDF Upload**: Mobile-friendly file selection
- 💾 **Offline Support**: App shell works offline
- 🏠 **Home Screen Access**: Launch like a native app

### **Mobile Limitations**
- Voice recognition requires Chrome/Edge on Android
- iOS Safari has limited Web Speech API support
- PDF parsing works best with text-layer PDFs
- Screen timeout may interrupt voice recording

---

## ⚠️ Disclaimer

For educational and interview preparation purposes. Use responsibly.

---

## 📝 Version History

**v5.2** - Monaco Editor integration for technical questions with syntax highlighting
**v5.1** - Answer modes (Concise, Deep Dive, Culture Fit), enhanced UI
**v5.0** - Multi-provider architecture, cost tracking, provider abstraction layer
**v4.0** - PDF resume upload, mock interview scoring, session history
**v3.0** - Voice recognition, real-time answers, PWA support
**v2.0** - Basic AI interview assistant, single provider