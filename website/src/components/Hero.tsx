import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cpu, Play, Download, Terminal, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import { sound } from '../utils/sound';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Dynamic Aurora & Radial Lighting Meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-indigo-600/25 via-cyan-500/20 to-purple-600/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Prismatic Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-purple-500/10 border border-white/15 text-xs font-semibold mb-8 backdrop-blur-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)] group hover:scale-105 transition-transform cursor-pointer">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-200">Chrome Gemini Nano + Multi-Model AI Ready</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300 font-mono font-bold">0ms Local Latency</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* GIANT EDITORIAL HEADLINE */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight text-white max-w-6xl mx-auto leading-[0.95] mb-8 uppercase">
          Highlight anything.{' '}
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 via-purple-300 to-pink-400 filter drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]">
            Understand instantly.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-12">
          The ultra-minimal, liquid-glass Chrome extension that deconstructs complex jargon, cleans grammar, rewrites emails in-place, and explains code in 1-click. No sidebars. No bloat.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#install"
            onClick={() => sound.playSuccess()}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-9 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Download className="w-5 h-5 text-cyan-200" />
            <span>Add to Chrome — 100% Free</span>
          </a>

          <a
            href="#demo"
            onClick={() => sound.playClick()}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-5 rounded-2xl bg-[#080b16] hover:bg-[#0e1428] border border-white/15 hover:border-cyan-500/40 text-slate-200 font-bold text-base backdrop-blur-2xl transition-all duration-200 group shadow-2xl"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
            <span>Interactive 3D Sandbox</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Architecture Spec Pills */}
        <div className="pt-8 border-t border-white/10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 flex items-center space-x-3.5 hover:border-cyan-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">&lt; 20ms Latency</div>
              <div className="text-xs text-slate-400">Zero round-trips</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 flex items-center space-x-3.5 hover:border-indigo-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Gemini Nano</div>
              <div className="text-xs text-slate-400">100% Offline AI</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 flex items-center space-x-3.5 hover:border-emerald-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Zero Telemetry</div>
              <div className="text-xs text-slate-400">No logs, no tracking</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 flex items-center space-x-3.5 hover:border-purple-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">1-Click Rewrite</div>
              <div className="text-xs text-slate-400">In-place replacement</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
