import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Zap, Shield, BookOpen, Command, X, ArrowRight, CornerDownLeft, Volume2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
        else onSelectAction('open_palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const actions = [
    { id: 'demo_email', title: 'Rewrite Executive Email', category: 'Writing Mode', icon: Sparkles, badge: '👔 Professional' },
    { id: 'demo_physics', title: 'ELI5 Quantum Physics', category: 'Comprehension', icon: Zap, badge: '👶 ELI5' },
    { id: 'demo_code', title: 'Deconstruct Python Async Loop', category: 'Engineering', icon: Command, badge: '💻 Code' },
    { id: 'demo_legal', title: 'Scan Terms of Service for Gotchas', category: 'Security', icon: Shield, badge: '⚠️ High Risk' },
    { id: 'install', title: 'Install Clearly Extension (Free)', category: 'Setup', icon: CornerDownLeft, badge: 'Chrome MV3' },
  ];

  const filtered = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase()) ||
    a.badge.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0a0c16] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10">
        
        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-[#0e1120]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, mode, or question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-base focus:outline-none font-sans"
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Suggested Actions & Demos
          </div>

          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectAction(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-cyan-600/20 hover:border-white/15 border border-transparent text-left group transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500">{item.category}</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-300">
                    {item.badge}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching actions found. Try typing "email", "code", or "install".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-black/60 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-cyan-400 font-semibold">Clearly Quick Command</span>
        </div>

      </div>
    </div>
  );
};
