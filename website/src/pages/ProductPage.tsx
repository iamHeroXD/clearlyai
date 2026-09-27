import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserDemo } from '../components/BrowserDemo';
import { LensDemo } from '../components/LensDemo';
import { RewriteDemo } from '../components/RewriteDemo';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { EngineDiagram } from '../components/EngineDiagram';

export const ProductPage: React.FC = () => {
  return (
    <main id="main">
      {/* Header */}
      <section className="section-padding hero pb-12">
        <div className="container-custom">
          <div className="max-w-[38rem] mx-auto text-center">
            <span className="inline-block text-[0.8125rem] px-3 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--gray-600)] font-mono mb-4">
              Product Overview
            </span>
            <h1 className="text-[var(--text-display)] font-semibold text-[var(--ink)] leading-[1.06] tracking-tight">
              A companion that disappears when you're done.
            </h1>
            <p className="text-[1.125rem] text-[var(--ink-soft)] mt-4 leading-[1.6]">
              Clearly attaches intelligence to your cursor. No sidebars, no new tabs, and no context switching.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="section-padding divider section-flush-top">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1: Understand */}
            <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)]">
              <div className="text-[0.75rem] font-mono text-[var(--gray-500)] uppercase tracking-wider mb-3">01 // Read</div>
              <h3 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                Highlight → Understand
              </h3>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6] mb-6">
                Encounter dense academic abstracts, legal gotchas, or complex code. Clearly summarizes or explains it with zero disruption to your reading flow.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-[0.875rem] text-[var(--ink)] font-mono">
                Fast response • Cloud AI or local Ollama
              </div>
            </div>

            {/* Pillar 2: Rewrite */}
            <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)]">
              <div className="text-[0.75rem] font-mono text-[var(--gray-500)] uppercase tracking-wider mb-3">02 // Write</div>
              <h3 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                Highlight → Rewrite
              </h3>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6] mb-6">
                Draft rough thoughts in Gmail, Slack, Notion, or Twitter. Highlight your draft, pick Grammar or Professional, and replace it in-place in 1 click.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-[0.875rem] text-[var(--ink)] font-mono">
                Works in contenteditable &amp; textareas
              </div>
            </div>

            {/* Pillar 3: Pronounce */}
            <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)]">
              <div className="text-[0.75rem] font-mono text-[var(--gray-500)] uppercase tracking-wider mb-3">03 // Audio</div>
              <h3 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                Highlight → Pronounce
              </h3>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6] mb-6">
                Listen to correct pronunciations with Web Speech audio synthesis and read exact International Phonetic Alphabet (IPA) notations.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-[0.875rem] text-[var(--ink)] font-mono">
                IPA notation • Native Web Speech
              </div>
            </div>

            {/* Pillar 4: Save */}
            <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)]">
              <div className="text-[0.75rem] font-mono text-[var(--gray-500)] uppercase tracking-wider mb-3">04 // Vault</div>
              <h3 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                Highlight → Save
              </h3>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6] mb-6">
                Star terms, concepts, and code snippets to your local knowledge notebook. Export anytime to Markdown, CSV, or Anki flashcards.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-[0.875rem] text-[var(--ink)] font-mono">
                100% offline local storage • 1-click export
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ten Lenses Interactive Deep Dive */}
      <section className="section-padding divider raised">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
              Ten deliberate lenses.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
              One piece of text, ten canonical ways to interpret, deconstruct, or refine it.
            </p>
          </div>

          <LensDemo />
        </div>
      </section>

      {/* In-Place Rewrite Interactive Demo */}
      <section className="section-padding divider">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
              In-place replacement mechanics.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
              Clearly detects active editable fields and performs native input events, preserving undo history (`Ctrl+Z` / `⌘Z`).
            </p>
          </div>

          <RewriteDemo />
        </div>
      </section>

      {/* Knowledge Notebook Section */}
      <section className="section-padding divider raised">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
              Your personal vocabulary notebook.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
              Everything you star stays in your local browser database. Sync to Obsidian, Notion, or Anki whenever you want.
            </p>
          </div>

          <KnowledgeCard />
        </div>
      </section>

      {/* Multi-Model Inference */}
      <section className="section-padding divider">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
              Multi-model freedom.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
              Never locked into a single provider. Bring your own key or run locally with Ollama.
            </p>
          </div>

          <EngineDiagram />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding divider raised text-center">
        <div className="container-custom">
          <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
            Ready to read with clarity?
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
            Free and open-source. Works in any Chromium browser.
          </p>
          <div className="mt-6">
            <Link
              to="/download"
              className="inline-flex items-center px-6 py-3 rounded-full text-[0.9375rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
            >
              Get Clearly for Chrome
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
