import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FloatingPill } from './FloatingPill';
import { ExplanationCard } from './ExplanationCard';
import { getActiveSelection, SelectionData } from '../../services/selection';
import { calculatePillPosition, calculateCardPosition, PositionCoordinates } from '../../services/positioning';
import { detectCode } from '../../utils/codeDetector';
import { detectMath } from '../../utils/mathDetector';
import { isEditableElement, replaceSelectedText } from '../../services/editable';
import { ExplanationMode, StructuredExplanation, ExtensionSettings, DEFAULT_SETTINGS } from '../../types';

export const ContentApp: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [currentSelection, setCurrentSelection] = useState<SelectionData | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [pillPos, setPillPos] = useState<PositionCoordinates | null>(null);
  const [cardPos, setCardPos] = useState<PositionCoordinates | null>(null);
  const [showPill, setShowPill] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanationData, setExplanationData] = useState<StructuredExplanation | null>(null);
  const [currentMode, setCurrentMode] = useState<ExplanationMode>('explain');
  const [isDark, setIsDark] = useState(false);

  const activeReqRef = useRef<number>(0);

  // Fetch extension settings and sync theme
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      try {
        chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (res) => {
          if (chrome.runtime.lastError) return;
          if (res?.success && res.data) {
            setSettings(res.data);
            updateTheme(res.data.theme);
          }
        });
      } catch (e) {
        // Safe catch for context invalidation
      }
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      updateTheme(settings.theme);
    };
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [settings.theme]);

  const updateTheme = (themePref: string) => {
    if (themePref === 'dark') {
      setIsDark(true);
    } else if (themePref === 'light') {
      setIsDark(false);
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  };

  const dismissAll = useCallback(() => {
    setShowPill(false);
    setShowCard(false);
    setLoading(false);
    setError(null);
  }, []);

  // Request explanation from background worker
  const requestExplanation = useCallback(
    async (mode: ExplanationMode, targetLang?: string, followUp?: string) => {
      if (!currentSelection) return;

      setShowPill(false);
      setShowCard(true);
      setLoading(true);
      setError(null);
      setCurrentMode(mode);

      // Recalculate card position
      const pos = calculateCardPosition(currentSelection.rect);
      setCardPos(pos);

      const requestId = ++activeReqRef.current;

      try {
        if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
          throw new Error('Extension was reloaded. Please refresh this page.');
        }

        chrome.runtime.sendMessage(
          {
            type: 'EXPLAIN_TEXT',
            payload: {
              text: currentSelection.text,
              contextBefore: currentSelection.contextBefore,
              contextAfter: currentSelection.contextAfter,
              mode: mode,
              targetLanguage: targetLang || settings.defaultLanguage,
              followUpQuery: followUp,
              pageTitle: document.title,
              pageUrl: window.location.href,
            },
          },
          (response) => {
            if (activeReqRef.current !== requestId) return;

            if (chrome.runtime.lastError) {
              setLoading(false);
              const errMsg = chrome.runtime.lastError.message || '';
              if (errMsg.includes('context invalidated') || errMsg.includes('Extension context')) {
                setError('Clearly was reloaded in Chrome. Refresh this page to reconnect.');
              } else {
                setError(errMsg);
              }
              return;
            }

            setLoading(false);
            if (response?.success && response.data) {
              setExplanationData(response.data);
            } else {
              setError(response?.error || 'Could not explain text. Please check your AI Provider settings.');
            }
          }
        );
      } catch (err: any) {
        if (activeReqRef.current === requestId) {
          setLoading(false);
          const msg = err?.message || '';
          if (msg.includes('context invalidated') || msg.includes('Extension context')) {
            setError('Clearly was reloaded in Chrome. Refresh this page to reconnect.');
          } else {
            setError(msg || 'Failed to communicate with Clearly.');
          }
        }
      }
    },
    [currentSelection, settings.defaultLanguage]
  );

  // Handle selection changes
  const handleSelection = useCallback(
    (isAltKeyHeld?: boolean) => {
      if (!settings.enabled || !settings.showFloatingButton) return;

      setTimeout(() => {
        const selection = getActiveSelection(settings.includeSurroundingContext);

        if (!selection || selection.text.length < 2) {
          if (!showCard) {
            setShowPill(false);
          }
          return;
        }

        if (selection.text.length > settings.maxSelectionLength) {
          return;
        }

        // Check if selection is within an editable context
        const activeEl = document.activeElement;
        const anchorEl = window.getSelection()?.anchorNode?.parentElement || null;
        const isEdit = isEditableElement(activeEl) || isEditableElement(anchorEl);
        setIsEditable(isEdit);

        setCurrentSelection(selection);
        const pos = calculatePillPosition(selection.rect);
        setPillPos(pos);

        // Smart intent: single word/phrase -> define, sentence/longer text -> explain
        const words = selection.text.trim().split(/\s+/).filter(Boolean);
        const defaultMode: ExplanationMode = (words.length <= 3) ? 'define' : 'explain';

        // If Alt key was held and altKeyQuickPeek is enabled, trigger immediately
        if (isAltKeyHeld && settings.altKeyQuickPeek) {
          requestExplanation(defaultMode);
          return;
        }

        if (!showCard) {
          setShowPill(true);
        }
      }, 20);
    },
    [settings, showCard, requestExplanation]
  );

  // Global mouse and selection listeners
  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      const host = document.getElementById('clearly-host-container');
      if (host && host.contains(e.target as Node)) {
        return;
      }
      handleSelection(e.altKey);
    };

    const onMouseDown = (e: MouseEvent) => {
      const host = document.getElementById('clearly-host-container');
      if (host && host.contains(e.target as Node)) {
        return;
      }

      const sel = window.getSelection();
      const clickedInsideSelection = sel && sel.rangeCount > 0 && sel.getRangeAt(0).getBoundingClientRect().top <= e.clientY;

      if (!clickedInsideSelection) {
        dismissAll();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissAll();
      }
    };

    const onScroll = () => {
      dismissAll();
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [handleSelection, dismissAll]);

  // Context-aware selection type detection
  let detectedType: 'code' | 'math' | 'word' | 'paragraph' | 'text' | 'legal' = 'text';
  if (currentSelection) {
    const textLower = currentSelection.text.toLowerCase();
    const words = currentSelection.text.trim().split(/\s+/).filter(Boolean);
    if (
      textLower.includes('terms of service') ||
      textLower.includes('privacy policy') ||
      textLower.includes('indemnify') ||
      textLower.includes('binding arbitration') ||
      textLower.includes('class action waiver') ||
      textLower.includes('warranty') ||
      textLower.includes('liability')
    ) {
      detectedType = 'legal';
    } else if (detectCode(currentSelection.text).isCode) {
      detectedType = 'code';
    } else if (detectMath(currentSelection.text).isMath) {
      detectedType = 'math';
    } else if (words.length <= 3 && !currentSelection.text.includes('\n')) {
      detectedType = 'word';
    } else if (currentSelection.text.length > 220 || words.length > 35) {
      detectedType = 'paragraph';
    }
  }

  const handleReplace = (replacementText: string) => {
    replaceSelectedText(replacementText);
    dismissAll();
  };

  return (
    <>
      {showPill && pillPos && (
        <FloatingPill
          position={pillPos}
          isDark={isDark}
          isEditable={isEditable}
          detectedType={detectedType}
          selectedText={currentSelection?.text}
          onTrigger={(mode, lang) => requestExplanation(mode, lang)}
        />
      )}

      {showCard && cardPos && (
        <ExplanationCard
          position={cardPos}
          selectionRect={currentSelection?.rect}
          isDark={isDark}
          isEditable={isEditable}
          loading={loading}
          error={error}
          data={explanationData}
          onClose={dismissAll}
          onFollowUp={(query) => requestExplanation(currentMode, undefined, query)}
          onRetry={() => requestExplanation(currentMode)}
          onModeSwitch={(newMode) => requestExplanation(newMode)}
          onReplaceText={handleReplace}
        />
      )}
    </>
  );
};
