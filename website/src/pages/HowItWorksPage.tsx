import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrowserDemo } from '../components/BrowserDemo';

export const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: '01',
      title: 'Highlight any text',
      desc: 'Select a word, sentence, paragraph, or code snippet on any webpage in Chrome.',
      detail: 'Clearly attaches directly to the DOM selection without altering page formatting.',
    },
    {
      num: '02',
      title: 'Clearly appears instantly',
      desc: 'A minimal, non-intrusive floating pill floats right above your highlighted cursor.',
      detail: 'Zero screen obstruction. If you keep scrolling or ignore it, it simply stays out of your way.',
    },
    {
      num: '03',
      title: 'Choose a lens',
      desc: 'Pick from 10 canonical lenses: Simple, ELI5, Define, Grammar, Professional, Code, Math, Legal, TL;DR, or Translate.',
      detail: 'Or press your default shortcut to instantly expand your favorite lens.',
    },
    {
      num: '04',
      title: 'Understand or rewrite',
      desc: 'Read the concise summary, listen to IPA pronunciation, or click "Replace text" in editable inputs.',
      detail: 'Native browser event dispatching swaps text in-place while keeping full Ctrl+Z undo support.',
    },
    {
      num: '05',
      title: 'Continue your flow',
      desc: 'Press Escape or click anywhere to dismiss the card. Zero residue left on your screen.',
      detail: 'No sidebars to close, no tabs to manage, no clipboard clutter.',
    },
  ];

  return (
    <main id="main">
      {/* Header */}
      <section className="section-padding hero pb-12">
        <div className="container-custom">
          <div className="max-w-[38rem] mx-auto text-center">
            <span className="inline-block text-[0.8125rem] px-3 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--gray-600)] font-mono mb-4">
              Workflow Guide
            </span>
            <h1 className="text-[var(--text-display)] font-semibold text-[var(--ink)] leading-[1.06] tracking-tight">
              How Clearly works.
            </h1>
            <p className="text-[1.125rem] text-[var(--ink-soft)] mt-4 leading-[1.6]">
              A five-step journey that takes less than two seconds in daily practice.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Step Walkthrough */}
      <section className="section-padding divider section-flush-top">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step navigation cards */}
            <div className="lg:col-span-5 space-y-3">
              {steps.map((s, idx) => {
                const stepNum = idx + 1;
                const isActive = activeStep === stepNum;
                return (
                  <button
                    key={s.num}
                    onClick={() => setActiveStep(stepNum)}
                    className={`w-full text-left p-6 rounded-[var(--radius-lg)] border transition-all ${
                      isActive
                        ? 'bg-[var(--paper-raised)] border-[var(--ink)] shadow-[var(--shadow-sm)]'
                        : 'bg-[var(--paper)] border-[var(--line)] hover:border-[var(--line-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-[var(--gray-600)]">
                        STEP {s.num}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      )}
                    </div>
                    <h3 className="text-[1.125rem] font-semibold text-[var(--ink)] mb-1">
                      {s.title}
                    </h3>
                    <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5]">
                      {s.desc}
                    </p>
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-[var(--line)] text-[0.8125rem] font-mono text-[var(--gray-600)]">
                        {s.detail}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step Visual Preview Frame */}
            <div className="lg:col-span-7 sticky top-24">
              <div className="border border-[var(--line)] rounded-[var(--radius-lg)] bg-[var(--paper)] p-6 sm:p-8 shadow-[var(--shadow-md)]">
                <div className="text-xs font-mono text-[var(--gray-500)] uppercase tracking-wider mb-4">
                  Interactive Preview // Step {steps[activeStep - 1].num}
                </div>
                <BrowserDemo />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="section-padding divider raised text-center">
        <div className="container-custom">
          <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
            Experience it in your browser.
          </h2>
          <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
            Add to Chrome in 30 seconds. No registration required.
          </p>
          <div className="mt-6">
            <Link
              to="/download"
              className="inline-flex items-center px-6 py-3 rounded-full text-[0.9375rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
            >
              Install Clearly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
