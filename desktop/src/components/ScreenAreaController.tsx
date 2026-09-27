import React, { useState } from 'react';
import { 
  Scan, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  RefreshCw, 
  Layers, 
  MousePointerClick, 
  FileText, 
  Code, 
  MessageSquare, 
  Terminal,
  Bookmark,
  Share2,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { LensType, DeconstructResult } from '../types';
import { deconstructText, playTextToSpeech } from '../services/desktopAiService';

interface ScreenAreaControllerProps {
  onAddHistory: (result: DeconstructResult) => void;
  activeProvider: string;
  geminiApiKey?: string;
}

const SAMPLE_WINDOWS = [
  {
    id: 'vscode',
    title: 'main.rs — VS Code',
    icon: Code,
    category: 'Code Editor',
    content: `// Asynchronous consensus coordinator\npub async fn evaluate_quorum(votes: Vec<Vote>) -> Result<QuorumState, ConsensusError> {\n    let total_weight: u64 = votes.iter().map(|v| v.stake_weight).sum();\n    if total_weight < MIN_SUPERMAJORITY_THRESHOLD {\n        return Err(ConsensusError::InsufficientStake {\n            received: total_weight,\n            required: MIN_SUPERMAJORITY_THRESHOLD\n        });\n    }\n    Ok(QuorumState::Finalized(calculate_merkle_root(&votes)))\n}`,
  },
  {
    id: 'pdf',
    title: 'Neuroscience_Paper_2026.pdf — Adobe Acrobat',
    icon: FileText,
    category: 'PDF Document',
    content: `Synaptic plasticity is predominantly mediated through Long-Term Potentiation (LTP), which relies on NMDA receptor activation and subsequent calcium influx into post-synaptic dendritic spines. This triggers retrograde signaling cascades that recalibrate neurotransmitter release probabilities at the presynaptic terminal.`,
  },
  {
    id: 'slack',
    title: '#engineering-general — Slack',
    icon: MessageSquare,
    category: 'Chat App',
    content: `Hey team, in order to facilitate optimal throughput for the upcoming migration at this point in time, we should utilize the asynchronous queue due to the fact that synchronous I/O introduces untenable blocking latency.`,
  },
  {
    id: 'terminal',
    title: 'zsh — Warp Terminal',
    icon: Terminal,
    category: 'Terminal stdout',
    content: `[ERROR 502]: Bad Gateway upstream connect error or disconnect/reset before headers. Connection terminated due to connection pool saturation on backend service worker 0x7f88e1a.`,
  },
];

const LENSES: { id: LensType; label: string; icon: string; shortcut: string }[] = [
  { id: 'polish', label: 'Polish', icon: '✨', shortcut: '1' },
  { id: 'meaning', label: 'Meaning', icon: '💡', shortcut: '2' },
  { id: 'simplify', label: 'Simplify', icon: '🐣', shortcut: '3' },
  { id: 'deconstruct', label: 'Deconstruct', icon: '🧬', shortcut: '4' },
  { id: 'counter', label: 'Counter', icon: '⚖️', shortcut: '5' },
  { id: 'translate', label: 'Translate', icon: '🌐', shortcut: '6' },
];

export const ScreenAreaController: React.FC<ScreenAreaControllerProps> = ({
  onAddHistory,
  activeProvider,
  geminiApiKey,
}) => {
  const [selectedWindowId, setSelectedWindowId] = useState('slack');
  const [selectedText, setSelectedText] = useState(
    'in order to facilitate optimal throughput for the upcoming migration at this point in time, we should utilize the asynchronous queue due to the fact that synchronous I/O introduces untenable blocking latency.'
  );
  const [activeLens, setActiveLens] = useState<LensType>('polish');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DeconstructResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [injected, setInjected] = useState(false);

  const activeWindow = SAMPLE_WINDOWS.find((w) => w.id === selectedWindowId) || SAMPLE_WINDOWS[0];

  React.useEffect(() => {
    handleDeconstruct(selectedText, activeLens);
  }, []);

  const handleDeconstruct = async (textToProcess?: string, lensToUse?: LensType) => {
    const text = textToProcess || selectedText;
    const lens = lensToUse || activeLens;

    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const res = await deconstructText(text, lens, activeProvider, geminiApiKey);
      setCurrentResult(res);
      onAddHistory(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 2) {
      setSelectedText(selection);
      handleDeconstruct(selection, activeLens);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInject = () => {
    setInjected(true);
    setTimeout(() => setInjected(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-ink-card via-[#1A1A18] to-ink-card border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-brand/10 text-amber-brand border border-amber-brand/20">
              <Scan className="w-3 h-3" /> Global Screen Controller
            </span>
            <span className="text-xs text-[#8E8E86]">• Any App • Anywhere on Screen</span>
          </div>
          <h2 className="text-xl font-medium tracking-tight text-[#F5F5F1]">
            Ambient Screen Controller & Text Deconstructor
          </h2>
          <p className="text-xs text-[#8E8E86] mt-0.5 max-w-2xl">
            Select or highlight text in any desktop window below (or paste custom text) to trigger instant 6-lens deconstruction with liquid glass clarity.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleDeconstruct()}
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#E1993B] hover:bg-[#D97706] text-[#0C0C0A] px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Deconstruct Selection</span>
        </button>
      </div>

      {/* Main Grid: Screen Inspector (Left) + Intelligence HUD (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Screen Window Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Window Target Selector */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-mono text-[#8E8E86] uppercase tracking-wider">
              Active Screen Target:
            </span>
            <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/5">
              {SAMPLE_WINDOWS.map((win) => {
                const Icon = win.icon;
                const isSelected = win.id === selectedWindowId;
                return (
                  <button
                    key={win.id}
                    onClick={() => {
                      setSelectedWindowId(win.id);
                      setSelectedText(win.content);
                      setCurrentResult(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-white/10 text-[#F5F5F1] shadow border border-white/10'
                        : 'text-[#8E8E86] hover:text-[#F5F5F1]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{win.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Active Application Window */}
          <div className="rounded-2xl border border-white/10 bg-[#161614] overflow-hidden shadow-2xl">
            {/* Window Chrome Header */}
            <div className="px-4 py-3 bg-[#11110F] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="ml-2 text-xs font-mono text-[#8E8E86] truncate max-w-xs">
                  {activeWindow.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E86]">
                <MousePointerClick className="w-3.5 h-3.5 text-amber-brand" />
                <span>Highlight any text to scan</span>
              </div>
            </div>

            {/* Screen Content Viewport */}
            <div 
              onMouseUp={handleTextSelection}
              className="p-6 font-mono text-sm leading-relaxed text-[#D8D8D2] bg-[#0E0E0C] min-h-[220px] select-text focus:outline-none cursor-text whitespace-pre-wrap selection:bg-[#E1993B]/30 selection:text-white"
            >
              {activeWindow.content}
            </div>

            {/* Bottom Window Bar */}
            <div className="px-4 py-2.5 bg-[#141412] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8E8E86]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Screen Capture Hook Active</span>
              </div>
              <span>Chars: {selectedText.length}</span>
            </div>
          </div>

          {/* Quick Custom Input / Screen Paste Zone */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <label className="block text-xs font-mono text-[#8E8E86] mb-2 uppercase">
              Or Paste Text from any Screen Region:
            </label>
            <div className="flex gap-2">
              <textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder="Type or paste any phrase, code snippet, or paragraph..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#F5F5F1] placeholder-[#8E8E86]/50 focus:border-amber-brand/50 focus:outline-none font-mono resize-none"
              />
              <button
                onClick={() => handleDeconstruct(selectedText, activeLens)}
                className="self-end px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#F5F5F1] rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <span>Run</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Liquid Glass Deconstruction HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#161614]/90 backdrop-blur-2xl p-5 shadow-2xl flex flex-col h-full min-h-[460px]">
            {/* HUD Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-brand"></div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F1] font-medium">
                  Clearly Lens Engine
                </span>
              </div>
              {currentResult && (
                <span className="text-[10px] font-mono text-[#8E8E86] bg-white/5 px-2 py-0.5 rounded">
                  ⚡ {currentResult.latencyMs}ms
                </span>
              )}
            </div>

            {/* Lens Switcher Pill Bar */}
            <div className="grid grid-cols-3 gap-1.5 my-3.5 p-1 bg-black/30 rounded-xl border border-white/5">
              {LENSES.map((lens) => {
                const isActive = activeLens === lens.id;
                return (
                  <button
                    key={lens.id}
                    onClick={() => {
                      setActiveLens(lens.id);
                      handleDeconstruct(selectedText, lens.id);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-brand text-black font-semibold shadow'
                        : 'text-[#8E8E86] hover:text-[#F5F5F1] hover:bg-white/5'
                    }`}
                  >
                    <span>{lens.icon}</span>
                    <span>{lens.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Result Area */}
            <div className="flex-1 rounded-xl bg-black/30 border border-white/5 p-4 overflow-y-auto max-h-[300px]">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-[#8E8E86] space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-brand" />
                  <p className="text-xs font-mono">Deconstructing semantic structure...</p>
                </div>
              ) : currentResult ? (
                <div className="space-y-3">
                  <div className="text-xs text-[#8E8E86] font-mono flex items-center justify-between">
                    <span>Source: &ldquo;{currentResult.originalText.slice(0, 30)}...&rdquo;</span>
                    <span className="uppercase text-amber-brand font-semibold">{currentResult.lens}</span>
                  </div>
                  <div className="text-sm text-[#F5F5F1] leading-relaxed whitespace-pre-line font-sans">
                    {currentResult.result}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-[#8E8E86] text-center space-y-2">
                  <Scan className="w-8 h-8 opacity-40 text-amber-brand" />
                  <p className="text-xs font-medium text-[#D8D8D2]">Ready to Deconstruct</p>
                  <p className="text-[11px] max-w-xs text-[#8E8E86]">
                    Select text in the left window or click &ldquo;Deconstruct Selection&rdquo; to see the live output.
                  </p>
                </div>
              )}
            </div>

            {/* Action Footer */}
            {currentResult && (
              <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => playTextToSpeech(currentResult.result)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8E86] hover:text-[#F5F5F1] transition-all"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(currentResult.result)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-[#8E8E86] hover:text-[#F5F5F1] transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={handleInject}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5F5F1] text-xs font-medium transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-brand" />
                  <span>{injected ? 'Injected in App!' : 'Replace in Active App'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
