import React, { useState, useRef, useLayoutEffect } from 'react';
import { StructuredExplanation, ExplanationMode } from '../../types';
import { PositionCoordinates, Rect } from '../../services/positioning';

interface ExplanationCardProps {
  position: PositionCoordinates;
  selectionRect?: Rect;
  isDark: boolean;
  loading: boolean;
  error?: string | null;
  data?: StructuredExplanation | null;
  isEditable?: boolean;
  onClose: () => void;
  onFollowUp: (query: string) => void;
  onRetry: () => void;
  onModeSwitch: (mode: ExplanationMode) => void;
  onReplaceText?: (text: string) => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  position,
  selectionRect,
  isDark,
  loading,
  error,
  data,
  isEditable,
  onClose,
  onFollowUp,
  onRetry,
  onModeSwitch,
  onReplaceText,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [adjustedPos, setAdjustedPos] = useState<PositionCoordinates>(position);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamically re-anchor and clamp card when content height changes
  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const cardEl = cardRef.current;
    const cardWidth = cardEl.offsetWidth || 340;
    const cardHeight = cardEl.offsetHeight || 220;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let targetX = position.x;
    let targetY = position.y;

    if (selectionRect) {
      const spaceBelow = viewportHeight - selectionRect.bottom - 12;
      const spaceAbove = selectionRect.top - 12;

      // If placing below overflows the screen and there's space above, flip above
      if (spaceBelow < cardHeight && spaceAbove >= cardHeight) {
        targetY = selectionRect.top - cardHeight - 8;
      } else if (spaceBelow >= cardHeight) {
        targetY = selectionRect.bottom + 8;
      } else {
        if (spaceAbove > spaceBelow) {
          targetY = Math.max(12, selectionRect.top - cardHeight - 8);
        } else {
          targetY = Math.min(selectionRect.bottom + 8, viewportHeight - cardHeight - 12);
        }
      }

      targetX = selectionRect.left + (selectionRect.width / 2) - (cardWidth / 2);
    }

    // Strict Screen Bounds Clamping
    const finalX = Math.max(12, Math.min(targetX, viewportWidth - cardWidth - 12));
    const finalY = Math.max(12, Math.min(targetY, viewportHeight - cardHeight - 12));

