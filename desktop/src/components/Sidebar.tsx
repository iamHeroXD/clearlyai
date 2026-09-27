import React from 'react';
import { 
  Home, 
  Bookmark, 
  Clock, 
  FileText, 
  Settings, 
  Sparkles, 
  Crown,
  ArrowRight
} from 'lucide-react';
import { ClearlyLogo } from './ClearlyLogo';

interface SidebarProps {
  activeTab: 'home' | 'library' | 'history' | 'notes' | 'settings';
  setActiveTab: (tab: 'home' | 'library' | 'history' | 'notes' | 'settings') => void;
  onOpenProModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProModal,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Bookmark },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 border-r border-[var(--line)] bg-[var(--paper-card)] flex flex-col justify-between p-4 select-none shrink-0 h-full">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <ClearlyLogo size={36} />
          <div>
            <h1 className="font-serif italic text-lg font-bold tracking-tight text-[var(--ink)] leading-tight">
              Clearly
            </h1>
            <p className="text-[11px] text-[var(--gray-500)] tracking-tight font-mono">
              Highlight. Understand. Faster.
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold shadow-sm'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--gray-500)]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clearly Pro Card */}
      <div className="p-4 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line-strong)] relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[var(--accent)]">
          <Crown className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Clearly Pro</span>
        </div>
        <p className="text-[11px] text-[var(--ink-soft)] leading-snug mb-3">
          More explanations. More limits. More power.
        </p>
        <button
          onClick={onOpenProModal}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 active:scale-[0.98] text-xs font-semibold transition-all shadow-sm"
        >
          <span>Upgrade</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
