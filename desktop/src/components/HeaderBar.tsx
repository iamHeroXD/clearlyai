import React from 'react';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Clock, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { ClearlyLogo } from './ClearlyLogo';

interface HeaderBarProps {
  activeTab: 'home' | 'history' | 'settings';
  setActiveTab: (tab: 'home' | 'history' | 'settings') => void;
  theme: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
  activeProvider: string;
  hasApiKey: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  activeProvider,
  hasApiKey,
}) => {
  const tabs = [
    { id: 'home', label: 'Studio', icon: Sparkles },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <header className="h-14 border-b border-[var(--line)] bg-[var(--paper-card)]/90 backdrop-blur-md px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Edition */}
      <div className="flex items-center gap-3">
        <ClearlyLogo size={28} />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[var(--ink)] tracking-tight">
            Clearly
          </span>
          <span className="text-[11px] font-mono text-[var(--gray-600)] px-2 py-0.5 rounded-full bg-[var(--paper-raised)] border border-[var(--line)]">
            Reader Studio
          </span>
        </div>
      </div>

      {/* Center Segmented Navigation */}
      <nav className="flex items-center gap-1 p-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)]" aria-label="Main Navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[var(--paper-card)] text-[var(--ink)] font-semibold shadow-sm border border-[var(--line-strong)]'
                  : 'text-[var(--gray-600)] hover:text-[var(--ink)] border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--gray-500)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Engine Status & Theme */}
      <div className="flex items-center gap-3">
        {/* Honest Engine Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
          <span className="text-[11px] text-[var(--ink)]">
            {hasApiKey ? 'Google Gemini' : 'Offline Heuristic'}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-[var(--gray-600)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] border border-transparent hover:border-[var(--line)] transition-all"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-[var(--accent)]" /> : <Sun className="w-4 h-4 text-[var(--accent)]" />}
        </button>
      </div>
    </header>
  );
};
