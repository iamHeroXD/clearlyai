# Clearly — Understand Anything You Read

> **Select any text on any webpage → instantly understand it in the simplest possible way.**

Clearly is a production-grade Chrome Extension (Manifest V3) built with TypeScript, React, Vite, and Shadow DOM isolation. It functions as a lightweight, private, and native reading intelligence tool—not a conversational chatbot or oversized sidebar.

---

## Key Features

- **Micro-Action Trigger**: Highlight text, and a lightweight `[ ✨ Explain ]` pill appears near your cursor.
- **In-Page Floating Card**: Fast, non-intrusive explanation card positioned intelligently with collision detection.
- **10 Canonical Lenses**:
  - **✨ Simple Terms**: 1-2 easy sentences with real-world examples and why it matters.
  - **🐣 ELI5 Analogy**: Vivid everyday analogies explaining complex concepts to anyone.
  - **📖 Definition**: Precise dictionary breakdown, phonetic pronunciation, part of speech, and usage.
  - **✍️ Grammar & Tone**: 1-click typo, punctuation, and phrasing fixes ready for replacement.
  - **💼 Professional**: Executive, active-voice polish for emails, PRs, and briefs.
  - **💻 Code Analysis**: Programming language detection, key mechanisms, and bug pitfall scan.
  - **📐 Mathematics**: Solves and explains equations, formulas, and LaTeX notations step-by-step.
  - **⚖️ Contract Risk**: Plain-language scan for mandatory arbitration, liability waivers, and data selling traps.
  - **⚡ TL;DR Bullets**: Exactly 3 dense, high-signal takeaway bullet points.
  - **🌐 Translate**: Accurate, culturally fluent translation across major languages.
- **Clearly Reader Studio**: Standalone desktop reading workbench with clipboard integration and distraction-free document deconstruction.
- **Smart Surrounding Context**: Intelligently inspects surrounding sentences for ambiguous terms or pronouns without scraping full pages.
- **Pluggable AI Providers**: Native support for Google Gemini (default: `gemini-2.5-flash`), OpenAI (GPT-4o Mini), Anthropic Claude (`claude-haiku-4-5-20251001`), Ollama (local Llama 3.2), custom endpoints, and an offline demo engine.
- **Zero CSS Bleed**: Floating UI is encapsulated inside a **closed Shadow DOM** ensuring complete isolation from webpage DOM scripts and styles.
- **Strict Privacy & BYOK Security**: Zero telemetry, zero analytics, local caching, and secure header-based API key transport (`x-goog-api-key`).

---

## Project Structure

```
├── manifest.json              # Chrome Extension Manifest V3
├── package.json               # Dependencies and build scripts
├── vite.config.ts             # Vite multi-entry bundle configuration
├── tailwind.config.js         # Design system tokens and styling
├── demo.html                  # Test playground with sample text types
├── src/
│   ├── background/            # Background service worker
│   │   ├── index.ts           # Service worker entry & commands
│   │   ├── contextMenus.ts    # Right-click context menu handlers
│   │   └── messageRouter.ts   # Async message routing & AI dispatch
│   ├── content/               # Webpage content script
│   │   ├── index.ts           # Content script bootstrap
│   │   ├── shadowHost.ts      # Closed Shadow DOM container manager
│   │   ├── components/        # Isolated React UI components
│   │   │   ├── App.tsx        # Selection & lifecycle controller
│   │   │   ├── FloatingPill.tsx # Floating action trigger
│   │   │   ├── ExplanationCard.tsx # Modal explanation card
│   │   │   └── QuickQuiz.tsx  # Interactive learning check
│   │   └── styles/
│   │       └── shadow.css     # Shadow DOM self-contained styles
│   ├── popup/                 # Extension toolbar action popup
│   │   ├── index.tsx
│   │   └── Popup.tsx
│   ├── options/               # Full settings & history manager
│   │   ├── index.tsx
│   │   ├── Options.tsx
│   │   └── sections/
│   │       ├── GeneralSettings.tsx
│   │       ├── ProviderSettings.tsx
│   │       ├── HistoryViewer.tsx
│   │       └── PrivacySettings.tsx
│   ├── providers/             # Pluggable AI provider abstraction
│   │   ├── types.ts           # AIProvider interface & JSON parser
│   │   ├── gemini.ts          # Google Gemini provider
│   │   ├── openai.ts          # OpenAI provider
│   │   ├── anthropic.ts       # Anthropic Claude provider
│   │   ├── ollama.ts          # Local Ollama provider
│   │   ├── custom.ts          # Custom REST / OpenAI-compatible provider
│   │   ├── mock.ts            # Offline demo engine
│   │   └── index.ts           # Provider factory & registry
│   ├── services/              # Extension core services
│   │   ├── aiService.ts       # AI dispatch & orchestrator
│   │   ├── selection.ts       # Selection & context extractor
│   │   ├── positioning.ts     # Viewport collision & coordinate math
│   │   ├── cache.ts           # LRU cache manager
│   │   ├── history.ts         # Local history persistence
│   │   └── storage.ts         # chrome.storage.local wrapper
│   ├── types/                 # Shared TypeScript interfaces
│   └── utils/                 # Pure helper functions
│       ├── cleanText.ts       # Selection normalization
│       ├── codeDetector.ts    # Programming language heuristic
│       ├── mathDetector.ts    # Math & equation heuristic
│       ├── sanitize.ts        # XSS sanitizer
│       └── systemPrompt.ts    # Strict JSON system prompts
└── tests/                     # Vitest automated test suite
    ├── cleanText.test.ts
    ├── codeDetector.test.ts
    ├── mathDetector.test.ts
    ├── positioning.test.ts
    ├── cache.test.ts
    ├── providers.test.ts
    ├── validation.test.ts
    ├── lenses.test.ts
    └── integration.test.ts
```

