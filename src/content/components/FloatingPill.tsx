import React, { useState, useRef, useEffect } from 'react';
import { ExplanationMode } from '../../types';
import { CANONICAL_LENS_LIST } from '../../types/lenses';
import { PositionCoordinates } from '../../services/positioning';

interface FloatingPillProps {
  position: PositionCoordinates;
  isDark: boolean;
  onTrigger: (mode: ExplanationMode, targetLanguage?: string) => void;
  detectedType?: 'code' | 'math' | 'word' | 'paragraph' | 'text' | 'legal';
  isEditable?: boolean;
  selectedText?: string;
}

export const FloatingPill: React.FC<FloatingPillProps> = ({
  position,
  isDark,
  onTrigger,
  detectedType,
  selectedText = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleDocumentClick);
    return () => window.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const wordCount = selectedText.trim().split(/\s+/).filter(Boolean).length;
  const isSingleWord = wordCount <= 3;

  let primaryLabel = 'Simple';
  let primaryMode: ExplanationMode = 'simple';

  if (isSingleWord) {
    primaryLabel = 'Define';
    primaryMode = 'define';
  } else if (detectedType === 'code') {
    primaryLabel = 'Code';
    primaryMode = 'code';
  } else if (detectedType === 'math') {
    primaryLabel = 'Math';
    primaryMode = 'math';
  } else if (detectedType === 'legal') {
    primaryLabel = 'Legal';
    primaryMode = 'legal';
  }

  return (
    <div
      ref={pillRef}
      className={`clearly-pill ${isDark ? 'dark' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Brand Button triggers smart primary lens */}
      <button
        type="button"
        className="clearly-pill-btn"
        onClick={() => onTrigger(primaryMode)}
        title={`Clearly (${primaryLabel})`}
      >
        <span className="clearly-brand-mark" aria-hidden="true" />
        <span className="clearly-pill-brand-text">Clearly</span>
        <span className="clearly-pill-badge">{primaryLabel}</span>
      </button>

      <div className="clearly-pill-divider" />

      {/* Primary Action Quick Chips */}
      {primaryMode !== 'simple' && (
        <button
          type="button"
          className="clearly-pill-chip"
          onClick={() => onTrigger('simple')}
          title="Explain in simple terms"
        >
          Simple
        </button>
      )}

      <button
        type="button"
        className="clearly-pill-chip"
        onClick={() => onTrigger('eli5')}
        title="Explain Like I'm 5 with an analogy"
      >
        ELI5
      </button>

      {primaryMode !== 'define' && (
        <button
          type="button"
          className="clearly-pill-chip"
          onClick={() => onTrigger('define')}
          title="Dictionary definition & pronunciation"
        >
          Define
        </button>
      )}

      <button
        type="button"
        className="clearly-pill-chip"
        onClick={() => onTrigger('professional')}
        title="Executive active-voice rewrite"
      >
        Rewrite
      </button>

      <div className="clearly-pill-divider" />

      {/* More Lenses Menu */}
      <button
        type="button"
        className="clearly-pill-more-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        title="More lenses (Code, Math, Legal, TL;DR, Translate)"
        aria-label="More lenses"
      >
        <span style={{ fontSize: '11px', fontWeight: 500, marginRight: '3px' }}>More</span>
        <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </button>

      {menuOpen && (
        <div className="clearly-menu">
          {CANONICAL_LENS_LIST.map((lens) => (
            <button
              key={lens.id}
              type="button"
              className="clearly-menu-item"
              onClick={() => {
                setMenuOpen(false);
                onTrigger(lens.id);
              }}
            >
              <span className="clearly-menu-icon">{lens.icon}</span>
              <span className="clearly-menu-label">{lens.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
