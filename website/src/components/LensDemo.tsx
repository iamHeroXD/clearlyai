import React, { useState } from 'react';

export const LensDemo: React.FC = () => {
  const [activeLens, setActiveLens] = useState<'simple' | 'eli5' | 'grammar' | 'professional' | 'code' | 'roast'>('simple');
  const [opacity, setOpacity] = useState(1);

  const lensData = {
    simple: "You naturally notice facts that agree with you and skip over ones that don't — even without meaning to.",
    eli5: "It's like only listening to the friend who agrees with you and covering your ears when someone disagrees.",
    grammar: "Confirmation bias is the tendency to seek, interpret, and recall information that confirms existing beliefs, while discounting contradictory evidence.",
    professional: "Confirmation bias refers to the systematic tendency to favor information that supports pre-existing beliefs while underweighting disconfirming evidence.",
    code: "P(believe | evidence) updates asymmetrically: P(update | confirming) > P(update | disconfirming), even when both carry equal evidential weight.",
    roast: "You're not \"doing research.\" You're Googling until something agrees with you, then closing the tab."
  };

  const handleSelectLens = (lens: typeof activeLens) => {
    if (lens === activeLens) return;
    setOpacity(0);
    setTimeout(() => {
      setActiveLens(lens);
      setOpacity(1);
    }, 120);
  };

  const lenses = [
    { id: 'simple', label: 'Simple' },
    { id: 'eli5', label: 'ELI5' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'professional', label: 'Professional' },
    { id: 'code', label: 'Code & Math' },
    { id: 'roast', label: 'Roast' },
  ] as const;

  return (
    <div className="max-w-[640px] mx-auto">
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
          className="inline-flex gap-1 bg-[var(--paper-raised)] border border-[var(--line)] p-1 rounded-full overflow-x-auto max-w-full"
        >
          {lenses.map((lens) => {
            const isSelected = activeLens === lens.id;
            return (
              <button
                key={lens.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectLens(lens.id)}
                className={`px-3.5 py-1.5 rounded-full text-[0.875rem] font-medium whitespace-nowrap transition-all ${
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
          className={`text-[1.0625rem] leading-[1.65] text-[var(--ink)] ${
            activeLens === 'code' ? 'font-mono text-[0.9375rem]' : ''
          }`}
        >
          {lensData[activeLens]}
        </p>
      </div>
    </div>
  );
};
