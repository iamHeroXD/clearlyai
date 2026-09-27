import React, { useState } from 'react';

type CanonicalLensId = 'simple' | 'eli5' | 'define' | 'grammar' | 'professional' | 'code' | 'math' | 'legal' | 'tldr' | 'translate';

export const LensDemo: React.FC = () => {
  const [activeLens, setActiveLens] = useState<CanonicalLensId>('simple');
  const [opacity, setOpacity] = useState(1);

  const lensData: Record<CanonicalLensId, string> = {
    simple: "You naturally notice facts that agree with your opinions and overlook ones that contradict them.",
    eli5: "It's like only listening to the friend who agrees with your game rules and ignoring everyone else who points out you're playing wrong.",
    define: "confirmation bias (/ˌkɒnfərˈmeɪʃən ˈbaɪəs/) [noun]: A cognitive shortcut where individuals preferentially gather and retain evidence aligned with prior beliefs.",
    grammar: "Confirmation bias is the tendency to seek, interpret, and recall information that confirms existing beliefs while discounting contradictory evidence.",
    professional: "Confirmation bias systematically skews decision-making by prioritizing hypothesis-confirming signals while underweighting disconfirming operational data.",
    code: "function evaluateEvidence(item, prior) {\n  // Bug: asymmetric weighting\n  return item.supports(prior) ? accept(item) : drop(item);\n}",
    math: "Bayesian skew: Updates P(H|E) disproportionately when E aligns with prior H, violating normative Bayes' Theorem.",
    legal: "Compliance Notice: Evidential filtering creates significant audit liabilities in discovery, contract due diligence, and risk governance.",
    tldr: "• Definition: Filtering reality to match preconceptions.\n• Mechanism: Amplifies agreeing data; discards conflicting facts.\n• Impact: Degrades decision objectivity.",
    translate: "Biais de confirmation (FR) / Sesgo de confirmación (ES): La tendance à privilégier les données confirmant des hypothèses préexistantes."
  };

  const handleSelectLens = (lens: CanonicalLensId) => {
    if (lens === activeLens) return;
    setOpacity(0);
    setTimeout(() => {
      setActiveLens(lens);
      setOpacity(1);
    }, 120);
  };

  const lenses: { id: CanonicalLensId; label: string }[] = [
    { id: 'simple', label: 'Simple' },
    { id: 'eli5', label: 'ELI5' },
    { id: 'define', label: 'Define' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'professional', label: 'Professional' },
    { id: 'code', label: 'Code' },
    { id: 'math', label: 'Math' },
    { id: 'legal', label: 'Legal' },
    { id: 'tldr', label: 'TL;DR' },
    { id: 'translate', label: 'Translate' },
  ];

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Passage */}
      <div className="text-[1.0625rem] leading-[1.8] text-[var(--ink-soft)] p-6 sm:p-7 border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--paper)]">
        Confirmation bias describes the tendency to search for, interpret, and recall information in ways that{' '}
        <span className="bg-[var(--accent-soft)] text-[var(--ink)] rounded px-1 py-0.5 font-medium border-b border-[var(--accent)]">
          confirm what you already believe
        </span>
        , while unconsciously discounting evidence that contradicts it.
      </div>

      {/* Lens Segmented Controls */}
      <div className="flex justify-center mt-6">
        <div
          role="tablist"
          aria-label="Explanation lens"
          className="inline-flex gap-1 bg-[var(--paper-raised)] border border-[var(--line)] p-1 rounded-full overflow-x-auto max-w-full scrollbar-none"
        >
          {lenses.map((lens) => {
            const isSelected = activeLens === lens.id;
            return (
              <button
                key={lens.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectLens(lens.id)}
                className={`px-3 py-1 rounded-full text-[0.8125rem] font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[var(--paper)] text-[var(--ink)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--gray-600)] hover:text-[var(--ink)]'
                }`}
              >
                {lens.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lens Output Window */}
      <div className="mt-5 p-6 sm:p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper-raised)] min-h-[110px] flex items-center">
        <p
          style={{ opacity, transition: 'opacity 140ms ease' }}
          className={`text-[1.0625rem] leading-[1.65] text-[var(--ink)] whitespace-pre-line ${
            activeLens === 'code' ? 'font-mono text-[0.875rem]' : ''
          }`}
        >
          {lensData[activeLens]}
        </p>
      </div>
    </div>
  );
};
