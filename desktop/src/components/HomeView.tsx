import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Copy, 
  Check, 
  RotateCcw,
  UploadCloud,
  FileText,
  ClipboardPaste,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { ExplanationMode, StructuredExplanation } from '../types';
import { explainText, playTextAudio } from '../services/desktopAiService';

interface HomeViewProps {
  onSaveToHistory: (exp: StructuredExplanation) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  activeProvider: string;
  geminiApiKey?: string;
  defaultMode: ExplanationMode;
}

const CANONICAL_LENSES: { id: ExplanationMode; label: string; icon: string; desc: string }[] = [
  { id: 'simple', label: 'Simple', icon: '✨', desc: '1-2 sentence core point' },
  { id: 'eli5', label: 'ELI5', icon: '🐣', desc: 'Everyday intuitive analogy' },
  { id: 'define', label: 'Define', icon: '📖', desc: 'Dictionary & IPA breakdown' },
  { id: 'grammar', label: 'Grammar', icon: '✍️', desc: 'Typos and punctuation cleanup' },
  { id: 'professional', label: 'Polish', icon: '💼', desc: 'Executive active-voice rewrite' },
  { id: 'code', label: 'Code', icon: '💻', desc: 'Syntax, logic flow & bugs' },
  { id: 'math', label: 'Math', icon: '📐', desc: 'Formula notation decoding' },
  { id: 'legal', label: 'Legal', icon: '⚖️', desc: 'Contract risk radar' },
  { id: 'tldr', label: 'TL;DR', icon: '⚡', desc: '3 high-signal takeaways' },
  { id: 'translate', label: 'Translate', icon: '🌐', desc: 'Fluent cross-lingual translation' },
];

