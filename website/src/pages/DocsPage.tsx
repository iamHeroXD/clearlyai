import React from 'react';
import { Link } from 'react-router-dom';

export const DocsPage: React.FC = () => {
  return (
    <main id="main">
      {/* Header */}
      <section className="section-padding hero pb-12">
        <div className="container-custom">
          <div className="max-w-[38rem] mx-auto text-center">
            <span className="inline-block text-[0.8125rem] px-3 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--gray-600)] font-mono mb-4">
              Documentation &amp; Guides
            </span>
            <h1 className="text-[var(--text-display)] font-semibold text-[var(--ink)] leading-[1.06] tracking-tight">
              Documentation.
            </h1>
            <p className="text-[1.125rem] text-[var(--ink-soft)] mt-4 leading-[1.6]">
              Setup guides, provider configurations, keyboard shortcuts, and troubleshooting.
            </p>
          </div>
        </div>
      </section>

      {/* Docs Content */}
      <section className="section-padding divider section-flush-top">
        <div className="container-custom">
          <div className="max-w-[48rem] mx-auto space-y-12">

            {/* 1. Ten Canonical Lenses Guide */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                1. The 10 Canonical Explanation Lenses
              </h2>
              <div className="border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--paper)] divide-y divide-[var(--line)] text-[0.9375rem]">
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Simple</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Explains the core idea in 1–2 direct, jargon-free sentences. Best for dense articles and research.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">ELI5 (Explain Like I'm 5)</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Deconstructs abstract theories into relatable, everyday analogies.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Define</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Provides phonetic breakdown, IPA transcription, parts of speech, and clear contextual definitions.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Grammar &amp; Polish</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Fixes spelling, punctuation, and awkward phrasing while preserving your natural voice. Supports 1-click in-place replace.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Professional Tone</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Elevates rough notes into polished executive statements for leadership and clients.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Code Deconstruct</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Analyzes code syntax, logic mechanisms, and scans for edge cases and potential bugs.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Math Notation</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Breaks down complex formulas, step-by-step proofs, and mathematical notation.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Legal Risk Radar</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Audits contracts and terms of service for arbitration clauses, data sale risks, and hidden liabilities.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">TL;DR</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Condenses lengthy passages into exactly 3 dense, high-signal bullet takeaways.</span>
                </div>
                <div className="p-5">
                  <strong className="text-[var(--ink)] block mb-1">Translate</strong>
                  <span className="text-[var(--ink-soft)] text-sm">Fluent, culturally nuanced translations preserving idioms and tone across global languages.</span>
                </div>
              </div>
            </div>

            {/* 2. Provider Setup (BYOK) */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                2. AI Providers &amp; Bring Your Own Key (BYOK)
              </h2>
              <div className="space-y-4 text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6]">
                <p>
                  Right-click the Clearly extension icon in your Chrome toolbar and select <strong>Options</strong> to choose your preferred AI backend:
                </p>
                <div className="p-5 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] space-y-3">
                  <div>
                    <strong className="text-[var(--ink)] block mb-0.5">Google Gemini (Recommended Default):</strong>
                    Obtain a key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline text-[var(--ink)]">aistudio.google.com</a>. Defaults to official stable <code className="font-mono text-xs bg-[var(--paper)] px-1 rounded">gemini-2.5-flash</code> with header-authenticated requests and optional <code className="font-mono text-xs bg-[var(--paper)] px-1 rounded">gemini-2.5-pro</code>.
                  </div>
                  <div>
                    <strong className="text-[var(--ink)] block mb-0.5">Anthropic Claude / OpenAI GPT-4o:</strong>
                    Paste your personal key from the Anthropic or OpenAI developer console. Keys are stored locally in <code className="font-mono text-xs bg-[var(--paper)] px-1 rounded">chrome.storage.local</code>.
                  </div>
                  <div>
                    <strong className="text-[var(--ink)] block mb-0.5">Local Ollama (100% Offline):</strong>
                    Run <code className="font-mono text-xs bg-[var(--paper)] px-1 rounded">ollama run llama3.2</code> on your computer. Point Clearly to <code className="font-mono text-xs bg-[var(--paper)] px-1 rounded">http://localhost:11434</code>.
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Keyboard Shortcuts */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                3. Keyboard Shortcuts
              </h2>
              <div className="border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--paper)] divide-y divide-[var(--line)] font-mono text-xs">
                <div className="p-4 flex items-center justify-between">
                  <span className="font-sans text-[0.9375rem] text-[var(--ink)]">Dismiss explanation / pill</span>
                  <span className="bg-[var(--paper-raised)] border border-[var(--line-strong)] px-2.5 py-1 rounded text-[var(--ink)]">Escape</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-sans text-[0.9375rem] text-[var(--ink)]">Trigger explanation on selection</span>
                  <span className="bg-[var(--paper-raised)] border border-[var(--line-strong)] px-2.5 py-1 rounded text-[var(--ink)]">Alt + C (or Click Pill)</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-sans text-[0.9375rem] text-[var(--ink)]">Undo in-place rewrite</span>
                  <span className="bg-[var(--paper-raised)] border border-[var(--line-strong)] px-2.5 py-1 rounded text-[var(--ink)]">Ctrl + Z / ⌘Z</span>
                </div>
              </div>
            </div>

            {/* 4. Troubleshooting */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                4. Troubleshooting &amp; FAQ
              </h2>
              <div className="space-y-3 text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6]">
                <div className="p-5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)]">
                  <strong className="text-[var(--ink)] block mb-1">Why doesn't the pill appear on certain web pages?</strong>
                  <span>Some system pages (e.g. <code className="font-mono text-xs bg-[var(--paper-raised)] px-1 rounded">chrome://</code> URLs or Chrome Web Store) block content scripts for security. Clearly operates across all standard websites, Google Docs, Notion, Slack, and webmail.</span>
                </div>
                <div className="p-5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)]">
                  <strong className="text-[var(--ink)] block mb-1">How do I export my starred vocabulary?</strong>
                  <span>Open the extension popup by clicking the Clearly icon in your toolbar, navigate to Starred, and click Export Markdown, CSV, or Anki.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-padding divider raised text-center">
        <div className="container-custom">
          <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
            Ready to explore?
          </h2>
          <div className="mt-6">
            <Link
              to="/download"
              className="inline-flex items-center px-6 py-3 rounded-full text-[0.9375rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
            >
              Get Clearly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
