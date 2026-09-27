import React, { useState } from 'react';
import { Download, Chrome, Check, Copy, Terminal, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

export const InstallGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    sound.playSuccess();
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <section id="install" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Giant Call to Action Card */}
        <div className="rounded-3xl p-8 sm:p-16 bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-[#04060e] border border-cyan-500/30 relative overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-3xl mb-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready in 30 Seconds</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight leading-tight mb-6">
              Get instant clarity today.
            </h2>
            
            <p className="text-slate-200 text-base sm:text-xl mb-10 leading-relaxed font-normal">
              No account required. Install the lightweight extension, highlight any text across the web, and experience pure comprehension.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#developer-install"
                onClick={() => sound.playSuccess()}
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-9 py-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-base shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                <Chrome className="w-5 h-5 text-indigo-600" />
                <span>Load Unpacked Extension</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base backdrop-blur-md transition-all"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* 3 Step Install Guide */}
        <div id="developer-install" className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-display font-extrabold text-white text-center mb-10">
            Install in 3 Simple Steps
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-7 rounded-2xl bg-[#060812] border border-white/10 relative">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 font-extrabold flex items-center justify-center text-sm mb-4 border border-indigo-500/40">
                1
              </div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Build or Download</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-5">
                Run the build command or download the latest release bundle from GitHub.
              </p>
              <div className="p-3 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-slate-200 flex items-center justify-between">
                <span>npm run build</span>
                <button
                  onClick={() => copyToClipboard('npm run build', 1)}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {copiedStep === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-2xl bg-[#060812] border border-white/10 relative">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/30 text-cyan-300 font-extrabold flex items-center justify-center text-sm mb-4 border border-cyan-500/40">
                2
              </div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Open Extensions</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-5">
                Open Chrome extensions page and toggle on Developer Mode in the top right.
              </p>
              <div className="p-3 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-slate-200 flex items-center justify-between">
                <span>chrome://extensions</span>
                <button
                  onClick={() => copyToClipboard('chrome://extensions', 2)}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {copiedStep === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-2xl bg-[#060812] border border-white/10 relative">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-300 font-extrabold flex items-center justify-center text-sm mb-4 border border-purple-500/40">
                3
              </div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Load Unpacked</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-5">
                Click <strong>Load unpacked</strong> and select the generated <code className="text-cyan-300">dist/</code> folder.
              </p>
              <div className="p-3 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-emerald-400 flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Ready to use instantly!</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
