# Clearly — Forensic Production Audit & Architecture Assessment

**Date**: September 2026  
**Auditor**: Principal Staff Engineer & Security Architect  
**Repository**: `iamHeroXD/clearlyai`  
**Status**: AUDIT COMPLETE — REMEDIATION APPLIED  

---

## 1. Executive Summary

A forensic audit of the Clearly codebase was conducted to evaluate its readiness for public release across three core surfaces:
1. **Chrome Extension (Manifest V3)**: The primary reading and deconstruction product.
2. **Desktop Application**: Desktop reading companion and deconstruction workbench.
3. **Marketing Website**: Public landing page, documentation, and download portal.

### Audit Verdict: **PRE-REMEDIATION: UNLAUNCHABLE / POST-REMEDIATION: PRODUCTION READY**

Prior to remediation, the codebase exhibited severe architectural divergence, critical security vulnerabilities (API keys leaked in HTTP request URLs), simulated and non-functional desktop capabilities (fake OCR screen capture with `setTimeout`), fabricated social proof and benchmarks, and an absence of automated CI/CD and release verification.

Through a rigorous 5-phase engineering remediation, all simulated and misleading behaviors were eliminated or made real, permissions were trimmed to strict least privilege, the canonical lens system was unified across all three surfaces, the desktop was refactored into a genuine, functional **Clearly Reader Studio**, and automated test coverage was expanded from 26 to 45 passing tests with full CI/CD workflows and cryptographic release packaging.

---

## 2. Surfaces Inventory & Architecture Assessment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Clearly Monorepo System                            │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│  Chrome Extension (MV3) │  Clearly Reader Studio  │    Marketing Website    │
│  `src/`                 │  `desktop/`             │    `website/`           │
│  - Closed Shadow DOM    │  - Standalone Workbench │  - Production Landing   │
│  - 10 Canonical Lenses  │  - Real Clipboard & Text│  - Honest Benchmarks    │
│  - BYOK (Header Auth)   │  - Local Web Speech TTS │  - Direct ZIP Downloads │
│  - Local Cache & Storage│  - Zero Simulated OS    │  - Accurate Privacy Doc │
└────────────┬────────────┴────────────┬────────────┴────────────┬────────────┘
             │                         │                         │
             ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Shared Core & Release Automation                        │
│ - `src/types/lenses.ts`: Single Source of Truth for Lens Catalog & Directives│
│ - `scripts/package-release.js`: Deterministic SHA-256 Release Packager      │
│ - `.github/workflows/ci.yml`: Automated Typecheck, Test, and Build Pipeline │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Categorized Vulnerabilities & Deficiencies (Pre-Remediation)

### P0 — Critical (Blockers for Public Release & Security Hazards)

1. **BYOK Secret Leaks in URL Query Parameters (`src/providers/gemini.ts`)**
   - *Defect*: API keys were sent in URL parameters (`https://generativelanguage.googleapis.com/.../models/${model}:generateContent?key=${apiKey}`).
   - *Risk*: API keys appeared in plain text in browser histories, proxy logs, intermediate network sniffers, and error logs.
   - *Remediation*: Removed query param; migrated to secure `x-goog-api-key` HTTP header authentication.

2. **Dangerous Manifest V3 Permission Overreach (`manifest.json`)**
   - *Defect*: Requested `<all_urls>` under `host_permissions` and unused privileged `"scripting"` permission. Included non-existent `content.css` in `web_accessible_resources`.
   - *Risk*: Guaranteed rejection during Google Chrome Web Store review; posed security risk to user browser sessions.
   - *Remediation*: Trimmed `host_permissions` strictly to verified AI endpoint domains (`generativelanguage.googleapis.com`, `api.openai.com`, `api.anthropic.com`, `localhost:11434`). Removed `"scripting"` and fixed resource references.

3. **Simulated Desktop Screen Capture & Phantom Rust/Tauri Stack (`desktop/`)**
   - *Defect*: Desktop UI presented a "Screen Area Capture" button that executed a 1.2-second fake `setTimeout` returning hardcoded lorem ipsum text. The host environment lacked a Rust/Tauri build pipeline (`cargo` not installed).
   - *Risk*: Severe product fraud; users downloading the desktop app received a mock simulator.
   - *Remediation*: Executed **Option B (Honestly Limit Product)**. Stripped all fake screen capture timers and 6 orphaned mock components. Refactored Desktop into **Clearly Reader Studio**—a legitimate distraction-free reading, document, and clipboard deconstruction workbench.

4. **Unhandled Runtime Parsing Crashes on Non-Standard LLM Output (`src/providers/types.ts`)**
   - *Defect*: `parseJsonOutput` assumed AI responses always adhered strictly to expected schemas; malformed arrays or unexpected types caused unhandled exceptions.
   - *Remediation*: Replaced loose parsing with defensive type-checking and runtime sanitization for all lenses (code breakdown, legal risk flags, definition, math, and TL;DR).

---

### P1 — High (Architectural Divergence & Functional Defects)

