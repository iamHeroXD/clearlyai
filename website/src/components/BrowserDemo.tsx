import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const BrowserDemo: React.FC = () => {
  const [pillVisible, setPillVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [pillPos, setPillPos] = useState({ left: 0, top: 0 });
  const [cardPos, setCardPos] = useState({ left: 0, top: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLSpanElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);

  const calculatePositions = () => {
    if (!containerRef.current || !targetRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const tRect = targetRef.current.getBoundingClientRect();

    const left = Math.max(12, Math.min(tRect.left - cRect.left, containerRef.current.clientWidth - 120));
    const top = tRect.bottom - cRect.top + 8;
    setPillPos({ left, top });
    setCardPos({ left: Math.max(12, Math.min(left, containerRef.current.clientWidth - 340)), top: top + 38 });
  };

  const selectTarget = () => {
    if (!targetRef.current) return;
    calculatePositions();
    setPillVisible(true);
    setCardVisible(false);
  };

  const openCard = () => {
    setPillVisible(true);
    setCardVisible(true);
  };

  const closeCard = () => {
    setCardVisible(false);
  };

  const hideAll = () => {
    setPillVisible(false);
    setCardVisible(false);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (text.length > 0 && containerRef.current && containerRef.current.contains(sel?.anchorNode || null)) {
        const range = sel?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          const cRect = containerRef.current.getBoundingClientRect();
          const left = Math.max(12, Math.min(rect.left - cRect.left, containerRef.current.clientWidth - 120));
          const top = rect.bottom - cRect.top + 8;
          setPillPos({ left, top });
          setCardPos({ left: Math.max(12, Math.min(left, containerRef.current.clientWidth - 340)), top: top + 38 });
          setPillVisible(true);
          setCardVisible(false);
        }
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', calculatePositions);

    // Trigger initial demo on mount
    const timer = setTimeout(selectTarget, 600);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', calculatePositions);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="max-w-[740px] mx-auto border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--paper)] shadow-[var(--shadow-md)]">
      {/* Browser Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] bg-[var(--paper-raised)]">
        <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
        <span className="ml-1 text-[0.75rem] text-[var(--gray-500)] bg-[var(--paper)] border border-[var(--line)] rounded-full px-3 py-1 font-mono">
          reading.app/article
        </span>
      </div>

      {/* Browser Body */}
      <div ref={containerRef} className="relative p-6 sm:p-10 min-h-[240px]">
        <p className="text-[1.0625rem] leading-[1.8] text-[var(--ink-soft)]">
          Selection bias occurs when{' '}
          <span
            ref={targetRef}
            tabIndex={0}
            role="button"
            onClick={selectTarget}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectTarget();
              }
            }}
            aria-label="Explain this sentence with Clearly"
            className="bg-[var(--accent-soft)] text-[var(--ink)] rounded px-1 py-0.5 cursor-pointer font-medium border-b border-[var(--accent)]"
          >
            the sample used in a study isn't representative of the population it claims to describe
          </span>
          , often because participants selected themselves into the group being observed. This skews results in ways that are easy to miss and hard to correct for after the fact.
        </p>

        {/* Floating Clearly Pill */}
        <div
          ref={pillRef}
          role="button"
          tabIndex={0}
          onClick={openCard}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openCard();
            }
          }}
          aria-label="Explain with Clearly"
          style={{
            left: `${pillPos.left}px`,
            top: `${pillPos.top}px`,
            transition: 'opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)',
          }}
          className={`absolute z-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.8125rem] font-medium rounded-full cursor-pointer select-none glass-pill ${
            pillVisible
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-1 scale-95 pointer-events-none'
          }`}
        >
          <span className="brand-mark" aria-hidden="true" />
          <span>Explain</span>
        </div>

        {/* Floating Explanation Card */}
        <div
          role="dialog"
          aria-label="Clearly explanation"
          style={{
            left: `${cardPos.left}px`,
            top: `${cardPos.top}px`,
            transition: 'opacity var(--dur-med) var(--ease), transform var(--dur-med) var(--ease)',
          }}
          className={`absolute z-30 w-[min(340px,90%)] p-5 glass-card ${
            cardVisible
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={closeCard}
            aria-label="Close explanation"
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[var(--gray-600)] hover:bg-[var(--line)] text-sm"
          >
            ×
          </button>
          <div className="text-[0.75rem] text-[var(--gray-600)] mb-2 font-medium">Simple</div>
          <div className="text-[0.9375rem] leading-[1.55] text-[var(--ink)]">
            When you study a group that isn't a fair sample of everyone, your conclusions can be wrong — even if your math is perfect.
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-[0.8125rem]">
            <Link to="/product" className="text-[var(--gray-600)] hover:text-[var(--ink)] underline">
              See all 10 lenses
            </Link>
            <span className="text-[0.75rem] font-mono text-[var(--gray-500)]">In-place • BYOK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
