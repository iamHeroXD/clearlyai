import React, { useState } from 'react';

export const RewriteDemo: React.FC = () => {
  const roughText = "hey just wanted to follow up on this we spoke about last week, let me know if ur free to chat sometime this week or next, thanks";
  const fixedText = "Hi — following up on what we discussed last week. Let me know if you're free to chat sometime this week or next. Thanks!";

  const [text, setText] = useState(roughText);
  const [isRough, setIsRough] = useState(true);
  const [opacity, setOpacity] = useState(1);

  const handleRewrite = () => {
    setOpacity(0);
    setTimeout(() => {
      setText(fixedText);
      setIsRough(false);
      setOpacity(1);
    }, 180);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpacity(0);
    setTimeout(() => {
      setText(roughText);
      setIsRough(true);
      setOpacity(1);
    }, 180);
  };

  return (
    <div className="max-w-[600px] mx-auto border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--paper)] shadow-[var(--shadow-md)]">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-[var(--line)] bg-[var(--paper-raised)] text-[var(--gray-500)] text-[0.8125rem]">
        <span className="font-semibold text-[var(--ink-soft)]">B</span>
        <span className="italic font-semibold text-[var(--ink-soft)]">I</span>
        <span className="underline font-semibold text-[var(--ink-soft)]">U</span>
        <span className="ml-auto text-[var(--gray-500)] font-mono text-[0.75rem]">Draft Email / Note</span>
      </div>

      {/* Editor Body */}
      <div className="p-6 sm:p-7">
        <p
          style={{ opacity, transition: 'opacity 180ms ease' }}
          className={`text-[1.0625rem] leading-[1.7] text-[var(--ink-soft)] ${
            isRough
              ? 'bg-[var(--accent-soft)] rounded px-1.5 py-0.5 text-[var(--ink)] font-medium border-b border-[var(--accent)]'
              : 'text-[var(--ink)]'
          }`}
        >
          {text}
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[var(--line)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[0.8125rem] font-medium rounded-full glass-pill text-[var(--ink)]">
              <span className="brand-mark" aria-hidden="true" />
              <span>Grammar</span>
            </span>
            <button
              onClick={handleRewrite}
              disabled={!isRough}
              className={`inline-flex items-center px-4 py-2 rounded-full text-[0.875rem] font-medium transition-all ${
                isRough
                  ? 'bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95'
                  : 'bg-[var(--paper-raised)] text-[var(--gray-500)] cursor-not-allowed border border-[var(--line)]'
              }`}
            >
              Replace text
            </button>
          </div>

          <button
            onClick={handleReset}
            className="text-[0.875rem] text-[var(--gray-600)] hover:text-[var(--ink)] border-b border-[var(--line-strong)] pb-0.5"
          >
            Reset draft
          </button>
        </div>
      </div>
    </div>
  );
};
