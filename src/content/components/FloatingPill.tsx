import React, { useState, useRef, useEffect } from 'react';
import { ExplanationMode } from '../../types';
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

  let primaryLabel = 'Explain';
  let primaryMode: ExplanationMode = 'explain';

  // Smart Intent Resolution
  if (isSingleWord) {
    // Single word / short phrase always defaults to Meaning / Definition
    primaryLabel = 'Define';
    primaryMode = 'define';
  } else if (detectedType === 'code') {
    primaryLabel = 'Code';
    primaryMode = 'code';
  } else if (detectedType === 'math') {
    primaryLabel = 'Math';
    primaryMode = 'math';
  } else if (detectedType === 'legal') {
    primaryLabel = 'Scan Risks';
    primaryMode = 'legal';
  } else if (detectedType === 'paragraph') {
    primaryLabel = 'TL;DR';
    primaryMode = 'tldr';
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
      {/* Brand Mark + Action Button */}
      <button
        type="button"
        className="clearly-pill-btn"
        onClick={() => onTrigger(primaryMode)}
        title={`${primaryLabel} (Click or press Alt+C)`}
      >
        <span className="clearly-brand-mark" aria-hidden="true" />
        <span className="clearly-pill-brand-text">Clearly</span>
        <span className="clearly-pill-badge">{primaryLabel}</span>
      </button>

      <div className="clearly-pill-divider" />

      {/* More Lenses Menu */}
      <button
        type="button"
        className="clearly-pill-more-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        title="Choose a specific lens"
        aria-label="Choose lens"
      >
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </button>

      {menuOpen && (
        <div className="clearly-menu">
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('explain');
            }}
          >
            <span>✨</span> Simple Meaning
          </button>
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('define');
            }}
          >
            <span>📖</span> Dictionary Definition
          </button>
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('simplify');
            }}
          >
            <span>👶</span> ELI5 (Analogy)
          </button>
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('grammar');
            }}
          >
            <span>✍️</span> Grammar Fix
          </button>
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('rephrase');
            }}
          >
            <span>👔</span> Professional Tone
          </button>
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('code');
            }}
          >
            <span>💻</span> Code &amp; Math
          </button>
          <button
            type="button"
            className="clearly-menu-item"
            onClick={() => {
              setMenuOpen(false);
              onTrigger('legal');
            }}
          >
            <span>⚖️</span> Scan Legal Risks
          </button>
        </div>
      )}
    </div>
  );
};
