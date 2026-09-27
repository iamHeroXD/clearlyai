import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Compass, 
  Globe, 
  Clock, 
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { StructuredExplanation } from '../types';

interface RightFeaturesSidebarProps {
  recentExplanations: StructuredExplanation[];
  onSelectExplanation: (exp: StructuredExplanation) => void;
  onViewAllHistory: () => void;
  onSelectFeatureMode: (mode: any) => void;
}

export const RightFeaturesSidebar: React.FC<RightFeaturesSidebarProps> = ({
  recentExplanations,
  onSelectExplanation,
  onViewAllHistory,
  onSelectFeatureMode,
}) => {
  const features = [
    {
      id: 'simple',
      title: 'Instantly understand',
      desc: 'Complex ideas, made simple.',
      icon: Sparkles,
      color: 'text-[#E1993B] bg-[#E1993B]/10 border-[#E1993B]/20',
    },
    {
      id: 'simple',
      title: 'Simple Explanations',
      desc: 'No jargon. Just clear words.',
      icon: HelpCircle,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    },
    {
      id: 'summarize',
      title: 'Summaries',
      desc: 'Get the key points, fast.',
      icon: FileText,
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    },
    {
      id: 'define',
      title: 'Definitions',
      desc: 'Know exactly what it means.',
      icon: BookOpen,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
    {
      id: 'example',
      title: 'Examples',
      desc: 'See it in real life.',
      icon: Compass,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
    {
      id: 'translate',
      title: 'Multi-language',
      desc: 'Explain in your preferred language.',
      icon: Globe,
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    },
  ];

  return (
    <aside className="w-80 border-l border-[var(--line)] bg-[var(--paper-card)] p-5 flex flex-col justify-between overflow-y-auto select-none shrink-0 h-full space-y-6">
      {/* Top: Feature Highlights */}
      <div className="space-y-3">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectFeatureMode(f.id)}
              className="p-3 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line)] hover:border-[var(--accent)]/40 hover:bg-[var(--paper-hover)] transition-all flex items-start gap-3.5 cursor-pointer group shadow-sm"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${f.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {f.title}
                </h4>
                <p className="text-[11px] text-[var(--ink-soft)] leading-snug truncate">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom: Recent Explanations List */}
      <div className="pt-4 border-t border-[var(--line)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Recent Explanations</span>
          </div>
          <button
            onClick={onViewAllHistory}
            className="text-[11px] text-[var(--gray-600)] hover:text-[var(--accent)] font-medium transition-colors flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {recentExplanations.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectExplanation(item)}
              className="p-2.5 rounded-xl bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                <Bookmark className="w-3.5 h-3.5 text-[var(--gray-500)] group-hover:text-[var(--accent)] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-medium text-[var(--ink)] group-hover:text-[var(--accent)] truncate">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[var(--gray-500)] font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--gray-500)] group-hover:text-[var(--ink)] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
