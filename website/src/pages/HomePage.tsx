import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserDemo } from '../components/BrowserDemo';
import { LensDemo } from '../components/LensDemo';
import { RewriteDemo } from '../components/RewriteDemo';
import { EngineDiagram } from '../components/EngineDiagram';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { DesktopPreview } from '../components/DesktopPreview';

export const HomePage: React.FC = () => {
  return (
    <main id="main">
      {/* HERO */}
      <section className="section-padding hero" id="top">
        <div className="container-custom">
          <div className="max-w-[38rem] mx-auto text-center">
            <h1 className="text-[var(--text-display)] font-semibold text-[var(--ink)] leading-[1.06] tracking-tight">
              Understand anything you highlight.
            </h1>
            <p className="text-[1.125rem] text-[var(--ink-soft)] mt-4 leading-[1.6] max-w-[30rem] mx-auto">
              Clearly is a Chrome extension that explains, rewrites, or defines whatever you've selected — right where you selected it.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.9375rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all shadow-sm"
              >
                <span>Get Clearly Free</span>
              </Link>
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[0.9375rem] font-medium border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors bg-[var(--paper-raised)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#E1993B]"></span>
                <span>Desktop App (Windows / Mac)</span>
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-1.5 font-medium text-[0.9375rem] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors group px-2 py-1"
              >
                <span>How it works</span>
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M6 3l5 5-5 5"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <BrowserDemo />
            <p className="text-center text-[0.875rem] text-[var(--gray-500)] mt-4">
              Select the highlighted sentence — or any other line — to try it yourself.
            </p>
          </div>
        </div>
      </section>

      {/* SIX LENSES */}
      <section id="lenses" className="section-padding divider">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 sm:mb-12 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] leading-[1.15]">
              Six lenses. One click.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
              Simple, ELI5, Grammar, Professional, Code &amp; Math, and Roast — one explanation window, six ways of thinking about it.
            </p>
          </div>

          <LensDemo />
        </div>
      </section>

      {/* WORKFLOW / FEWER STEPS */}
      <section id="workflow" className="section-padding divider raised">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 sm:mb-12">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] leading-[1.15]">
              Fewer steps, not more features.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
              Most AI tools give you a new destination. Clearly removes the trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Without Clearly */}
            <div>
              <h3 className="text-[0.9375rem] font-semibold text-[var(--gray-600)] mb-4 uppercase tracking-wider font-mono text-xs">
                Without Clearly
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-[0.9375rem] text-[var(--gray-500)]">
                <li>Select the text</li>
                <li>Copy it</li>
                <li>Open a new tab</li>
                <li>Paste it into a chat</li>
                <li>Write a prompt</li>
                <li>Wait for a reply</li>
                <li>Copy the answer</li>
                <li>Switch back</li>
                <li>Paste it or reread it</li>
              </ol>
            </div>

            {/* With Clearly */}
            <div>
              <h3 className="text-[0.9375rem] font-semibold text-[var(--ink)] mb-4 uppercase tracking-wider font-mono text-xs">
                With Clearly
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-[1.0625rem]">
                <li className="p-3.5 rounded-[var(--radius-md)] bg-[var(--paper)] border border-[var(--line)] font-medium text-[var(--ink)]">
                  Select the text
                </li>
                <li className="p-3.5 rounded-[var(--radius-md)] bg-[var(--paper)] border border-[var(--line)] font-medium text-[var(--ink)]">
                  Pick a lens
                </li>
                <li className="p-3.5 rounded-[var(--radius-md)] bg-[var(--accent-soft)] font-semibold text-[var(--ink)]">
                  Done
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* REWRITE */}
      <section id="rewrite" className="section-padding divider">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 sm:mb-12 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] leading-[1.15]">
              Fix it without leaving the sentence.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
              Select the rough draft, pick a lens, and replace it in place. No copying, no new tab.
            </p>
          </div>

          <RewriteDemo />
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="section-padding divider raised">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 sm:mb-12">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] leading-[1.15]">
              Your words stay yours.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
              Clearly keeps what it can on your device, and is specific about the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="p-7 rounded-[var(--radius-lg)] bg-[var(--paper)] border border-[var(--line)]">
              <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">On this device</h3>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6]">
                Your settings, saved words, and lens preferences are stored locally in the extension. Nothing here is uploaded.
              </p>
            </div>

            <div className="p-7 rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] bg-transparent">
              <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">When you choose a provider</h3>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6]">
                Only the text you've selected is sent to the model you've picked — never your browsing history or the rest of the page.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-[var(--gray-600)]">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
              No account required
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
              No tracking
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
              No telemetry by default
            </span>
          </div>
        </div>
      </section>

      {/* ENGINE */}
      <section id="engine" className="section-padding divider">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 sm:mb-12 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] leading-[1.15]">
              One interface, any model.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
              Run Clearly on-device where it's supported, bring your own API key, or point it at a model on your own machine.
            </p>
          </div>

          <EngineDiagram />
        </div>
      </section>

      {/* KNOWLEDGE */}
      <section id="knowledge" className="section-padding divider raised">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 sm:mb-12 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] leading-[1.15]">
              Never look it up twice.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
              Star a word or idea and Clearly keeps it — definition, pronunciation, and all — ready to export.
            </p>
          </div>

          <KnowledgeCard />
        </div>
      </section>

      {/* DESKTOP */}
      <section id="desktop" className="section-padding divider">
        <div className="container-custom">
          <DesktopPreview />
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="download" className="section-padding divider raised text-center">
        <div className="container-custom">
          <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
            See clearly.
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
            Free. Works in Chrome. No account required to start.
          </p>
          <div className="mt-7">
            <Link
              to="/download"
              className="inline-flex items-center px-6 py-3 rounded-full text-[0.9375rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
            >
              Try Clearly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
