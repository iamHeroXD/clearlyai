import React, { useState } from 'react';
import { 
  Settings, 
  Keyboard, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Info, 
  Save, 
  Check, 
  Key, 
  RefreshCw,
  Zap,
  Globe,
  Bell
} from 'lucide-react';
import { DesktopSettings } from '../types';

interface SettingsViewProps {
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: Partial<DesktopSettings>) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'shortcuts' | 'appearance' | 'ai' | 'privacy' | 'about'>('general');
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
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'appearance', label: 'Appearance', icon: Sliders },
    { id: 'ai', label: 'AI Engine', icon: Cpu },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'about', label: 'About', icon: Info },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--accent)]" />
            Application Settings
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Configure ambient screen shortcuts, privacy vaults, and AI orchestration.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 font-semibold text-xs transition-all shadow-md active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 cols) */}
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

        {/* Section Content Area (9 cols) */}
        <div className="md:col-span-9 p-6 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] space-y-6 shadow-sm">
          {/* GENERAL */}
          {activeSection === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">General Preferences</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Launch on System Startup</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Run Clearly in the background when your computer starts</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.launchOnStartup}
                  onChange={(e) => onUpdateSettings({ launchOnStartup: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Default Explanation Mode</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Initial mode selected when highlighting text</div>
                </div>
                <select
                  value={settings.defaultMode}
                  onChange={(e) => onUpdateSettings({ defaultMode: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg bg-[var(--paper-card)] border border-[var(--line)] text-xs text-[var(--ink)]"
                >
                  <option value="simple">Simple Terms</option>
                  <option value="define">Definitions</option>
                  <option value="summarize">Summaries</option>
                  <option value="example">Examples</option>
                  <option value="translate">Translations</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Show Toast Notifications</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Confirmation popups for copies and saves</div>
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

          {/* SHORTCUTS */}
          {activeSection === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">Global Hotkeys</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Spotlight Floating HUD</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Trigger ambient quick explanation prompt anywhere</div>
                </div>
                <kbd className="px-3 py-1 rounded bg-[var(--paper-card)] text-xs font-mono text-[var(--accent)] border border-[var(--line)] font-semibold shadow-sm">
                  {settings.hotkeySpotlight}
                </kbd>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Screen Selection Mode</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Highlight or crop any screen area across native apps</div>
                </div>
                <kbd className="px-3 py-1 rounded bg-[var(--paper-card)] text-xs font-mono text-[var(--accent)] border border-[var(--line)] font-semibold shadow-sm">
                  {settings.hotkeyScreenSelect}
                </kbd>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">Display &amp; Theme</h3>

              <div className="space-y-2 p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink)]">Liquid Frosted Glass Blur</span>
                  <span className="font-mono text-[var(--accent)]">{settings.glassBlurLevel}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={settings.glassBlurLevel}
                  onChange={(e) => onUpdateSettings({ glassBlurLevel: Number(e.target.value) })}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Reduce Motion</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">Minimize interface transition animations</div>
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

          {/* AI ENGINE */}
          {activeSection === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-4">AI Model Orchestration</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'nano', title: 'Chrome Gemini Nano', desc: 'On-device neural core' },
                  { id: 'gemini', title: 'Gemini 1.5/2.0 Flash', desc: 'High intelligence cloud' },
                  { id: 'ollama', title: 'Local Ollama', desc: 'Private localhost' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onUpdateSettings({ activeProvider: p.id as any })}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      settings.activeProvider === p.id
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)]/50 text-[var(--ink)] shadow-sm'
                        : 'bg-[var(--paper-raised)] border-[var(--line)] text-[var(--ink-soft)] hover:bg-[var(--paper-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--ink)]">{p.title}</div>
                    <div className="text-[10px] text-[var(--gray-500)] mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-mono text-[var(--gray-600)] mb-1.5 uppercase">
                  Google Gemini API Key (Optional)
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
                  <div className="text-[11px] text-[var(--ink-soft)]">Store historical lookups locally on this device</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={(e) => onUpdateSettings({ saveHistory: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Zero Telemetry</div>
                  <div className="text-[11px] text-emerald-600 font-medium">100% Client-side encrypted. No tracking.</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Protected
                </span>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {activeSection === 'about' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--ink)]">Clearly Desktop OS</h3>
              <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                Version 1.0.0 (Production Release) • Ambient AI Screen-Intelligence
              </p>
              <div className="p-4 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)] text-xs text-[var(--gray-600)] space-y-1 font-mono">
                <div>Engine: Multi-Model Neural Pipeline</div>
                <div>Protocol: Chromium / Win32 Native Hook</div>
                <div>Status: Connected &amp; Operational</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
