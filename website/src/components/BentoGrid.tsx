import React from 'react';
import { 
  Zap, Cpu, ShieldCheck, Sparkles, Volume2, Bookmark, 
  Terminal, Globe, Lock, ArrowUpRight, CheckCircle2, Layers, Flame, ArrowRight
} from 'lucide-react';
import { sound } from '../utils/sound';

export const BentoGrid: React.FC = () => {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture & Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            Everything you need.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Zero bloat, pure clarity.
            </span>
          </h2>
          <p className="mt-5 text-slate-300 text-base sm:text-xl leading-relaxed">
            Built with modern web standards and high-performance Web APIs to provide instant answers without draining battery or cluttering your workflow.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Bento Card 1: 0ms Gemini Nano Local (Large 2 Cols) */}
          <div 
            onMouseEnter={() => sound.playClick()}
            className="md:col-span-2 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#020306] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 relative group overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-[90px] group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                01 // window.ai (Built-in Chrome)
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-4">
              0ms Latency with On-Device Gemini Nano
            </h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              When enabled in Chrome, Clearly processes text entirely on your machine's NPU/GPU using Google Chrome's built-in Gemini Nano model. Zero cloud lag, no network requests, and works 100% offline.
            </p>

            {/* Visual Chip Representation */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-300 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-100 font-semibold">Local Neural Processing Unit (NPU)</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <span>Response Time: &lt; 20ms</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: 1-Click Writing & Rephrase (1 Col) */}
          <div 
            onMouseEnter={() => sound.playClick()}
            className="rounded-3xl p-8 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#020306] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 relative group overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-indigo-400 font-bold">02 // IN-PLACE</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                1-Click In-Place Rewrite
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Highlight draft text inside Gmail, Slack, Twitter/X, or Notion. Clearly replaces it directly inside your active input box with 1 click.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supports contenteditable & textareas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Executive tone elevation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Grammar & punctuation correction</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: 100% Privacy & Encrypted Vault (1 Col) */}
          <div 
            onMouseEnter={() => sound.playClick()}
            className="rounded-3xl p-8 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#020306] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 relative group overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">03 // PRIVACY</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                Zero Telemetry Vault
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                We never collect your browsing history or highlighted text. Everything stays strictly in your browser.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-emerald-400 flex items-center space-x-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Encrypted in chrome.storage.local</span>
            </div>
          </div>

          {/* Bento Card 4: Multi-Model Freedom (2 Cols) */}
          <div 
            onMouseEnter={() => sound.playClick()}
            className="md:col-span-2 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#020306] border border-white/10 hover:border-purple-500/40 transition-all duration-300 relative group overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Globe className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-purple-300 font-bold">04 // MULTI-MODEL</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-4">
              Connect Any AI Model You Love
            </h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
              You are never locked in. Bring your own API key for Google Gemini 2.0 Flash, OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, or run completely local with Ollama (`llama3.2`, `mistral`, `deepseek-r1`).
            </p>

            {/* Provider Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-slate-300">
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center hover:bg-white/[0.08] transition-colors">
                <div className="text-indigo-400 font-bold mb-1">Gemini 2.0 Flash</div>
                <div className="text-[10px] text-slate-500">Google AI Studio</div>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center hover:bg-white/[0.08] transition-colors">
                <div className="text-purple-400 font-bold mb-1">Claude 3.5 Sonnet</div>
                <div className="text-[10px] text-slate-500">Anthropic API</div>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center hover:bg-white/[0.08] transition-colors">
                <div className="text-emerald-400 font-bold mb-1">GPT-4o mini</div>
                <div className="text-[10px] text-slate-500">OpenAI API</div>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center hover:bg-white/[0.08] transition-colors">
                <div className="text-amber-400 font-bold mb-1">Ollama Local</div>
                <div className="text-[10px] text-slate-500">localhost:11434</div>
              </div>
            </div>
          </div>

          {/* Bento Card 5: Audio Pronunciation */}
          <div 
            onMouseEnter={() => sound.playClick()}
            className="rounded-3xl p-8 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#020306] border border-white/10 hover:border-amber-500/40 transition-all duration-300 relative group overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Volume2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">05 // AUDIO</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                Audio & IPA Phonetics
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Never mispronounce unfamiliar terms or international phrases again with Web Speech synthesis.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-amber-300">
              /ˌæm.bɪˈɡjuː.ə.ti/ • Pronounce
            </div>
          </div>

          {/* Bento Card 6: Starred Vocabulary & Obsidian Export */}
          <div 
            onMouseEnter={() => sound.playClick()}
            className="md:col-span-2 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#020306] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 relative group overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Bookmark className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-indigo-300 font-bold">06 // EXPORT</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-4">
              Starred Glossary & 1-Click Markdown Sync
            </h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Save words, definitions, and code explanations with a single click. Export your entire personal glossary to Obsidian, Notion, or Anki flashcards whenever you want.
            </p>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-300">
              <span className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10">.md Export</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10">CSV / Anki</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10">Notion Sync</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
