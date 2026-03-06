# 🎯 NeuralHire v4.0

**AI-powered interview copilot.** Real-time answer generation, mock interview scoring, session history, and PDF resume upload.

[**→ Launch App**](https://YOUR_USERNAME.github.io/neuralhire/app/)

---

## ✨ What's New in v4.0

| Feature | Description |
|---|---|
| 📄 **PDF Resume Upload** | Upload your resume PDF — AI personalizes every answer |
| 🏋️ **Mock Interview + Scoring** | Practice with FAANG questions. Scored on Relevance, Specificity & STAR |
| 📋 **Session History** | Every Q&A saved locally. Review, copy, track improvement |
| 🔊 **Earpiece Mode** | Auto-reads answers so you can listen hands-free |
| 🌐 **Multi-language** | Works in any language Gemini supports |

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
git commit -m "v4.0: PDF resume, mock interview scoring, session history"
git push origin main
# Username: your GitHub username
# Password: your Personal Access Token (NOT your GitHub password)
```

### Step 6 — Enable GitHub Pages
- GitHub → your repo → **Settings** → **Pages**
- Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → **Save**
- Live at: `https://YOUR_USERNAME.github.io/neuralhire/`

---

## 🚀 Features

- **Live Mode** — tap mic, AI captures question and generates tailored answer in 2–3s
- **Mock Mode** — company-specific questions (Google, Amazon, Meta, Microsoft, Apple, Startup)
- **Scoring** — 3-dimension AI scoring with feedback and a model answer
- **PDF Resume** — upload once, AI references your experience in every answer
- **Session History** — up to 100 Q&A pairs stored locally
- **PWA** — add to home screen, works offline for UI

---

## ⚠️ Disclaimer

For educational and interview preparation purposes. Use responsibly.
