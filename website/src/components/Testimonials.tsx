import React from 'react';
import { Star, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Elena Rostova',
      role: 'Staff AI Researcher, Autonomous Systems',
      initials: 'ER',
      gradient: 'from-cyan-500 to-indigo-600',
      badge: 'Academic & Papers',
      content: 'I read 15-20 machine learning preprints a week. Clearly’s ELI5 and Simple modes explain dense math lemmas in seconds. And because it runs Gemini Nano on-device, it feels instant.',
      metric: 'Saved 6+ hrs/week',
      rating: 5,
    },
    {
      name: 'Marcus Vance',
      role: 'Founding Engineer @ VectorScale',
      initials: 'MV',
      gradient: 'from-indigo-500 to-purple-600',
      badge: 'Code & Writing',
      content: 'The 1-click in-place rewrite inside GitHub PRs and Slack is phenomenal. I don’t have to copy-paste back and forth from ChatGPT sidebars anymore. It just fixes the sentence right where I typed it.',
      metric: '10x Faster PR Comments',
      rating: 5,
    },
    {
      name: 'Sarah Chen, Esq.',
      role: 'Fintech Corporate Counsel',
      initials: 'SC',
      gradient: 'from-purple-500 to-rose-600',
      badge: 'Legal & Risk Review',
      content: 'Scanning 80-page vendor SaaS agreements for aggressive IP transfer clauses used to take hours. Clearly highlights the gotchas and flags hidden traps in 1-click. Zero telemetry means my client data stays safe.',
      metric: 'Zero Data Leaks',
      rating: 5,
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Loved by 12,000+ Researchers & Engineers</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            Clear thinkers read faster.
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-xl">
            Hear from researchers, engineers, and executives who turned information overload into instantaneous clarity.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sound.playClick()}
              className="rounded-3xl bg-[#060812] border border-white/10 p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 shadow-2xl group"
            >
              <div>
                {/* Rating & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                    {r.badge}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                  "{r.content}"
                </p>
              </div>

              {/* Author Info with Safe Gradient Initials */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${r.gradient} flex items-center justify-center font-bold text-white text-sm shadow-md font-display border border-white/20`}>
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {r.name}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1">{r.role}</div>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {r.metric}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
