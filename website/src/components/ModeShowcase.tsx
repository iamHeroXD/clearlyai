import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface ModeInfo {
  id: string;
  name: string;
  icon: string;
  badge: string;
  tagline: string;
  description: string;
  inputLabel: string;
  originalText: string;
  outputLabel: string;
  transformedText: string;
  takeaway: string;
}

const MODES_DATA: ModeInfo[] = [
  {
    id: 'simple',
    name: 'Simple',
    icon: '✨',
    badge: 'Concise & Direct',
    tagline: 'Get straight to the core point in 1-2 sharp sentences.',
    description: 'Strips away verbosity, filler phrases, and excessive jargon so you can digest dense articles 10x faster.',
    inputLabel: 'Dense Technical Paragraph',
    originalText: 'The implementation of ubiquitous containerization paradigms facilitates microservice-oriented orchestration architectures, thereby mitigating distributed state concurrency anomalies.',
    outputLabel: 'Clearly Simple Explanation',
    transformedText: 'Using Docker containers makes it easy to run independent app services together without data conflicts.',
    takeaway: 'Cuts 25 words of jargon into 14 crystal-clear words.'
  },
  {
    id: 'eli5',
    name: 'ELI5',
    icon: '👶',
    badge: 'Explain Like I\'m 5',
    tagline: 'Fun, intuitive analogies that make abstract concepts stick instantly.',
    description: 'Translates high-dimensional math, quantum mechanics, and financial instruments into everyday household metaphors.',
    inputLabel: 'Complex Concept',
    originalText: 'Zero-knowledge proofs allow a prover to mathematically demonstrate possession of a secret without revealing the secret itself.',
    outputLabel: 'Clearly ELI5 Metaphor',
    transformedText: 'Imagine proving to your friend that you know the secret password to a clubhouse by walking inside and retrieving their toy, without ever saying the password out loud.',
    takeaway: 'Instant intuitive mental model with zero math prerequisites.'
  },
  {
    id: 'grammar',
    name: 'Grammar & Tone',
    icon: '✍️',
    badge: 'Flawless Writing',
    tagline: 'Fix typos, punctuation, and awkward phrasing in 1-click.',
    description: 'Cleans up your draft messages while preserving your original personality and authentic voice.',
    inputLabel: 'Rushed Draft Message',
    originalText: 'me and alex was thinking if we can reschedule the call to tomorow coz the slides isnt ready yet.',
    outputLabel: 'Clearly Polished Text',
    transformedText: 'Alex and I were wondering if we could reschedule the call to tomorrow, as the presentation slides aren\'t ready yet.',
    takeaway: 'Fixed grammar, spelling, and preposition rules while keeping the tone natural.'
  },
  {
    id: 'formal',
    name: 'Professional',
    icon: '👔',
    badge: 'Executive Ready',
    tagline: 'Elevate casual notes into high-impact business communication.',
    description: 'Perfect for drafting sensitive emails to clients, C-suite executives, investors, or partner companies.',
    inputLabel: 'Casual Internal Slack Note',
    originalText: 'we messed up the database migration and servers crashed for 20 mins. fixing it now.',
    outputLabel: 'Clearly Executive Statement',
    transformedText: 'We encountered a temporary 20-minute service interruption during our scheduled database migration. Our engineering team resolved the underlying cause and implemented safeguard measures to prevent recurrence.',
    takeaway: 'Transformed panic into accountable, leadership-grade communication.'
  },
  {
    id: 'code',
    name: 'Code & Math',
    icon: '💻',
    badge: 'Engineer\'s Companion',
    tagline: 'Deconstruct complex regex, algorithms, SQL queries, and error traces.',
    description: 'Highlights time/space complexity, edge cases, and architectural tradeoffs line by line.',
    inputLabel: 'Cryptic Regex / Code',
    originalText: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$',
    outputLabel: 'Clearly Breakdown',
    transformedText: 'Validates a secure password between 8 and 32 characters requiring: at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&).',
    takeaway: 'Deconstructs regular expressions into readable security requirements.'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic Roast',
    icon: '🔥',
    badge: 'Brutally Honest',
    tagline: 'A hilarious reality check for corporate double-speak and marketing fluff.',
    description: 'Translates VC buzzwords, influencer hype, and PR spin into what people are actually thinking.',
    inputLabel: 'Corporate PR Announcement',
    originalText: 'We are restructuring our organizational synergies to maximize operational agility and stakeholder value creation.',
    outputLabel: 'Clearly Unfiltered Translation',
    transformedText: 'We overhired during the bull market, burned our cash reserves, and are now laying off 20% of the team while trying to sound strategic in the press release.',
    takeaway: 'The ultimate truth serum for corporate jargon.'
  }
];

export const ModeShowcase: React.FC = () => {
  const [selectedModeId, setSelectedModeId] = useState('simple');
  const activeMode = MODES_DATA.find(m => m.id === selectedModeId) || MODES_DATA[0];

  const handleSelectMode = (id: string) => {
    sound.playModeSwitch();
    setSelectedModeId(id);
  };

  return (
    <section id="modes" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <span>⚡ 6 Purpose-Built AI Lenses</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            Tailored comprehension modes.
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-xl">
            Whether you're debugging obscure code, reviewing contracts, or polishing an executive update, Clearly has the exact lens for the job.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 mb-12">
          {MODES_DATA.map((m) => {
            const isSelected = m.id === selectedModeId;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMode(m.id)}
                className={`flex items-center space-x-2.5 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105 border border-white/20'
                    : 'bg-[#080b16] hover:bg-[#101428] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Transformation Showcase Card */}
        <div className="rounded-3xl bg-[#04060d]/95 border border-white/10 p-6 sm:p-12 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl">{activeMode.icon}</span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">{activeMode.name} Mode</h3>
                <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  {activeMode.badge}
                </span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">{activeMode.tagline}</p>
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 font-mono font-bold w-fit shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              ✓ {activeMode.takeaway}
            </div>
          </div>

          {/* Before and After Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before / Original */}
            <div className="p-7 rounded-2xl bg-black/60 border border-white/5 flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-4">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                  <span>Before ({activeMode.inputLabel})</span>
                </div>
                <p className="text-slate-300 text-base leading-relaxed font-mono whitespace-pre-wrap">
                  "{activeMode.originalText}"
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs text-slate-500 font-mono">
                Selected on webpage
              </div>
            </div>

            {/* After / Clearly Output */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-cyan-950/20 to-black/60 border border-cyan-500/30 flex flex-col justify-between shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-4">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>{activeMode.outputLabel}</span>
                </div>
                <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
                  {activeMode.transformedText}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="text-cyan-300 font-bold">⚡ 1-Click In-Place Replace</span>
                <span className="text-slate-500">Esc to close</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
