import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  ListOrdered, 
  BookOpen, 
  Compass, 
  Globe, 
  Volume2, 
  Copy, 
  Check, 
  Bookmark, 
  Scan, 
  MousePointer, 
  RefreshCw,
  Plus,
  ChevronDown,
  FileText,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { ExplanationMode, StructuredExplanation } from '../types';
import { ClearlyLogo } from './ClearlyLogo';
import { explainText, playTextAudio } from '../services/desktopAiService';

interface HomeViewProps {
  onSaveToLibrary: (exp: StructuredExplanation) => void;
  onAddNote: (title: string, content: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  activeProvider: string;
  geminiApiKey?: string;
  defaultMode: ExplanationMode;
}

const QUICK_ACTIONS: { id: ExplanationMode; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'simple', label: 'Explain in simple terms', icon: Lightbulb },
  { id: 'summarize', label: 'Summarize', icon: ListOrdered },
  { id: 'define', label: 'Define word', icon: BookOpen },
  { id: 'example', label: 'Give example', icon: Compass },
  { id: 'translate', label: 'Translate', icon: Globe },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onSaveToLibrary,
  onAddNote,
  onShowToast,
  activeProvider,
  geminiApiKey,
  defaultMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<ExplanationMode>(defaultMode);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isScreenSelecting, setIsScreenSelecting] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>('biology_chapter_4.pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Canvas Interactive State
  const [canvasSelectedText, setCanvasSelectedText] = useState(
    'Photosynthesis is the process by which plants convert light energy into chemical energy.'
  );
  const [currentExplanation, setCurrentExplanation] = useState<StructuredExplanation | null>(null);

  // Initial load
  useEffect(() => {
    handleRunExplain(canvasSelectedText, 'simple');
  }, []);

  const handleRunExplain = async (textToProcess: string, modeToUse: ExplanationMode) => {
    if (!textToProcess.trim()) {
      onShowToast('Please type or highlight some text first', 'info');
      return;
    }

    setIsLoading(true);
    try {
      // Auto-detect intent: if single word and default mode, switch to define
      const words = textToProcess.trim().split(/\s+/).filter(Boolean);
      const effectiveMode = (words.length <= 2 && modeToUse === 'simple') ? 'define' : modeToUse;

      const result = await explainText(textToProcess, effectiveMode, activeProvider, geminiApiKey);
      setCurrentExplanation(result);
      setSaved(false);
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

  const handleSave = () => {
    if (currentExplanation) {
      onSaveToLibrary(currentExplanation);
      setSaved(true);
      onShowToast('Saved to your Library!', 'success');
    }
  };

  const handleCreateNote = () => {
    if (currentExplanation) {
      onAddNote(
        currentExplanation.title,
        `# ${currentExplanation.title}\n\n**Original Selection:**\n> ${currentExplanation.originalText}\n\n**Explanation:**\n${currentExplanation.summary}\n\n**Why it matters:**\n${currentExplanation.whyItMatters}\n\n**Example:**\n${currentExplanation.example}`
      );
      onShowToast('Created new note in Notes!', 'success');
    }
  };

  const handleStartScreenSelection = () => {
    setIsScreenSelecting(true);
    onShowToast('Screen selection active. Capturing active region...', 'info');
    setTimeout(() => {
      setIsScreenSelecting(false);
      onShowToast('Captured text from active screen!', 'success');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      onShowToast(`Loaded "${file.name}" for instant deconstruction`, 'success');
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const sample = text.slice(0, 300).trim();
          setCanvasSelectedText(sample || `Analysis of ${file.name}`);
          handleRunExplain(sample || `Analysis of ${file.name}`, selectedMode);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-8 px-4 select-none animate-fade-in space-y-8">
      {/* Brand Hero Heading */}
      <div className="flex flex-col items-center text-center space-y-3">
        <ClearlyLogo size={58} className="shadow-lg shadow-[#F97316]/10 ring-1 ring-[var(--line-strong)]" />
        <h1 className="text-4xl font-serif italic font-bold tracking-tight text-[var(--ink)] mt-2">
          Clearly
        </h1>
        <p className="text-sm text-[var(--ink-soft)] max-w-lg leading-relaxed">
          Turn any highlighted text or local PDF into clear, effortless understanding.
        </p>
      </div>

      {/* Main Interactive Input Pill */}
      <div className="w-full max-w-2xl relative">
        <div className="p-2 rounded-3xl bg-[var(--paper-card)] border border-[var(--line-strong)] shadow-[var(--shadow-md)] flex items-center gap-3 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/15 transition-all">
          <div className="pl-3.5 text-[var(--accent)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRunExplain(inputText, selectedMode);
              }
            }}
            placeholder="Paste text, term, code, or select on screen..."
            className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder-[var(--gray-500)] focus:outline-none font-sans"
          />

          {/* Mode Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-xs font-medium text-[var(--ink)] transition-all"
            >
              <span className="capitalize">{selectedMode} (Auto)</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--gray-500)]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[var(--paper-card)] border border-[var(--line-strong)] shadow-xl p-1.5 z-50 space-y-1 animate-scale-in">
                {[
                  { id: 'simple', label: 'Simple Meaning (Auto)' },
                  { id: 'define', label: 'Dictionary Definition' },
                  { id: 'summarize', label: 'Summarize' },
                  { id: 'example', label: 'Real-World Example' },
                  { id: 'translate', label: 'Translate' },
                  { id: 'keypoints', label: '3 Key Points (TL;DR)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMode(m.id as ExplanationMode);
                      setIsDropdownOpen(false);
                      if (inputText) handleRunExplain(inputText, m.id as ExplanationMode);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedMode === m.id
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                        : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            onClick={() => handleRunExplain(inputText || canvasSelectedText, selectedMode)}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[var(--ink)] hover:opacity-90 text-[var(--paper)] flex items-center justify-center font-bold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
            title="Explain Text"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent)]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Quick Action Pills Row */}
      <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const isAct = selectedMode === action.id;
          return (
            <button
              key={action.id}
              onClick={() => {
                setSelectedMode(action.id);
                handleRunExplain(inputText || canvasSelectedText, action.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                isAct
                  ? 'bg-[var(--ink)] text-[var(--paper)] shadow-sm font-semibold'
                  : 'bg-[var(--paper-card)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] border border-[var(--line)] shadow-sm'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isAct ? 'text-[var(--accent)]' : 'text-[var(--gray-500)]'}`} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Interactive Screen & PDF Canvas */}
      <div className="w-full max-w-2xl pt-2">
        <div className="relative p-6 rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] shadow-[var(--shadow-md)]">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-serif italic text-[var(--ink)]">
              <MousePointer className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Screen Region &amp; PDF Reader:</span>
            </div>

            <div className="flex items-center gap-2">
              {/* PDF Import Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".pdf,.txt,.md" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-all"
                title="Drop or upload local PDF / Document"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Open PDF / Doc</span>
              </button>

              {/* Screen Area Capture */}
              <button
                onClick={handleStartScreenSelection}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isScreenSelecting
                    ? 'bg-red-500/20 text-red-600 border border-red-500/40 animate-pulse'
                    : 'bg-[var(--accent-soft)] hover:bg-[var(--accent-soft-strong)] text-[var(--accent)] border border-[var(--accent)]/30'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>{isScreenSelecting ? 'Capturing Screen...' : 'Capture Region'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Source Window Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Source Window (Left) */}
            <div className="md:col-span-6 p-4 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line)] font-sans text-xs text-[var(--ink)] leading-relaxed flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[var(--line)] text-[10px] text-[var(--gray-500)] font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="ml-1 font-medium text-[var(--ink)]">{pdfFileName || 'active_document.pdf'}</span>
                </div>
                <p className="line-clamp-6">
                  <mark className="bg-[var(--accent-soft-strong)] text-[var(--ink)] rounded px-1 py-0.5 font-medium">
                    {canvasSelectedText}
                  </mark>
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--line)] text-[10px] font-mono text-[var(--gray-500)] flex items-center justify-between">
                <span>Native PDF / Screen Reader</span>
                <span className="text-emerald-600 font-semibold">Active</span>
              </div>
            </div>

            {/* Explanation Bubble Result (Right) */}
            <div className="md:col-span-6 p-4 rounded-2xl bg-[var(--paper-card)] border border-[var(--line-strong)] shadow-sm relative animate-fade-in flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="capitalize">In {selectedMode} terms:</span>
                  </div>
                  {currentExplanation && (
                    <span className="text-[10px] font-mono text-[var(--gray-500)]">
                      {currentExplanation.latencyMs}ms
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center text-[var(--gray-500)] space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent)]" />
                    <span className="text-xs font-mono">Making it simpler...</span>
                  </div>
                ) : currentExplanation ? (
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--ink)] leading-relaxed font-sans font-medium">
                      {currentExplanation.summary}
                    </p>

                    {currentExplanation.example && (
                      <div className="p-2.5 rounded-lg bg-[var(--paper-raised)] border-l-2 border-[var(--accent)] text-[11px] text-[var(--ink-soft)] italic leading-relaxed">
                        "{currentExplanation.example}"
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Actions Bar */}
              {currentExplanation && !isLoading && (
                <div className="pt-3 mt-3 border-t border-[var(--line)] flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => playTextAudio(currentExplanation.summary)}
                      className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
                      title="Pronounce Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(currentExplanation.summary)}
                      className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
                      title="Copy to Clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handleSave}
                      className={`p-1.5 rounded-lg transition-colors ${
                        saved ? 'text-[var(--accent)]' : 'text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)]'
                      }`}
                      title="Save to Library"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCreateNote}
                      className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
                      title="Add as Note"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRunExplain(canvasSelectedText, 'simple')}
                    className="text-[11px] font-semibold text-[var(--accent)] hover:underline font-mono"
                  >
                    Simpler ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
