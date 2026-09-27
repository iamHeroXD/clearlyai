import React, { useState } from 'react';
import { Clock, TrendingUp, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

export const RoiCalculator: React.FC = () => {
  const [readingHours, setReadingHours] = useState(2.5);
  const [emailsCount, setEmailsCount] = useState(15);

  // Time saved formula:
  // Reading speed boost: ~35% time saved on complex jargon & deconstruction
  // Writing speed boost: ~3 mins saved per polished email/message
  const dailyReadingSavedMins = readingHours * 60 * 0.35;
  const dailyWritingSavedMins = emailsCount * 3.2;
  const totalDailySavedHours = (dailyReadingSavedMins + dailyWritingSavedMins) / 60;
  const annualHoursSaved = Math.round(totalDailySavedHours * 240); // 240 work days/yr
  const annualValueSaved = Math.round(annualHoursSaved * 65); // $65/hr avg knowledge worker value

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Productivity Multiplier</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calculate your time saved.
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            See how much cognitive fatigue and time you reclaim by deconstructing dense text with Clearly.
          </p>
        </div>

        {/* Interactive Calculator Frame */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#080c16] to-[#04060c] border border-white/10 p-6 sm:p-12 shadow-2xl backdrop-blur-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Sliders Input Column */}
            <div className="space-y-8">
              {/* Slider 1: Reading Hours */}
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-200 mb-2">
                  <span>Daily Reading / Research:</span>
                  <span className="font-mono text-cyan-400 text-base">{readingHours} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={readingHours}
                  onChange={(e) => {
                    sound.playClick();
                    setReadingHours(parseFloat(e.target.value));
                  }}
                  className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>30 mins</span>
                  <span>4 hours</span>
                  <span>8 hours</span>
                </div>
              </div>

              {/* Slider 2: Emails & Messages Written */}
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-200 mb-2">
                  <span>Emails / Slack Messages Drafted:</span>
                  <span className="font-mono text-indigo-400 text-base">{emailsCount} / day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={emailsCount}
                  onChange={(e) => {
                    sound.playClick();
                    setEmailsCount(parseInt(e.target.value));
                  }}
                  className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-indigo-400 border border-white/10"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>5 drafts</span>
                  <span>30 drafts</span>
                  <span>60 drafts</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 leading-relaxed">
                💡 Calculations based on eliminating context switching, instant 1-click in-place rewriting, and sub-second comprehension.
              </div>
            </div>

            {/* Results Display Column */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/60 border border-indigo-500/30 text-center shadow-xl">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
                Annual Productivity Gain
              </span>
              
              <div className="my-4">
                <div className="text-5xl sm:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
                  {annualHoursSaved} hrs
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  reclaimed per year ({Math.round(totalDailySavedHours * 10) / 10} hrs saved every single day)
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400">Equivalent Value</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                    \${annualValueSaved.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Your Investment</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                    \$0.00 Free
                  </div>
                </div>
              </div>

              <a
                href="#install"
                className="mt-6 w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
              >
                <span>Reclaim Your Time — Install Free</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
