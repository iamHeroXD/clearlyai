import React from 'react';
import { 
  Moon, 
  Sun, 
  User, 
  Settings as SettingsIcon, 
  Minus, 
  Square, 
  X 
} from 'lucide-react';

interface HeaderBarProps {
  theme: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
  onOpenQuickSettings: () => void;
  onOpenAccount: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  theme,
  onToggleTheme,
  onOpenQuickSettings,
  onOpenAccount,
}) => {
  return (
    <header className="h-12 border-b border-[var(--line)] bg-[var(--paper-card)]/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Drag Region / Context */}
      <div className="flex items-center gap-2 text-xs text-[var(--gray-600)] font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[11px] font-medium text-[var(--ink)]">Desktop Screen Hook Active</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-[var(--gray-600)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User Account */}
        <button
          onClick={onOpenAccount}
          className="p-2 rounded-lg text-[var(--gray-600)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
          title="Account Profile"
          aria-label="Account Profile"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Quick Settings Pill */}
        <button
          onClick={onOpenQuickSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-xs font-medium text-[var(--ink)] transition-all shadow-sm"
        >
          <SettingsIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Quick Settings</span>
        </button>

        {/* Window Chrome Controls */}
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[var(--line)] text-[var(--gray-500)]">
          <button
            onClick={() => {}}
            className="p-1.5 rounded hover:bg-[var(--paper-raised)] hover:text-[var(--ink)] transition-colors"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {}}
            className="p-1.5 rounded hover:bg-[var(--paper-raised)] hover:text-[var(--ink)] transition-colors"
            title="Maximize"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => {}}
            className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-600 transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