const SAMPLES = [
  {
    title: 'Biology / Photosynthesis',
    text: 'Photosynthesis is the process by which autotrophic organisms convert light energy into chemical energy, synthesizing glucose from carbon dioxide and water while releasing molecular oxygen.',
    mode: 'simple' as ExplanationMode,
  },
  {
    title: 'Quantum Computing',
    text: 'Quantum superposition allows qubits to exist as linear combinations of orthogonal basis states |0⟩ and |1⟩ simultaneously, exponentially expanding computational state space.',
    mode: 'eli5' as ExplanationMode,
  },
  {
    title: 'Terms of Service Clause',
    text: 'You agree that any dispute, claim, or controversy arising out of or relating to this Agreement shall be settled exclusively by binding, individual arbitration, and you waive any right to participate in a class action lawsuit.',
    mode: 'legal' as ExplanationMode,
  },
  {
    title: 'Algorithm Complexity',
    text: 'The function traverses an adjacency matrix of size N x N using nested loops, performing constant-time lookups on each edge pair, resulting in quadratic time complexity O(N^2).',
    mode: 'code' as ExplanationMode,
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onSaveToHistory,
  onShowToast,
  activeProvider,
  geminiApiKey,
  defaultMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<ExplanationMode>(defaultMode || 'simple');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [currentExplanation, setCurrentExplanation] = useState<StructuredExplanation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunExplain = async (textToProcess: string, modeToUse: ExplanationMode) => {
    const text = textToProcess.trim();
    if (!text) {
      onShowToast('Please paste or enter some text first', 'info');
      return;
    }

    setIsLoading(true);
    try {
      const result = await explainText(text, modeToUse, activeProvider, geminiApiKey);
      setCurrentExplanation(result);
      onSaveToHistory(result);
    } catch (e: any) {
      onShowToast(e?.message || 'Explanation failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setInputText(text.trim());
        handleRunExplain(text.trim(), selectedMode);
        onShowToast('Pasted from clipboard and analyzed', 'success');
      } else {
        onShowToast('Clipboard is empty', 'info');
      }
    } catch {
      onShowToast('Clipboard read access was blocked. Please paste into the workbench.', 'info');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setInputText(text);
          handleRunExplain(text, selectedMode);
          onShowToast(`Loaded "${file.name}"`, 'success');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setInputText('');
    setCurrentExplanation(null);
    setFileName(null);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8 select-none animate-fade-in">
      {/* Hero Welcome */}
      {!currentExplanation && !isLoading && (
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--ink-soft)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Clearly Reader Studio v1.0.0
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Highlight anything. Understand it instantly.
          </h1>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
            Paste an excerpt, contract clause, code snippet, or research abstract to deconstruct it across Clearly's 10 canonical lenses.
          </p>
        </div>
      )}

      {/* Main Text Workbench Input */}
      <div className="p-6 rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] shadow-[var(--shadow-md)] space-y-4">
        {/* Lenses Segmented Tabs Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] flex-wrap gap-2">
          <div className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5 font-mono">
            <span>Canonical Lens:</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none" role="tablist">
            {CANONICAL_LENSES.map((lens) => {
              const isActive = selectedMode === lens.id;
              return (
                <button
                  key={lens.id}
                  onClick={() => {
                    setSelectedMode(lens.id);
                    if (inputText.trim()) {
                      handleRunExplain(inputText, lens.id);
                    }
                  }}
                  title={lens.desc}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold shadow-sm'
                      : 'bg-[var(--paper-raised)] text-[var(--ink-soft)] hover:text-[var(--ink)] border border-[var(--line)]'
                  }`}
                >
                  <span>{lens.icon}</span>
                  <span>{lens.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleRunExplain(inputText, selectedMode);
              }
            }}
            placeholder="Paste text, excerpt, research paper, code, or drop a file to deconstruct..."
            rows={currentExplanation ? 4 : 6}
            className="w-full p-4 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line)] text-sm text-[var(--ink)] placeholder-[var(--gray-500)] focus:outline-none focus:border-[var(--accent)] font-sans leading-relaxed resize-y transition-all"
          />

          {fileName && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--paper-card)] border border-[var(--line)] text-[11px] font-mono text-[var(--ink)]">
              <FileText className="w-3 h-3 text-[var(--accent)]" />
              <span>{fileName}</span>
            </div>
          )}
        </div>

        {/* Workbench Action Bar */}
        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePasteClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-[var(--ink)] transition-all"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Paste Clipboard</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Open Local File</span>
            </button>

            {inputText && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-[var(--gray-500)] hover:text-[var(--ink)] transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {wordCount > 0 && (
              <span className="text-[11px] font-mono text-[var(--gray-500)]">
                {wordCount} words • {charCount} chars
              </span>
            )}

            <button
              onClick={() => handleRunExplain(inputText, selectedMode)}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 active:scale-95 text-xs font-semibold shadow-md transition-all disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
                  <span>Deconstructing...</span>
                </>
              ) : (
                <>
                  <span>Deconstruct</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Samples Section (When Empty) */}
      {!currentExplanation && !isLoading && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-mono text-[var(--gray-500)] uppercase tracking-wider">
            Quick Samples to Try:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.text);
                  setSelectedMode(sample.mode);
                  handleRunExplain(sample.text, sample.mode);
                }}
                className="p-4 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] hover:border-[var(--line-strong)] hover:shadow-sm text-left transition-all group"
              >
                <div className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-1">
                  {sample.title}
                </div>
                <div className="text-xs text-[var(--ink-soft)] line-clamp-2 leading-relaxed">
                  {sample.text}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State Indicator */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] shadow-sm flex flex-col items-center justify-center space-y-3 animate-fade-in">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <div className="text-xs font-mono text-[var(--ink-soft)]">
            Analyzing text via {CANONICAL_LENSES.find(l => l.id === selectedMode)?.label || selectedMode} lens...
          </div>
        </div>
      )}

      {/* Deconstructed Result Presentation Card */}
      {currentExplanation && !isLoading && (
        <div className="p-7 rounded-3xl bg-[var(--paper-card)] border border-[var(--line-strong)] shadow-[var(--shadow-md)] space-y-5 animate-fade-in">
          {/* Result Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span>
                  {CANONICAL_LENSES.find(l => l.id === currentExplanation.mode)?.label || currentExplanation.mode} Lens
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                currentExplanation.isOfflineFallback
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
              }`}>
                {currentExplanation.isOfflineFallback ? 'Offline Heuristic Mode' : 'Google Gemini (Cloud AI)'}
              </span>
              <span className="text-[11px] font-mono text-[var(--gray-500)]">
                {currentExplanation.latencyMs}ms
              </span>
            </div>
          </div>

          {/* Offline Fallback Notice Banner */}
          {currentExplanation.isOfflineFallback && currentExplanation.fallbackReason && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong>Offline Mode:</strong> {currentExplanation.fallbackReason}. Configure an API key in Settings for full neural model reasoning.
            </div>
          )}

          {/* Phonetic / Part of speech breakdown if present */}
          {currentExplanation.ipa && (
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-soft)]">
              <span className="px-2 py-0.5 rounded bg-[var(--paper-raised)] border border-[var(--line)] font-semibold text-[var(--accent)]">
                {currentExplanation.ipa}
              </span>
              {currentExplanation.partOfSpeech && (
                <span className="italic">({currentExplanation.partOfSpeech})</span>
              )}
            </div>
          )}

          {/* Main Deconstruction Text */}
          <div className="text-[1.0625rem] leading-[1.7] text-[var(--ink)] font-sans whitespace-pre-line">
            {currentExplanation.summary}
          </div>

          {/* Example Callout */}
          {currentExplanation.example && (
            <div className="p-4 rounded-2xl bg-[var(--paper-raised)] border-l-2 border-[var(--accent)] text-xs text-[var(--ink-soft)] leading-relaxed italic">
              "{currentExplanation.example}"
            </div>
          )}

          {/* Legal Notice Disclaimer if Legal Lens */}
          {currentExplanation.mode === 'legal' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)] text-[11px] text-[var(--gray-600)]">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>General information only — not legal advice.</span>
            </div>
          )}

          {/* Result Footer Actions */}
          <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentExplanation.summary)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-[var(--ink)] transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => playTextAudio(currentExplanation.summary)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-[var(--ink)] transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Listen</span>
              </button>
            </div>

            <button
              onClick={() => handleRunExplain(currentExplanation.originalText, 'simple')}
              className="text-xs font-semibold text-[var(--accent)] hover:underline font-mono"
            >
              Simpler ↓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