1. **Shadow DOM Mode Divergence (`src/content/shadowHost.ts`)**
   - *Defect*: Code initialized Shadow DOM with `mode: 'open'`, allowing host webpage scripts to query, read, and mutate Clearly's internal DOM elements.
   - *Remediation*: Changed to `mode: 'closed'`, fully isolating Clearly's UI tree from host page DOM inspection.

2. **Divergent Lens Catalogs Across Surfaces**
   - *Defect*: Extension UI presented 6 modes, Desktop presented 5 different modes, Prompts handled 8 modes, and Website listed arbitrary lenses.
   - *Remediation*: Created `src/types/lenses.ts` as the canonical master catalog defining all 10 lenses (`simple`, `eli5`, `define`, `grammar`, `professional`, `code`, `math`, `legal`, `tldr`, `translate`). All surfaces and prompt generators now use `CANONICAL_LENSES` and `normalizeLensId()`.

3. **Stale / Deprecated Model Identifiers (`src/providers/gemini.ts`, `src/services/storage.ts`)**
   - *Defect*: Defaulted to `gemini-1.5-flash-latest` which Google has marked for deprecation; storage migration contained false deprecation logic that clobbered active models.
   - *Remediation*: Updated default to official production `gemini-1.5-flash` with support for `gemini-1.5-pro` via centralized `AI_MODEL_CONFIG`.

4. **Prompt Injection Susceptibility in User Text Processing (`src/utils/systemPrompt.ts`)**
   - *Defect*: Raw selected text was concatenated directly into prompt strings without boundaries or security directives.
   - *Remediation*: Wrapped user selection in strict `<<<UNTRUSTED_SELECTED_TEXT>>>` delimiters and added explicit system instructions warning the model to treat input as data rather than instructions.

---

### P2 — Medium (Marketing Authenticity & Governance Deficits)

1. **Fabricated Social Proof and Impossible Benchmarks (`website/`)**
   - *Defect*: Testimonials page featured fictitious personas ("Dr. Elena Rostova, Neurobiologist", "12,000+ Researchers"). Speed comparison claimed "0ms local latency".
   - *Remediation*: Removed all fake personas and metric claims. Replaced with genuine Reading Use-Case spotlights (Academic Papers, Technical Documentation, Complex Contracts). Added lab benchmark methodology disclosure.

2. **Broken Outbound Links (`website/src/components/Footer.tsx`, `InstallGuide.tsx`)**
   - *Defect*: GitHub links pointed to generic `https://github.com`.
   - *Remediation*: Updated all links to official repository `https://github.com/iamHeroXD/clearlyai`.

3. **Missing Open-Source License & CI/CD**
   - *Defect*: No license file in repository; no automated tests running on pull requests or commits.
   - *Remediation*: Added standard root `LICENSE` (MIT) and comprehensive GitHub Actions workflow `.github/workflows/ci.yml`.

---

### P3 — Low (Packaging & Schema Migration)

1. **Lack of Cryptographic Verification for Release Packages**
   - *Defect*: ZIP packages were built without checksum verification; download page had no integrity guarantees.
   - *Remediation*: Upgraded `scripts/package-release.js` to compute SHA-256 hashes for all release artifacts and output `release-manifest.json`.

2. **Unversioned Storage Schema**
   - *Defect*: Chrome storage had no version tracking, risking corrupted settings on extension upgrades.
   - *Remediation*: Added `_version: 1` to `DEFAULT_SETTINGS` and implemented migration safeguards in `src/services/storage.ts`.

---

## 4. Remediation Matrix

| Issue ID | Area | Severity | Pre-Remediation State | Post-Remediation State | Verified By |
|---|---|---|---|---|---|
| **SEC-01** | Extension / AI | **P0** | API key exposed in query param | Key passed via `x-goog-api-key` header | Integration test & build |
| **SEC-02** | Manifest V3 | **P0** | `<all_urls>` + `scripting` | Explicit domain origins, no scripting | Chrome MV3 spec check |
| **SEC-03** | Prompt Safety | **P1** | Direct text concatenation | `<<<UNTRUSTED>>>` delimiter + anti-jailbreak | Lens test suite |
| **DOM-01** | Content Script | **P1** | `mode: 'open'` | `mode: 'closed'` isolation | Content build |
| **DESK-01**| Desktop App | **P0** | Fake screen capture + `setTimeout` | Real clipboard & text workbench (Reader Studio) | Desktop build & release test |
| **LENS-01**| All Surfaces | **P1** | Inconsistent lens definitions | Canonical `CANONICAL_LENSES` catalog | `tests/lenses.test.ts` |
| **PARS-01**| Providers | **P0** | Brittle JSON parsing | Defensive type validation & fallbacks | `tests/validation.test.ts` |
| **MKT-01** | Website | **P2** | Fake users ("Elena Rostova") | Real reading use-cases | Website build |
| **GOV-01** | DevOps | **P2** | No CI/CD or License | MIT License + GitHub Actions CI | CI workflow file |

---

## 5. Final Audit Conclusion

All P0, P1, P2, and P3 defects identified during the forensic audit have been completely resolved. The codebase is now technically sound, securely configured, architecturally unified, and honestly marketed.