---

## Production Documentation & Audit

For complete architectural details, security assessments, and release procedures:
- [Forensic Production Audit](docs/PRODUCTION_AUDIT.md) — Comprehensive vulnerability and remediation analysis.
- [Launch Checklist & Release Protocol](docs/LAUNCH_CHECKLIST.md) — Multi-gate verification criteria and publishing steps.
- [Final Production Report](docs/FINAL_PRODUCTION_REPORT.md) — Principal engineer sign-off and verification proof.

---

## Installation & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suite
```bash
npm test
```
Executes all 45 automated unit and integration tests across 9 test suites via Vitest.

### 3. Build Everything (Extension, Desktop Studio, Website & Packages)
```bash
npm run build:all
```
This triggers:
- `npm run build`: Compiles Chrome Extension into `dist/`
- `npm run build:website`: Compiles Website into `dist-website/`
- `npm run build:desktop`: Compiles Reader Studio into `dist-desktop/`
- `npm run package`: Generates standalone ZIP archives and `release-manifest.json` with SHA-256 checksums.

---

## Loading into Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `dist/` directory inside this repository.
5. Clearly is now active on all webpages!

---

## AI Provider Setup

Open Clearly Settings by clicking the extension icon → **Configure API Keys & Full Settings**, or right-click the extension icon → **Options**.

### Google Gemini (Recommended)
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Select **Google Gemini** in Provider Settings and paste your key.
3. Default model: `gemini-2.5-flash`. Authentication is sent via the secure `x-goog-api-key` header.

### OpenAI
1. Get an API key from [platform.openai.com](https://platform.openai.com/).
2. Select **OpenAI** in Provider Settings and paste your key.
3. Default model: `gpt-4o-mini` or `gpt-4o`.

### Anthropic Claude
1. Get an API key from [console.anthropic.com](https://console.anthropic.com/).
2. Select **Anthropic Claude** and paste your key.
3. Default model: `claude-haiku-4-5-20251001`.

### Ollama (100% Local / Offline)
1. Start Ollama with origin access: `OLLAMA_ORIGINS="*" ollama serve`
2. Select **Ollama (Local)** in Provider Settings.
3. Default endpoint: `http://localhost:11434/api/generate` with model `llama3.2`.

---

## Privacy & Security Architecture

1. **Zero Webpage Scraping**: Only the highlighted string and an immediate 160-character context window are analyzed upon explicit user trigger.
2. **Local Key Storage**: API keys are saved strictly in `chrome.storage.local` and are never shared across tabs or injected into webpage DOMs.
3. **Shadow DOM Isolation**: The user interface is rendered inside an isolated Shadow DOM container with distinct styling rules, preventing cross-origin script/style tampering.
4. **Content Security Policy (CSP)**: Built without `eval()` or unsafe DOM innerHTML insertions.

---

## Manual Verification & Testing

Open `demo.html` in Chrome to test all interactions:
1. **Highlight scientific text** → Click `✨ Explain` to see the simple summary and example.
2. **Highlight difficult prose** → Click dropdown `⚡ Simplify` for plain English rewrite.
3. **Highlight code block** → Click `💻 Code` for language breakdown and potential issues.
4. **Highlight equation** → Click `📐 Math` for step-by-step reasoning.
5. **Press `Ctrl+Shift+E`** (or `Cmd+Shift+E` on Mac) to explain selection instantly with keyboard shortcut.
6. **Click outside** or press `Escape` → Floating UI disappears smoothly without leaving any trace on the page.

---

## License

MIT License. Designed with simplicity, speed, and privacy in mind.
