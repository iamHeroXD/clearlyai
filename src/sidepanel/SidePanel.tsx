import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ExtensionSettings,
  DEFAULT_SETTINGS,
  ExplanationMode,
  StructuredExplanation,
  HistoryItem,
} from '../types';
import { QuickQuiz } from '../content/components/QuickQuiz';

export const SidePanel: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [inputText, setInputText] = useState('');
  const [currentMode, setCurrentMode] = useState<ExplanationMode>('explain');
  const [explanation, setExplanation] = useState<StructuredExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'copilot' | 'paper' | 'history'>('copilot');

  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load Settings
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (res) => {
        if (res?.success && res.data) {
          setSettings(res.data);
        }
      });
      chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (res) => {
        if (res?.success && res.data) {
          setHistoryItems(res.data);
        }
      });
    }
  }, []);

  // Listen for incoming selection messages from Background Script / Context Menu
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'EXPLAIN_IN_SIDEPANEL' || message.type === 'TRIGGER_EXPLAIN_ACTION') {
        const text = message.payload?.text || '';
        const mode = message.payload?.mode || 'explain';
        if (text) {
          setInputText(text);
          setCurrentMode(mode);
          requestExplanation(text, mode);
        }
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }
    return () => {
      if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, [settings.defaultLanguage]);

  // Request explanation from background
  const requestExplanation = useCallback(
    (textToExplain: string, mode: ExplanationMode, followUp?: string) => {
      if (!textToExplain.trim()) return;

      setLoading(true);
      setError(null);

      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage(
          {
            type: 'EXPLAIN_TEXT',
            payload: {
              text: textToExplain,
              mode: mode,
              targetLanguage: settings.defaultLanguage,
              followUpQuery: followUp,
            },
          },
          (res) => {
            setLoading(false);
            if (res?.success && res.data) {
              setExplanation(res.data);
              chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (histRes) => {
                if (histRes?.success && histRes.data) {
                  setHistoryItems(histRes.data);
                }
              });
            } else {
              setError(res?.error || 'Failed to explain text.');
            }
          }
        );
      }
    },
    [settings.defaultLanguage]
  );

  // Ask Follow-up Chat Question
  const handleSendChat = () => {
    if (!chatQuery.trim() || !inputText.trim()) return;

    const userMsg = chatQuery.trim();
    setChatHistory((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatQuery('');
    setLoading(true);

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          type: 'EXPLAIN_TEXT',
          payload: {
            text: inputText,
            mode: 'explain',
            targetLanguage: settings.defaultLanguage,
            followUpQuery: userMsg,
          },
        },
        (res) => {
          setLoading(false);
          if (res?.success && res.data) {
            const reply = res.data.summary || res.data.rawText || 'Got it!';
            setChatHistory((prev) => [...prev, { role: 'assistant', text: reply }]);
          } else {
            setChatHistory((prev) => [
              ...prev,
              { role: 'assistant', text: 'Sorry, I could not process that question.' },
            ]);
          }
        }
      );
    }
  };

  // Text to Speech
  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead =
      explanation?.simplifiedText || explanation?.summary || inputText;

    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = settings.voiceSpeed || 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openPdfReader = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('reader.html') });
    } else {
      window.open('reader.html', '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col font-sans text-sm bg-[#FDFBF7] text-[#292524] select-text selection:bg-orange-200 selection:text-orange-950">
      {/* Top Header */}
      <div className="p-3.5 border-b border-orange-100/80 bg-white/80 backdrop-blur-xl flex items-center justify-between shadow-[0_2px_10px_rgba(249,115,22,0.03)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/25 ring-1 ring-white/60">
            ✨
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              Clearly Copilot
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 font-semibold border border-orange-500/20">
                PDF & Web
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-stone-100/80 border border-stone-200/60 p-0.5 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'copilot'
                ? 'bg-white text-orange-600 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Copilot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paper')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'paper'
                ? 'bg-white text-orange-600 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📄 Paper
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white text-orange-600 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* PDF Quick Launch Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/60 flex items-center justify-between gap-2 shadow-xs">
          <div className="text-xs">
            <div className="font-semibold text-orange-700 flex items-center gap-1">
              <span>📖</span> Clearly PDF Studio
            </div>
            <div className="text-[11px] text-stone-500 leading-tight">
              Open research papers with hover floating pills
            </div>
          </div>
          <button
            type="button"
            onClick={openPdfReader}
            className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-semibold shrink-0 transition-transform active:scale-95 shadow-sm shadow-orange-500/20"
          >
            Open ↗
          </button>
        </div>

        {activeTab === 'copilot' && (
          <>
            {/* Input / Selection Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                <span>Selected Text or Topic</span>
                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('');
                      setExplanation(null);
                      setError(null);
                    }}
                    className="text-[11px] text-stone-400 hover:text-orange-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Select any text on a webpage or PDF (or paste text here)..."
                rows={3}
                className="w-full text-xs p-3 rounded-2xl border border-orange-100/90 bg-white/90 text-stone-800 outline-none focus:ring-2 focus:ring-orange-400/40 font-sans resize-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              />
            </div>

            {/* Quick Action Modes */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'explain', label: '💡 Explain', mode: 'explain' as ExplanationMode },
                { id: 'simplify', label: '✨ Simplify', mode: 'simplify' as ExplanationMode },
                { id: 'summarize', label: '📝 Summarize', mode: 'summarize' as ExplanationMode },
                { id: 'math', label: '📐 Math & Eq', mode: 'math' as ExplanationMode },
                { id: 'code', label: '💻 Hardware/Code', mode: 'code' as ExplanationMode },
                { id: 'define', label: '📖 Define', mode: 'define' as ExplanationMode },
                { id: 'learning', label: '🎓 Quiz Me', mode: 'learning' as ExplanationMode },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setCurrentMode(m.mode);
                    requestExplanation(inputText, m.mode);
                  }}
                  disabled={!inputText.trim() || loading}
                  className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all ${
                    currentMode === m.mode
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20'
                      : 'bg-white/90 border border-stone-200/80 text-stone-700 hover:border-orange-300'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="p-4 rounded-2xl bg-white/80 border border-orange-100 text-center space-y-2">
                <div className="inline-block w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-stone-500 font-medium">Deconstructing with AI...</div>
              </div>
            )}

            {/* Error Message */}
            {error && !loading && (
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-800">
                ⚠️ {error}
              </div>
            )}

            {/* Explanation Result Card */}
            {explanation && !loading && (
              <div className="p-4 rounded-2xl bg-white border border-orange-100/90 shadow-[0_4px_20px_rgba(249,115,22,0.05)] space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✨</span> {explanation.title || currentMode.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleSpeech}
                      title={isSpeaking ? 'Stop speech' : 'Read aloud'}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        isSpeaking
                          ? 'bg-orange-500 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {isSpeaking ? '⏹' : '🔊'}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(explanation.summary || explanation.simplifiedText || '')}
                      className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 text-xs transition-colors"
                      title="Copy explanation"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="text-xs text-stone-800 leading-relaxed space-y-2.5">
                  <p>{explanation.summary || explanation.simplifiedText || explanation.rawText}</p>

                  {/* Example */}
                  {explanation.example && (
                    <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/60 text-stone-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-700 mb-1">
                        Analogy & Intuition
                      </div>
                      <div>{explanation.example}</div>
                    </div>
                  )}

                  {/* Why It Matters */}
                  {explanation.whyItMatters && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-stone-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                        Key Takeaway
                      </div>
                      <div>{explanation.whyItMatters}</div>
                    </div>
                  )}

                  {/* Math Breakdown */}
                  {explanation.mathBreakdown && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-orange-200/60 text-stone-800 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        📐 Equations & Logic Decoded
                      </div>
                      <div className="font-semibold text-stone-900">{explanation.mathBreakdown.concept}</div>
                      <div>{explanation.mathBreakdown.whatItMeans}</div>
                      {explanation.mathBreakdown.steps && (
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] mt-1 text-stone-600">
                          {explanation.mathBreakdown.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Code Breakdown */}
                  {explanation.codeBreakdown && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                        💻 Architecture & Hardware
                      </div>
                      <div className="font-medium text-stone-900">{explanation.codeBreakdown.whatItDoes}</div>
                      {explanation.codeBreakdown.keyParts && (
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-stone-600">
                          {explanation.codeBreakdown.keyParts.map((part, idx) => (
                            <li key={idx}>{part}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {explanation.learningQuiz && (
                    <QuickQuiz quiz={explanation.learningQuiz} />
                  )}
                </div>
              </div>
            )}

            {/* Follow-up Section */}
            {explanation && (
              <div className="p-3.5 rounded-2xl bg-white/80 border border-orange-100/90 space-y-2 shadow-xs">
                <div className="text-xs font-semibold text-stone-700">
                  💬 Ask a Follow-up Question
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="e.g. How does SRAM constraint affect this?"
                    className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-800 outline-none focus:ring-2 focus:ring-orange-400/40"
                  />
                  <button
                    type="button"
                    onClick={handleSendChat}
                    disabled={!chatQuery.trim() || loading}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-40"
                  >
                    Ask
                  </button>
                </div>

                {chatHistory.length > 0 && (
                  <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                    {chatHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl text-xs ${
                          item.role === 'user'
                            ? 'bg-orange-50 text-orange-950 ml-4 font-medium border border-orange-100'
                            : 'bg-stone-50 text-stone-800 mr-4 border border-stone-200/60'
                        }`}
                      >
                        <div className="text-[10px] text-stone-400 font-bold mb-0.5">
                          {item.role === 'user' ? 'You' : 'Clearly Copilot'}
                        </div>
                        <div>{item.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Paper Studio Tab */}
        {activeTab === 'paper' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-orange-100/90 space-y-3 shadow-xs">
              <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <span>📑</span> Research Paper Quick Recipes
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Reading academic papers, microcontroller studies (like ESP32-S3 Xtensa LX7), or engineering manuscripts?
              </p>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('copilot');
                    if (inputText) requestExplanation(inputText, 'summarize', 'Summarize the core hypothesis, platform specifications, and experimental findings in structured bullet points.');
                  }}
                  className="w-full text-left p-3 rounded-xl border border-stone-200/70 hover:border-orange-400/70 bg-[#FDFCF9] text-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-stone-800">📊 Executive Paper Summary</div>
                    <div className="text-[11px] text-stone-400">Hypothesis, Platform Specs, Results</div>
                  </div>
                  <span className="text-orange-600 font-bold">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('copilot');
                    if (inputText) requestExplanation(inputText, 'code', 'Explain the memory hierarchy (SRAM vs PSRAM), recurrent weight sharing, low-bit quantization, and device-side communication costs in plain, intuitive terms.');
                  }}
                  className="w-full text-left p-3 rounded-xl border border-stone-200/70 hover:border-orange-400/70 bg-[#FDFCF9] text-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-stone-800">⚡ Hardware & Memory Constraints</div>
                    <div className="text-[11px] text-stone-400">SRAM vs PSRAM, Quantization, Xtensa LX7</div>
                  </div>
                  <span className="text-orange-600 font-bold">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('copilot');
                    if (inputText) requestExplanation(inputText, 'learning', 'Generate 3 high-yield conceptual quiz questions to test my understanding of this research section.');
                  }}
                  className="w-full text-left p-3 rounded-xl border border-stone-200/70 hover:border-orange-400/70 bg-[#FDFCF9] text-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-stone-800">🧠 Generate Paper Flashcards</div>
                    <div className="text-[11px] text-stone-400">Test core principles</div>
                  </div>
                  <span className="text-orange-600 font-bold">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>Saved Explanations ({historyItems.length})</span>
            </div>

            {historyItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                No saved explanations yet. Select text on any PDF or webpage to get started!
              </div>
            ) : (
              historyItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setInputText(item.originalText);
                    setExplanation(item.response);
                    setCurrentMode(item.mode);
                    setActiveTab('copilot');
                  }}
                  className="p-3 rounded-2xl bg-white border border-stone-200/70 hover:border-orange-300 cursor-pointer transition-all space-y-1 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span className="font-semibold uppercase text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      {item.mode}
                    </span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="font-medium text-stone-800 line-clamp-1">
                    "{item.originalText}"
                  </div>
                  <div className="text-stone-500 text-[11px] line-clamp-2">
                    {item.response.summary || item.response.simplifiedText}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-orange-100/80 bg-white/70 flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          AI: <span className="font-semibold text-stone-700">{settings.activeProvider}</span>
        </span>
        <button
          type="button"
          onClick={openPdfReader}
          className="hover:underline text-orange-600 font-semibold"
        >
          PDF Studio ↗
        </button>
      </div>
    </div>
  );
};
