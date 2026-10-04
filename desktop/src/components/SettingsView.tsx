import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Info, 
  Save, 
  Check, 
  Key, 
  RefreshCw,
  Trash2,
  Download
} from 'lucide-react';
import { DesktopSettings, ExplanationMode } from '../types';

interface SettingsViewProps {
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: Partial<DesktopSettings>) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onClearHistory?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
  onClearHistory,
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'ai' | 'appearance' | 'privacy' | 'about'>('general');
  const [geminiKeyInput, setGeminiKeyInput] = useState(settings.geminiApiKey || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveAll = () => {
    onUpdateSettings({
      geminiApiKey: geminiKeyInput.trim(),
    });
    setIsSaved(true);
    onShowToast('Settings saved successfully!', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'ai', label: 'AI Engine', icon: Cpu },
    { id: 'appearance', label: 'Appearance', icon: Sliders },
    { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
    { id: 'about', label: 'About', icon: Info },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--accent)]" />
            Studio Preferences
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Configure your AI backend, default explanation lens, and privacy options.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 font-semibold text-xs transition-all shadow-md active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 space-y-1.5">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isAct = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isAct
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold shadow-sm'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Content Area */}
        <div className="md:col-span-9 p-6 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] space-y-6 shadow-sm">
          {/* GENERAL */}
          {activeSection === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">General Preferences</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Default Explanation Lens</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Initial lens selected when pasting text</div>
                </div>
                <select
                  value={settings.defaultMode}
                  onChange={(e) => onUpdateSettings({ defaultMode: e.target.value as ExplanationMode })}
                  className="px-3 py-1.5 rounded-lg bg-[var(--paper-card)] border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="simple">Simple Terms</option>
                  <option value="eli5">ELI5 Analogy</option>
                  <option value="define">Definition &amp; IPA</option>
                  <option value="grammar">Grammar &amp; Polish</option>
                  <option value="professional">Professional Tone</option>
                  <option value="code">Code Analysis</option>
                  <option value="math">Mathematical Notation</option>
                  <option value="legal">Contract Risk Radar</option>
                  <option value="tldr">TL;DR Bullets</option>
                  <option value="translate">Translation</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Toast Notifications</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Show brief confirmations for clipboard actions</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => onUpdateSettings({ notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* AI ENGINE */}
          {activeSection === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-2">AI Model Orchestration</h3>
              <p className="text-xs text-[var(--ink-soft)] mb-4">
                Clearly Reader Studio can run with zero configuration in offline heuristic mode, or with your Google Gemini API key for deep neural reasoning.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ activeProvider: 'gemini' as any })}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    settings.activeProvider === 'gemini'
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)]/50 text-[var(--ink)] shadow-sm'
                      : 'bg-[var(--paper-raised)] border-[var(--line)] text-[var(--ink-soft)] hover:bg-[var(--paper-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--ink)]">Google Gemini (Recommended)</div>
                  <div className="text-[11px] text-[var(--gray-600)] mt-0.5">Official gemini-3.8-flash via BYOK</div>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ activeProvider: 'ollama' as any })}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    settings.activeProvider === 'ollama'
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)]/50 text-[var(--ink)] shadow-sm'
                      : 'bg-[var(--paper-raised)] border-[var(--line)] text-[var(--ink-soft)] hover:bg-[var(--paper-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--ink)]">Local Ollama</div>
                  <div className="text-[11px] text-[var(--gray-600)] mt-0.5">http://localhost:11434 (Private)</div>
                </button>
              </div>

              <div className="pt-2 space-y-2">
                <label className="block text-xs font-mono text-[var(--gray-600)] uppercase">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gray-500)]" />
                  <input
                    type="password"
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder-[var(--gray-500)] focus:border-[var(--accent)] focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-[var(--ink-soft)]">
                  Keys are stored exclusively in your local browser storage (<code className="font-mono text-[10px] bg-[var(--paper-raised)] px-1 py-0.5 rounded">localStorage</code>) and transmitted directly via secure <code className="font-mono text-[10px] bg-[var(--paper-raised)] px-1 py-0.5 rounded">x-goog-api-key</code> headers.
                </p>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">Display &amp; Motion</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Reduce Motion</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Disable smooth transitions and animations</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => onUpdateSettings({ reduceMotion: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">Privacy &amp; Data Retention</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Save Explanation History</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Persist lookups in local history storage</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={(e) => onUpdateSettings({ saveHistory: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
              </div>

              {onClearHistory && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div>
                    <div className="text-xs font-semibold text-red-600">Clear All History</div>
                    <div className="text-[11px] text-[var(--ink-soft)]">Permanently delete all stored lookups on this device</div>
                  </div>
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Data</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ABOUT */}
          {activeSection === 'about' && (
            <div className="space-y-4 text-xs text-[var(--ink-soft)] leading-relaxed">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-2">About Clearly Reader Studio</h3>
              <p>
                <strong>Version:</strong> 1.0.0 (Production Release)
              </p>
              <p>
                Clearly Reader Studio is a lightweight document and reading studio for deconstructing complex text, academic research, code logic, and legal agreements.
              </p>
              <div className="p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)] font-mono text-[11px] space-y-1 text-[var(--ink)]">
                <div>• Architecture: Standalone Portable Web Client</div>
                <div>• Engine: Google Gemini 1.5 Flash + Local Syntactic Heuristic</div>
                <div>• License: MIT Open Source</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
