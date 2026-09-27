import React from 'react';
import { 
  Scan, 
  LayoutDashboard, 
  Sparkles, 
  History, 
  Settings, 
  Command, 
  Volume2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'screen' | 'hud' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'screen' | 'hud' | 'history' | 'settings') => void;
  onOpenHUD: () => void;
  activeProvider: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenHUD,
  activeProvider,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0C0C0A]/85 backdrop-blur-xl px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-ink-card border border-white/10 flex items-center justify-center relative shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-brand animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-lg font-medium tracking-tight text-[#F5F5F1]">
                Clearly
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 text-amber-brand border border-amber-brand/20">
                Desktop OS
              </span>
            </div>
            <p className="text-[11px] text-[#8E8E86] font-mono leading-none">
              Ambient Screen Intelligence • v1.0.0
            </p>
          </div>
        </div>

        {/* Center Nav Navigation */}
        <nav className="hidden md:flex items-center bg-white/[0.04] p-1 rounded-full border border-white/5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-[#8E8E86] hover:text-[#F5F5F1]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('screen')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'screen'
                ? 'bg-amber-brand/15 text-amber-brand shadow-sm border border-amber-brand/30 font-semibold'
                : 'text-[#8E8E86] hover:text-[#F5F5F1]'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-amber-brand" />
            Screen Controller
          </button>

          <button
            onClick={() => setActiveTab('hud')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'hud'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-[#8E8E86] hover:text-[#F5F5F1]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Spotlight HUD
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-[#8E8E86] hover:text-[#F5F5F1]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Vault
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-[#8E8E86] hover:text-[#F5F5F1]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHUD}
            className="flex items-center gap-2 bg-[#E1993B] hover:bg-[#D97706] text-[#0C0C0A] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Press Alt+Space or Ctrl+Shift+C"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Launch HUD</span>
            <kbd className="hidden sm:inline text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-mono text-black/90">
              ⌥ Space
            </kbd>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[11px] font-mono text-[#8E8E86]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{activeProvider.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