    setAdjustedPos({ x: finalX, y: finalY, placement: position.placement });
  }, [position, selectionRect, data, loading, error, showPrivacy]);

  const handleCopy = () => {
    let textToCopy = '';
    if (data) {
      if (data.rewrittenText) textToCopy = data.rewrittenText;
      else if (data.defineBreakdown) textToCopy = `${data.defineBreakdown.word}: ${data.defineBreakdown.definition}`;
      else if (data.simplifiedText) textToCopy = data.simplifiedText;
      else if (data.translatedText) textToCopy = data.translatedText;
      else {
        textToCopy = data.summary;
        if (data.example) textToCopy += `\n\nExample: ${data.example}`;
      }
    }
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToSpeak = '';
    if (data?.defineBreakdown) {
      textToSpeak = `${data.defineBreakdown.word}. ${data.defineBreakdown.definition}`;
    } else {
      textToSpeak = data?.rewrittenText || data?.simplifiedText || data?.summary || '';
      if (data?.example) textToSpeak += `. Example: ${data.example}`;
    }

    if (textToSpeak) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (res) => {
        if (res?.data?.[0]?.id) {
          chrome.runtime.sendMessage({
            type: 'TOGGLE_STAR_HISTORY_ITEM',
            payload: { id: res.data[0].id },
          });
        }
      });
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onFollowUp(customInput.trim());
    setCustomInput('');
  };

  // Determine current active mode
  const activeMode = data?.mode || 'explain';

  return (
    <div
      ref={cardRef}
      className={`clearly-card ${isDark ? 'dark' : ''}`}
      style={{
        left: `${adjustedPos.x}px`,
        top: `${adjustedPos.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header */}
      <div className="clearly-card-header">
        <div className="clearly-header-brand">
          <span className="clearly-brand-mark" aria-hidden="true" />
          <span className="clearly-header-brand-title">Clearly</span>
        </div>

        <div className="clearly-header-actions">
          {data && !loading && (
            <>
              {/* Speaker / Pronunciation */}
              <button
                type="button"
                className={`clearly-icon-btn ${isSpeaking ? 'active' : ''}`}
                onClick={handleSpeak}
                title={isSpeaking ? 'Stop audio' : 'Listen to pronunciation'}
                aria-label="Listen"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                  <path d="M16.5 8.5a5 5 0 0 1 0 7"/>
                </svg>
              </button>

              {/* Star to notebook */}
              <button
                type="button"
                className={`clearly-icon-btn ${isStarred ? 'starred' : ''}`}
                onClick={handleToggleStar}
                title={isStarred ? 'Saved to knowledge notebook' : 'Star word to notebook'}
                aria-label="Star"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>

              {/* Copy */}
              <button
                type="button"
                className="clearly-icon-btn"
                onClick={handleCopy}
                title={copied ? 'Copied' : 'Copy'}
                aria-label="Copy"
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </>
          )}

          {/* Privacy info */}
          <button
            type="button"
            className="clearly-icon-btn"
            onClick={() => setShowPrivacy(!showPrivacy)}
            title="Privacy: what is sent"
            aria-label="Privacy"
          >
            ⓘ
          </button>

          {/* Close */}
          <button
            type="button"
            className="clearly-icon-btn"
            onClick={onClose}
            title="Dismiss (Esc)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 6 Lenses Segmented Tabs Bar */}
      <div className="clearly-lenses-bar">
        <button
          type="button"
          className={`clearly-lens-tab ${activeMode === 'explain' || activeMode === 'define' ? 'active' : ''}`}
          onClick={() => onModeSwitch('explain')}
        >
          Simple
        </button>
        <button
          type="button"
          className={`clearly-lens-tab ${activeMode === 'simplify' ? 'active' : ''}`}
          onClick={() => onModeSwitch('simplify')}
        >
          ELI5
        </button>
        <button
          type="button"
          className={`clearly-lens-tab ${activeMode === 'grammar' ? 'active' : ''}`}
          onClick={() => onModeSwitch('grammar')}
        >
          Grammar
        </button>
        <button
          type="button"
          className={`clearly-lens-tab ${activeMode === 'rephrase' ? 'active' : ''}`}
          onClick={() => onModeSwitch('rephrase')}
        >
          Professional
        </button>
        <button
          type="button"
          className={`clearly-lens-tab ${activeMode === 'code' || activeMode === 'math' ? 'active' : ''}`}
          onClick={() => onModeSwitch('code')}
        >
          Code
        </button>
        <button
          type="button"
          className={`clearly-lens-tab ${activeMode === 'tldr' ? 'active' : ''}`}
          onClick={() => onModeSwitch('tldr')}
        >
          TL;DR
        </button>
      </div>

      {/* Privacy Notice Box */}
      {showPrivacy && (
        <div className="clearly-privacy-box">
          <strong>Your words stay yours.</strong> Only selected text is processed. Never tracks full history or webpage contents.
        </div>
      )}

      {/* Card Content Body */}
      <div className="clearly-card-body">
        {loading && (
          <div className="clearly-loading-container">
            <div className="clearly-loading-status">
              <span className="clearly-brand-mark" aria-hidden="true" />
              <span>Understanding text…</span>
            </div>
            <div className="clearly-shimmer-line" />
            <div className="clearly-shimmer-line short" />
          </div>
        )}

        {!loading && error && (
          <div className="clearly-error-box">
            <div className="clearly-error-headline">
              <span>Couldn't complete request</span>
            </div>
            <div className="clearly-error-detail">
              {error.includes('context invalidated') || error.includes('Extension context')
                ? 'Clearly was updated. Please refresh this tab to reconnect.'
                : error}
            </div>
            <button
              type="button"
              className="clearly-action-btn"
              onClick={error.includes('context invalidated') ? () => window.location.reload() : onRetry}
            >
              {error.includes('context invalidated') ? 'Refresh Page' : 'Retry'}
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="clearly-content-wrapper">
            
            {/* 1. Definition / Single Word Breakdown */}
            {data.defineBreakdown && (
              <div className="clearly-section">
                <div className="clearly-word-header">
                  <span className="clearly-word-title">{data.defineBreakdown.word}</span>
                  {data.defineBreakdown.partOfSpeech && (
                    <span className="clearly-word-pos">({data.defineBreakdown.partOfSpeech})</span>
                  )}
                  {(data.defineBreakdown.phonetic || data.phoneticSpelling) && (
                    <span className="clearly-word-ipa">
                      {data.defineBreakdown.phonetic || data.phoneticSpelling}
                    </span>
                  )}
                </div>
                <div className="clearly-text-body">
                  {data.defineBreakdown.definition}
                </div>
                {data.defineBreakdown.example && (
                  <div className="clearly-example-box">
                    "{data.defineBreakdown.example}"
                  </div>
                )}
                {data.defineBreakdown.similarWords && data.defineBreakdown.similarWords.length > 0 && (
                  <div className="clearly-synonyms">
                    <span className="font-semibold">Similar:</span> {data.defineBreakdown.similarWords.join(', ')}
                  </div>
                )}
              </div>
            )}

            {/* 2. Rewritten Text (Writing / Polish / Professional Modes) */}
            {data.rewrittenText && (
              <div className="clearly-section">
                <div className="clearly-section-label">Polished Draft</div>
                <div className="clearly-text-body clearly-polished-text">
                  "{data.rewrittenText}"
                </div>
                {onReplaceText && (
                  <button
                    type="button"
                    className="clearly-replace-btn"
                    onClick={() => onReplaceText(data.rewrittenText!)}
                  >
                    <span>↵</span>
                    <span>Replace highlighted text</span>
                  </button>
                )}
              </div>
            )}

            {/* 3. In-place Replacement for editable inputs if non-polish mode */}
            {!data.rewrittenText && isEditable && onReplaceText && (data.simplifiedText || data.summary) && (
              <div className="clearly-section">
                <button
                  type="button"
                  className="clearly-replace-btn"
                  onClick={() => onReplaceText(data.simplifiedText || data.summary)}
                >
                  <span>↵</span>
                  <span>Replace highlighted text</span>
                </button>
              </div>
            )}

            {/* 4. 3-Bullet TL;DR */}
            {data.tldrPoints && data.tldrPoints.length > 0 && (
              <div className="clearly-section">
                <div className="clearly-section-label">Key Takeaways</div>
                <ul className="clearly-bullets">
                  {data.tldrPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Code Breakdown */}
            {data.codeBreakdown && (
              <div className="clearly-section">
                <div className="clearly-section-label">What this code does</div>
                <div className="clearly-text-body font-mono text-xs">{data.codeBreakdown.whatItDoes}</div>
                {data.codeBreakdown.keyParts && data.codeBreakdown.keyParts.length > 0 && (
                  <ul className="clearly-bullets font-mono text-xs mt-2">
                    {data.codeBreakdown.keyParts.map((part, i) => (
                      <li key={i}>{part}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 6. Legal Analysis */}
            {data.legalFlags && (
              <div className="clearly-section clearly-legal-box">
                <div className="clearly-legal-badge">
                  ⚖️ Risk: {data.legalFlags.riskLevel.toUpperCase()}
                </div>
                <div className="clearly-text-body">{data.legalFlags.summary}</div>
                {data.legalFlags.flags && data.legalFlags.flags.length > 0 && (
                  <ul className="clearly-bullets mt-2">
                    {data.legalFlags.flags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 7. Simple / General Explanation Summary */}
            {!data.defineBreakdown && !data.rewrittenText && !data.codeBreakdown && !data.legalFlags && !data.tldrPoints && (
              <div className="clearly-section">
                <div className="clearly-text-body">
                  {data.simplifiedText || data.summary}
                </div>
                {data.example && (
                  <div className="clearly-example-box">
                    "{data.example}"
                  </div>
                )}
                {data.whyItMatters && (
                  <div className="clearly-why-box">
                    <span className="font-semibold text-[var(--accent)]">Why it matters:</span> {data.whyItMatters}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Footer Ask Field */}
      {!loading && !error && (
        <div className="clearly-card-footer">
          <form onSubmit={handleCustomSubmit} className="clearly-input-container">
            <input
              type="text"
              className="clearly-input"
              placeholder="Ask about this…"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button
              type="submit"
              className="clearly-submit-btn"
              disabled={!customInput.trim()}
              aria-label="Submit follow up"
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
