# Clearly — Production Launch Checklist & Release Protocol

This checklist governs the release procedure for **Clearly** (`iamHeroXD/clearlyai`). Every gate must pass prior to tagging a public release or uploading to the Chrome Web Store.

---

## Gate 1: Security, Secrets, and Manifest Permissions

- [x] **No Hardcoded Secrets**: Ensure zero API keys, personal access tokens, or sensitive credentials exist in the codebase.
- [x] **Strict Manifest V3 Host Permissions**:
  - `host_permissions` contains ONLY authorized AI provider endpoints:
    - `https://generativelanguage.googleapis.com/*`
    - `https://api.openai.com/*`
    - `https://api.anthropic.com/*`
    - `http://localhost:11434/*`
  - Unused `<all_urls>` permission REMOVED.
  - Privileged `"scripting"` permission REMOVED.
- [x] **Header-Based BYOK Authentication**:
  - Gemini API key passed via HTTP request header `x-goog-api-key` (NEVER via `?key=` query parameter).
  - OpenAI / Anthropic keys passed via standard `Authorization: Bearer` headers.
- [x] **Prompt Injection Defense**:
  - Selected text delimited within `<<<UNTRUSTED_SELECTED_TEXT>>>`.
  - System prompts instruct the LLM to treat highlighted text strictly as data.
- [x] **DOM Encapsulation**:
  - Content script attaches to the webpage with `attachShadow({ mode: 'closed' })`.
  - Page scripts cannot query or tamper with Clearly UI nodes.

---

## Gate 2: Chrome Extension Verification

- [x] **Manifest V3 Conformance**:
  - `manifest_version: 3`
  - Background script runs as a lightweight service worker (`dist/background.js`).
  - Content script injected cleanly on DOM ready (`dist/content.js`).
- [x] **Lens System Completeness**:
  - All 10 canonical lenses functional: `simple`, `eli5`, `define`, `grammar`, `professional`, `code`, `math`, `legal`, `tldr`, `translate`.
  - Writing modes (`grammar`, `professional`) populate `rewrittenText` and support 1-click clipboard copy.
- [x] **Defensive Storage & Cache**:
  - Versioned storage schema (`_version: 1`) preserves user settings across updates.
  - In-memory and local cache prevents redundant API calls and wasteful billing.
  - Fallback mechanism handles offline state or paused settings gracefully.

---

## Gate 3: Clearly Reader Studio (Desktop)

- [x] **Honest Product Definition**:
  - Explicitly positioned as **Clearly Reader Studio** (distraction-free document & reading workbench).
  - Zero simulated screen capture timeouts or fake OCR buttons.
- [x] **Core Functionality**:
  - Real clipboard paste & analyze workflow (`handlePasteClipboard`).
  - Full canonical lens suite available for text and document analysis.
  - Integrated speech synthesis using native Web Speech API.
  - Direct 1-click launcher (`Launch_Clearly_Reader.bat`) included in portable ZIP.
- [x] **Clean Component Architecture**:
  - 6 orphaned mock components completely removed.
  - Builds cleanly without external Rust/Tauri toolchain requirements.

---

## Gate 4: Marketing Website & Documentation

- [x] **Truthful Social Proof & Marketing Copy**:
  - Fabricated user personas and fake user counts removed.
  - Genuine reading use cases highlighted (Research Papers, Technical Docs, Complex Contracts).
  - Benchmark methodology clearly documented with lab footnotes.
- [x] **Accurate Privacy Policy**:
  - Accurately details that API calls travel directly from the user's browser to the chosen AI provider.
  - Accurately documents that surrounding context is optional and stored locally.
- [x] **Correct Project Hyperlinks**:
  - All repository links point to `https://github.com/iamHeroXD/clearlyai`.
  - Download page offers direct ZIP archives with clear install instructions.

---

## Gate 5: Quality Assurance & Automated Testing

- [x] **Full Vitest Test Suite Passing**:
  - `tests/cleanText.test.ts` (Text sanitization)
  - `tests/codeDetector.test.ts` (Programming language heuristic)
  - `tests/mathDetector.test.ts` (Mathematical expression heuristic)
  - `tests/positioning.test.ts` (Floating pill viewport bounds)
  - `tests/cache.test.ts` (LRU cache & TTL expiry)
  - `tests/providers.test.ts` (AI provider contracts & MockProvider)
  - `tests/validation.test.ts` (Defensive schema validation & sanitization)
  - `tests/lenses.test.ts` (Canonical lens catalog & prompt builders)
  - `tests/integration.test.ts` (End-to-end AI request pipeline & auto-detect)
  - **Result**: 9 test files, 45 tests, 100% pass rate.
- [x] **Static Type Check**:
  - `npx tsc --noEmit` succeeds with zero errors across the extension codebase.

---

## Gate 6: CI/CD & Repository Governance

- [x] **Open-Source License**: Root `LICENSE` file present (MIT License).
- [x] **Automated CI Workflow**:
  - `.github/workflows/ci.yml` triggers on `push` and `pull_request` to `main`.
  - Executes typecheck, test suite, extension build, website build, desktop build, and package validation.

---

## Gate 7: Release Packaging & Cryptographic Integrity

- [x] **Build & Packaging Automation**:
  - `npm run build:all` executes full build sequence.
  - `scripts/package-release.js` produces standalone release ZIPs:
    - Extension: `website/public/downloads/clearly-extension-v1.0.0.zip`
    - Desktop: `website/public/downloads/clearly-desktop-v1.0.0-windows.zip`
- [x] **Cryptographic Manifest**:
  - SHA-256 checksums calculated and recorded in `website/public/downloads/release-manifest.json`.

---

## Step-by-Step Release Protocol

### 1. Web Store Submission (Chrome Web Store)
1. Run `npm run build` to generate the production extension bundle in `dist/`.
2. Inspect `dist/manifest.json` to verify `version: "1.0.0"` and minimal permissions.
3. Compress the contents of `dist/` into `clearly-extension-v1.0.0.zip`.
4. Log in to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).
5. Click **New Item** and upload `clearly-extension-v1.0.0.zip`.
6. Fill in Store Metadata:
   - **Category**: Productivity / Accessibility
   - **Single Purpose**: "Instantly deconstruct dense text, equations, and code on any webpage."
   - **Permission Justification**: Explain that host permissions are strictly needed for BYOK AI endpoints.
7. Submit for review.

### 2. GitHub Release
1. Ensure all changes are committed and pushed to `main`.
2. Create and push a git release tag:
   ```bash
   git tag -a v1.0.0 -m "Clearly v1.0.0 - Production Release"
   git push origin v1.0.0
   ```
3. Draft a new Release on GitHub:
   - Attach `website/public/downloads/clearly-extension-v1.0.0.zip`
   - Attach `website/public/downloads/clearly-desktop-v1.0.0-windows.zip`
   - Paste the contents of `website/public/downloads/release-manifest.json` including SHA-256 hashes.
