import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  Copy, 
  Sliders, 
  Key, 
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { ToastNotification, StructuredExplanation, ExplanationMode } from '../types';
import { ClearlyLogo } from './ClearlyLogo';
import { explainText, playTextAudio } from '../services/desktopAiService';

interface ModalsProps {
  quickSettingsOpen: boolean;
  onCloseQuickSettings: () => void;
  proModalOpen: boolean;
  onCloseProModal: () => void;
  accountModalOpen: boolean;
  onCloseAccountModal: () => void;
  hudOpen: boolean;
  onCloseHUD: () => void;
  toasts: ToastNotification[];
  onDismissToast: (id: string) => void;
  onSaveExplanation: (exp: StructuredExplanation) => void;
  activeProvider: string;
  geminiApiKey?: string;
}

export const Modals: React.FC<ModalsProps> = ({
  quickSettingsOpen,
  onCloseQuickSettings,
  proModalOpen,
  onCloseProModal,
  accountModalOpen,
  onCloseAccountModal,
  hudOpen,
  onCloseHUD,
  toasts,
  onDismissToast,
  onSaveExplanation,
  activeProvider,
  geminiApiKey,
}) => {
  // HUD state
  const [hudInput, setHudInput] = useState('');
  const [hudMode, setHudMode] = useState<ExplanationMode>('simple');
  const [hudResult, setHudResult] = useState<StructuredExplanation | null>(null);
  const [hudLoading, setHudLoading] = useState(false);
  const [hudCopied, setHudCopied] = useState(false);

  const handleRunHUD = async () => {
    if (!hudInput.trim()) return;
    setHudLoading(true);
    try {
      const res = await explainText(hudInput, hudMode, activeProvider, geminiApiKey);
      setHudResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setHudLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notifications Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => onDismissToast(toast.id)}
            className={`pointer-events-auto px-4 py-3 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-2xl animate-fade-in cursor-pointer text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-[var(--paper-card)] border-emerald-500/40 text-emerald-700'
                : toast.type === 'error'
                ? 'bg-[var(--paper-card)] border-red-500/40 text-red-700'
                : 'bg-[var(--paper-card)] border-[var(--line)] text-[var(--ink)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* QUICK SETTINGS DRAWER */}
      {quickSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={onCloseQuickSettings}></div>
          <div className="relative w-full max-w-md rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--accent)]" />
                Quick Preferences
              </h3>
              <button onClick={onCloseQuickSettings} className="text-[var(--gray-500)] hover:text-[var(--ink)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <span className="text-[var(--ink)] font-medium">AI Engine</span>
                <span className="font-mono text-[var(--accent)] font-semibold">{activeProvider.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <span className="text-[var(--ink)] font-medium">Global Spotlight Hotkey</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--paper-card)] border border-[var(--line)] font-mono text-[var(--accent)] font-semibold">⌥ Space</kbd>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <span className="text-[var(--ink)] font-medium">Screen Selection Hotkey</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--paper-card)] border border-[var(--line)] font-mono text-[var(--accent)] font-semibold">Ctrl+Shift+C</kbd>
              </div>
            </div>

            <button
              onClick={onCloseQuickSettings}
              className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 font-semibold text-xs transition-all shadow"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* PRO UPGRADE MODAL */}
      {proModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={onCloseProModal}></div>
          <div className="relative w-full max-w-md rounded-3xl bg-[var(--paper-card)] border border-[var(--line-strong)] p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[var(--accent)]" />
                <span className="text-base font-bold text-[var(--ink)]">Clearly Pro</span>
              </div>
              <button onClick={onCloseProModal} className="text-[var(--gray-500)] hover:text-[var(--ink)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[var(--ink-soft)]">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>Unlimited document analysis across all articles &amp; notes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>Google Gemini 1.5 Flash cloud reasoning with custom prompts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>Multi-language real-time speech synthesis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>Local Vault export to Markdown, CSV &amp; Anki</span>
              </div>
            </div>

            <button
              onClick={onCloseProModal}
              className="w-full py-3 rounded-2xl bg-[var(--ink)] text-[var(--paper)] font-bold text-xs shadow-md transition-all hover:opacity-90 active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* USER ACCOUNT MODAL */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={onCloseAccountModal}></div>
          <div className="relative w-full max-w-sm rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] p-6 shadow-2xl space-y-4 animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/30 flex items-center justify-center mx-auto text-[var(--accent)]">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)]">Local Desktop User</h3>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Air-gapped client license active</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)] text-xs text-[var(--gray-600)]">
              Plan: <span className="text-[var(--accent)] font-semibold">Clearly Personal Edition</span>
            </div>
            <button
              onClick={onCloseAccountModal}
              className="w-full py-2.5 rounded-xl bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] text-[var(--ink)] font-medium text-xs transition-all border border-[var(--line)]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SPOTLIGHT FLOATING HUD */}
      {hudOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={onCloseHUD}></div>
          <div className="relative w-full max-w-2xl rounded-3xl bg-[var(--paper-card)] border border-[var(--line-strong)] p-5 shadow-2xl space-y-4 backdrop-blur-3xl animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
                <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider font-mono">Spotlight HUD</span>
              </div>
              <button onClick={onCloseHUD} className="text-[var(--gray-500)] hover:text-[var(--ink)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={hudInput}
                onChange={(e) => setHudInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunHUD();
                }}
                placeholder="Type or paste any text to deconstruct..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] font-sans"
              />
              <button
                onClick={handleRunHUD}
                disabled={hudLoading}
                className="px-5 py-2.5 rounded-2xl bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 font-bold text-xs transition-all shadow"
              >
                {hudLoading ? '...' : 'Explain'}
              </button>
            </div>

            {hudResult && (
              <div className="p-4 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line)] space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--ink)]">{hudResult.title}</span>
                  <span className="text-[var(--gray-500)] font-mono">{hudResult.latencyMs}ms</span>
                </div>
                <p className="text-xs text-[var(--ink)] leading-relaxed">
                  {hudResult.summary}
                </p>
                <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playTextAudio(hudResult.summary)}
                      className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-card)] transition-colors"
                      title="Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(hudResult.summary);
                        setHudCopied(true);
                        setTimeout(() => setHudCopied(false), 2000);
                      }}
                      className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-card)] transition-colors"
                      title="Copy"
                    >
                      {hudCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-[var(--gray-500)] font-mono">Press Esc to close</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
