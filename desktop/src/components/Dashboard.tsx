import React from 'react';
import { 
  Zap, 
  Clock, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Activity, 
  Cpu, 
  ArrowUpRight, 
  ShieldCheck, 
  Play,
  RotateCcw,
  Star
} from 'lucide-react';
import { UsageStats, DeconstructResult } from '../types';

interface DashboardProps {
  stats: UsageStats;
  recentResults: DeconstructResult[];
  onOpenScreenController: () => void;
  onOpenHUD: () => void;
  onSelectResult: (result: DeconstructResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentResults,
  onOpenScreenController,
  onOpenHUD,
  onSelectResult,
}) => {
  const lensColors: Record<string, string> = {
    polish: '#E1993B',
    meaning: '#60A5FA',
    simplify: '#34D399',
    deconstruct: '#A78BFA',
    counter: '#F87171',
    translate: '#FBBF24',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#161614] via-[#1F1F1C] to-[#161614] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-brand/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-brand animate-ping"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-brand">
              Ambient Screen Engine Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif italic text-[#F5F5F1] font-medium tracking-tight">
            Clearly Command Center
          </h1>
          <p className="text-xs md:text-sm text-[#8E8E86] mt-1 max-w-xl">
            Active background text resolution across all desktop apps. Deconstructing cognitive complexity at zero latency.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={onOpenHUD}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F5F5F1] text-xs font-medium border border-white/10 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-brand" />
            <span>Open Spotlight HUD</span>
          </button>

          <button
            onClick={onOpenScreenController}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-brand hover:bg-amber-400 text-black text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Screen Controller</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#161614] border border-white/5 hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-[#8E8E86] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Lookups Today</span>
            <Activity className="w-4 h-4 text-amber-brand" />
          </div>
          <div className="text-3xl font-mono font-medium text-[#F5F5F1]">
            {stats.lookupsToday}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+18% from yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#161614] border border-white/5 hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-[#8E8E86] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Focus Time Saved</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-medium text-[#F5F5F1]">
            {(stats.savedMinutes / 60).toFixed(1)} <span className="text-sm text-[#8E8E86] font-normal">hrs</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#8E8E86] font-mono">
            <span>~{stats.savedMinutes} minutes total</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#161614] border border-white/5 hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-[#8E8E86] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Words Refined</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-mono font-medium text-[#F5F5F1]">
            {stats.wordsRefined.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#8E8E86] font-mono">
            <span>Across 6 lenses</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#161614] border border-white/5 hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-[#8E8E86] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Avg Latency</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-mono font-medium text-[#F5F5F1]">
            {stats.latencyAvgMs} <span className="text-sm text-[#8E8E86] font-normal">ms</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>Sub-50ms local engine</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Lens Breakdown & Active Model Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lens Distribution Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#161614] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#F5F5F1] font-mono uppercase tracking-wider">
              Lens Deconstruction Distribution
            </h3>
            <span className="text-xs text-[#8E8E86] font-mono">Last 30 Days</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(stats.lensUsage).map(([lens, count]) => {
              const max = Math.max(...Object.values(stats.lensUsage), 1);
              const percentage = Math.round((count / max) * 100);
              const color = lensColors[lens] || '#E1993B';

              return (
                <div key={lens} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="capitalize text-[#D8D8D2] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                      {lens}
                    </span>
                    <span className="text-[#8E8E86]">{count} scans</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Engine Status (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#161614] border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#F5F5F1] font-mono uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-brand" />
                Active Model Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                Online
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#F5F5F1]">Chrome Gemini Nano</div>
                  <div className="text-[11px] text-[#8E8E86]">Zero-latency on-device neural core</div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#F5F5F1]">Gemini 1.5 / 2.0 Flash Cloud</div>
                  <div className="text-[11px] text-[#8E8E86]">High-reasoning cloud fallback</div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 text-[#8E8E86] px-2 py-1 rounded">
                  Ready
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#F5F5F1]">Local Ollama / Llama 3.2</div>
                  <div className="text-[11px] text-[#8E8E86]">Air-gapped private localhost</div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 text-[#8E8E86] px-2 py-1 rounded">
                  Standby
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8E8E86]">
            <span>Privacy: 100% Client Encrypted</span>
            <span className="text-amber-brand">Zero Data Retention</span>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Activity Log */}
      <div className="p-6 rounded-2xl bg-[#161614] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#F5F5F1] font-mono uppercase tracking-wider">
            Recent Screen Deconstructions
          </h3>
          <span className="text-xs text-[#8E8E86] font-mono">
            {recentResults.length} records in memory
          </span>
        </div>

        {recentResults.length === 0 ? (
          <div className="py-8 text-center text-[#8E8E86] text-xs">
            No recent deconstructions yet. Highlight text in the Screen Controller to get started!
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentResults.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="py-3 px-2 flex items-center justify-between hover:bg-white/[0.02] rounded-lg cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden pr-4">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: lensColors[item.lens] || '#E1993B' }}
                  ></span>
                  <div className="truncate">
                    <div className="text-xs font-medium text-[#F5F5F1] truncate max-w-md">
                      &ldquo;{item.originalText}&rdquo;
                    </div>
                    <div className="text-[11px] text-[#8E8E86] truncate max-w-lg">
                      {item.result}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-xs font-mono text-[#8E8E86]">
                  <span className="capitalize px-2 py-0.5 rounded bg-white/5 text-[10px]">
                    {item.lens}
                  </span>
                  <span>{item.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
