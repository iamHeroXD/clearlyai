import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Volume2, 
  ArrowRight, 
  CornerDownLeft, 
  Command, 
  Scan,
  Layers,
  Wand2
} from 'lucide-react';
import { LensType, DeconstructResult } from '../types';
import { deconstructText, playTextToSpeech } from '../services/desktopAiService';

interface FloatingHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHistory: (result: DeconstructResult) => void;
  activeProvider: string;
  geminiApiKey?: string;
}

const LENSES: { id: LensType; label: string; icon: string; key: string }[] = [
  { id: 'polish', label: 'Polish', icon: '✨', key: '1' },
  { id: 'meaning', label: 'Meaning', icon: '💡', key: '2' },
  { id: 'simplify', label: 'Simplify', icon: '🐣', key: '3' },
  { id: 'deconstruct', label: 'Deconstruct', icon: '🧬', key: '4' },
  { id: 'counter', label: 'Counter', icon: '⚖️', key: '5' },
  { id: 'translate', label: 'Translate', icon: '🌐', key: '6' },
];

export const FloatingHUD: React.FC<FloatingHUDProps> = ({
  isOpen,
  onClose,
  onAddHistory,
  activeProvider,
  geminiApiKey,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedLens, setSelectedLens] = useState<LensType>('polish');
  const [result, setResult] = useState<DeconstructResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInputText('');
      setResult(null);
    }
  }, [isOpen]);

  // Global hotkey listener within window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.altKey && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const lensMap: Record<string, LensType> = {
          '1': 'polish',
          '2': 'meaning',
          '3': 'simplify',
          '4': 'deconstruct',
          '5': 'counter',
          '6': 'translate',
        };
        setSelectedLens(lensMap[e.key]);
        if (inputText) {
          execute(inputText, lensMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inputText]);

  const execute = async (text: string, lens: LensType) => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await deconstructText(text, lens, activeProvider, geminiApiKey);
      setResult(res);
      onAddHistory(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Spotlight Floating Window */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl bg-[#161614]/95 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col backdrop-blur-3xl animate-scale-in"
      >
        {/* Top Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-brand animate-pulse"></div>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                execute(inputText, selectedLens);
              }
            }}
            placeholder="Type or paste any text from any app to deconstruct..."
            className="flex-1 bg-transparent text-[#F5F5F1] text-sm placeholder-[#8E8E86]/60 focus:outline-none font-sans"
          />

          {inputText && (
            <button
              onClick={() => execute(inputText, selectedLens)}
              disabled={isLoading}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-brand text-black text-xs font-semibold hover:bg-amber-400 transition-all"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>Enter</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8E8E86] hover:text-[#F5F5F1] hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lens Quick Selector Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-black/20 overflow-x-auto">
          {LENSES.map((lens) => {
            const isActive = selectedLens === lens.id;
            return (
              <button
                key={lens.id}
                onClick={() => {
                  setSelectedLens(lens.id);
                  if (inputText) execute(inputText, lens.id);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                    : 'text-[#8E8E86] hover:text-[#F5F5F1] hover:bg-white/5'
                }`}
              >
                <span>{lens.icon}</span>
                <span>{lens.label}</span>
                <span className="text-[10px] opacity-40 font-mono">⌥{lens.key}</span>
              </button>
            );
          })}
        </div>

        {/* Body Result */}
        <div className="p-5 max-h-[360px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center text-[#8E8E86] space-y-2">
              <Sparkles className="w-6 h-6 animate-spin text-amber-brand" />
              <p className="text-xs font-mono">Refining with {activeProvider.toUpperCase()}...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8E8E86] font-mono">
                <span className="uppercase text-amber-brand font-semibold tracking-wider">
                  {result.lens} Result
                </span>
                <span>{result.latencyMs}ms</span>
              </div>
              <div className="text-sm text-[#F5F5F1] leading-relaxed whitespace-pre-line bg-black/30 p-4 rounded-xl border border-white/5">
                {result.result}
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playTextToSpeech(result.result)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8E86] hover:text-[#F5F5F1] transition-all"
                    title="Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-[#F5F5F1] transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
                <span className="text-[11px] font-mono text-[#8E8E86]">Press Esc to dismiss</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-[#8E8E86] space-y-1">
              <p className="text-xs font-medium text-[#D8D8D2]">Ambient Screen Intelligence Ready</p>
              <p className="text-[11px]">
                Paste text above or press <kbd className="font-mono text-[10px] bg-white/10 px-1 py-0.5 rounded">Enter</kbd> to analyze.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8E8E86]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-white/10 px-1 py-0.5 rounded text-[10px]">Enter</kbd> Run
            </span>
            <span>
              <kbd className="bg-white/10 px-1 py-0.5 rounded text-[10px]">⌥ 1-6</kbd> Switch Lens
            </span>
          </div>
          <span>Clearly Desktop HUD</span>
        </div>
      </div>
    </div>
  );
};
