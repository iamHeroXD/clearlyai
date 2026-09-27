import React, { useState } from 'react';
import { Zap, Cpu, Activity, ShieldCheck, Gauge, Check } from 'lucide-react';
import { sound } from '../utils/sound';

export const SpeedBenchmark: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'latency' | 'privacy' | 'cost'>('latency');

  const models = [
    {
      name: 'Chrome Gemini Nano (Local)',
      provider: 'On-Device NPU / GPU',
      latency: '18ms',
      latencyPercent: 6,
      tokensPerSec: '120 tok/s',
      privacy: '100% Zero-Cloud',
      cost: '\$0.00 (Unlimited Free)',
      isLeader: true,
      color: 'from-cyan-400 to-emerald-400',
    },
    {
      name: 'Google Gemini 2.0 Flash',
      provider: 'Google Cloud API',
      latency: '82ms',
      latencyPercent: 28,
      tokensPerSec: '145 tok/s',
      privacy: 'Direct API (No Logs)',
      cost: 'Free Tier / \$0.0001',
      isLeader: false,
      color: 'from-indigo-400 to-purple-400',
    },
    {
      name: 'OpenAI GPT-4o mini',
      provider: 'OpenAI Cloud',
      latency: '240ms',
      latencyPercent: 72,
      tokensPerSec: '90 tok/s',
      privacy: 'Cloud API',
      cost: '\$0.00015',
      isLeader: false,
      color: 'from-blue-400 to-indigo-500',
    },
    {
      name: 'Anthropic Claude 3.5 Sonnet',
      provider: 'Anthropic API',
      latency: '340ms',
      latencyPercent: 95,
      tokensPerSec: '75 tok/s',
      privacy: 'Cloud API',
      cost: '\$0.003',
      isLeader: false,
      color: 'from-amber-400 to-rose-500',
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill & Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-Time Performance Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered to be imperceptible.
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Compare latency, privacy levels, and operational costs across Clearly's supported inference engines.
          </p>
        </div>

        {/* Benchmark Card */}
        <div className="rounded-3xl bg-[#080a14]/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          
          {/* Filter Pills */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <button
              onClick={() => { sound.playClick(); setActiveTab('latency'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'latency'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              ⚡ Latency (Time to First Token)
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('privacy'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              🔒 Privacy & Data Flow
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('cost'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cost'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              💰 Cost Per 1,000 Lookups
            </button>
          </div>

          {/* Benchmark Bars List */}
          <div className="space-y-6">
            {models.map((m, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl transition-all duration-300 ${
                  m.isLeader 
                    ? 'bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-black/60 border border-cyan-500/30 shadow-xl' 
                    : 'bg-black/40 border border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-base">{m.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({m.provider})</span>
                    {m.isLeader && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold font-mono">
                        ⚡ FASTEST & LOCAL
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-sm font-bold text-cyan-300">
                    {activeTab === 'latency' && `TTFT: ${m.latency}`}
                    {activeTab === 'privacy' && m.privacy}
                    {activeTab === 'cost' && m.cost}
                  </div>
                </div>

                {/* Animated Visual Latency Bar */}
                {activeTab === 'latency' && (
                  <div className="w-full bg-black/60 rounded-full h-3 p-0.5 border border-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-1000`}
                      style={{ width: `${Math.max(m.latencyPercent, 8)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
            <span>* Representative lab measurements on 50-word text excerpts. Actual latency varies by network and hardware.</span>
            <span className="text-slate-400">Zero cloud round-trips when running on-device (Nano / Ollama)</span>
          </div>

        </div>

      </div>
    </section>
  );
};
