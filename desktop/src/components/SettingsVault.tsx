import React from 'react';
import { 
  Settings, 
  Key, 
  Sliders, 
  Keyboard, 
  ShieldCheck, 
  Cpu, 
  Save, 
  Check,
  Zap,
  Volume2
} from 'lucide-react';
import { DesktopSettings } from '../types';

interface SettingsVaultProps {
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: Partial<DesktopSettings>) => void;
}

export const SettingsVault: React.FC<SettingsVaultProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#161614] border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-[#F5F5F1] flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-brand" />
            System & Engine Configuration
          </h2>
          <p className="text-xs text-[#8E8E86] mt-0.5">
            Configure global shortcuts, API keys, AI model orchestration, and window aesthetics.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-brand hover:bg-amber-400 text-black text-xs font-semibold shadow transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Section 1: AI Engine & Provider */}
      <div className="p-6 rounded-2xl bg-[#161614] border border-white/5 space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F1] font-mono uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-brand" />
          AI Model Provider
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'nano', title: 'Chrome Gemini Nano', desc: 'Zero-latency on-device core' },
            { id: 'gemini', title: 'Google Gemini 1.5/2.0', desc: 'High intelligence cloud' },
            { id: 'ollama', title: 'Local Ollama', desc: '100% private localhost' },
          ].map((prov) => (
            <button
              key={prov.id}
              onClick={() => onUpdateSettings({ activeProvider: prov.id as any })}
              className={`p-4 rounded-xl text-left border transition-all ${
                settings.activeProvider === prov.id
                  ? 'bg-amber-brand/10 border-amber-brand/50 text-[#F5F5F1]'
                  : 'bg-black/20 border-white/5 text-[#8E8E86] hover:text-[#F5F5F1] hover:border-white/10'
              }`}
            >
              <div className="text-xs font-medium text-[#F5F5F1]">{prov.title}</div>
              <div className="text-[11px] text-[#8E8E86] mt-0.5">{prov.desc}</div>
            </button>
          ))}
        </div>

        {/* Gemini API Key */}
        <div className="pt-2">
          <label className="block text-xs font-mono text-[#8E8E86] mb-1.5 uppercase">
            Gemini API Key (Optional for cloud models)
          </label>
          <div className="relative">
            <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E86]" />
            <input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => onUpdateSettings({ geminiApiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#F5F5F1] placeholder-[#8E8E86]/40 focus:border-amber-brand/50 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Global Hotkeys */}
      <div className="p-6 rounded-2xl bg-[#161614] border border-white/5 space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F1] font-mono uppercase tracking-wider flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-amber-brand" />
          Global Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#F5F5F1]">Spotlight HUD Overlay</div>
              <div className="text-[11px] text-[#8E8E86]">Instant quick bar anywhere</div>
            </div>
            <kbd className="px-2.5 py-1 rounded bg-white/10 text-xs font-mono text-amber-brand border border-white/10">
              {settings.hotkeySpotlight}
            </kbd>
          </div>

          <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#F5F5F1]">Screen Area Controller</div>
              <div className="text-[11px] text-[#8E8E86]">Highlight or capture any app</div>
            </div>
            <kbd className="px-2.5 py-1 rounded bg-white/10 text-xs font-mono text-amber-brand border border-white/10">
              {settings.hotkeyScreenSelect}
            </kbd>
          </div>
        </div>
      </div>

      {/* Section 3: Glass Aesthetics & UI */}
      <div className="p-6 rounded-2xl bg-[#161614] border border-white/5 space-y-4">
        <h3 className="text-sm font-medium text-[#F5F5F1] font-mono uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-brand" />
          Liquid Glass & Display Tuning
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E86] mb-1.5">
              <span>Glass Backdrop Blur</span>
              <span>{settings.glassBlurLevel}px</span>
            </div>
            <input
              type="range"
              min="8"
              max="48"
              value={settings.glassBlurLevel}
              onChange={(e) => onUpdateSettings({ glassBlurLevel: Number(e.target.value) })}
              className="w-full accent-[#E1993B] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E86] mb-1.5">
              <span>Audio Pronunciation Speed</span>
              <span>{settings.readAloudSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={settings.readAloudSpeed}
              onChange={(e) => onUpdateSettings({ readAloudSpeed: Number(e.target.value) })}
              className="w-full accent-[#E1993B] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
