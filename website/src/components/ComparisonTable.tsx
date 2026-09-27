import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface FeatureComparison {
  feature: string;
  clearly: boolean | string;
  grammarly: boolean | string;
  chatgptExt: boolean | string;
  dictExt: boolean | string;
}

const COMPARISONS: FeatureComparison[] = [
  {
    feature: 'In-Page Isolated Floating Card (Shadow DOM)',
    clearly: 'Yes — Shadow DOM isolated',
    grammarly: 'Inline badges & underlines',
    chatgptExt: 'Full browser sidebar',
    dictExt: 'Toolbar popup window'
  },
  {
    feature: 'On-Device AI Support (Chrome Gemini Nano)',
    clearly: true,
    grammarly: false,
    chatgptExt: false,
    dictExt: false
  },
  {
    feature: '1-Click In-Place Text Replacement',
    clearly: true,
    grammarly: true,
    chatgptExt: false,
    dictExt: false
  },
  {
    feature: 'Private Direct-to-Provider Requests (Zero Analytics)',
    clearly: true,
    grammarly: 'Account & cloud processing',
    chatgptExt: 'Account required',
    dictExt: 'Varies by provider'
  },
  {
    feature: 'Multi-Provider BYOK (Gemini, Claude, GPT, Ollama)',
    clearly: true,
    grammarly: false,
    chatgptExt: 'OpenAI only',
    dictExt: false
  },
  {
    feature: 'IPA Phonetics & Native Speech Synthesis',
    clearly: true,
    grammarly: false,
    chatgptExt: false,
    dictExt: 'Audio pronunciation'
  },
  {
    feature: 'ELI5, Legal Gotchas & 6+ Canonical Lenses',
    clearly: true,
    grammarly: false,
    chatgptExt: 'Requires manual prompting',
    dictExt: false
  },
  {
    feature: '100% Free & Open Source',
    clearly: true,
    grammarly: '\$30 / month',
    chatgptExt: '\$20 / month',
    dictExt: true
  }
];

export const ComparisonTable: React.FC = () => {
  return (
    <section id="comparison" className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <span>⚔️ Direct Comparison</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            How Clearly compares.
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-xl">
            Compare Clearly against traditional grammar extensions, heavy ChatGPT sidebars, and basic dictionary popups.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl bg-[#04060d]/95 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#0a0e1c]">
                  <th className="p-6 text-slate-300 font-bold text-base">Features & Capabilities</th>
                  <th className="p-6 bg-gradient-to-b from-cyan-950/40 to-indigo-950/30 border-x border-cyan-500/30">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span className="font-display font-black text-white text-lg">Clearly</span>
                    </div>
                  </th>
                  <th className="p-6 text-slate-400 font-semibold">Grammarly</th>
                  <th className="p-6 text-slate-400 font-semibold">ChatGPT Sidebar</th>
                  <th className="p-6 text-slate-400 font-semibold">Browser Dict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {COMPARISONS.map((row, idx) => (
                  <tr 
                    key={idx} 
                    onMouseEnter={() => sound.playClick()}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-6 text-slate-200 font-medium">
                      {row.feature}
                    </td>

                    {/* Clearly column */}
                    <td className="p-6 bg-cyan-950/20 border-x border-cyan-500/30">
                      {typeof row.clearly === 'boolean' ? (
                        <div className="flex items-center space-x-2 text-emerald-300 font-bold font-mono">
                          <Check className="w-5 h-5 bg-emerald-500/20 rounded-full p-0.5" />
                          <span>Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                          <Check className="w-5 h-5 bg-cyan-500/20 rounded-full p-0.5" />
                          <span>{row.clearly}</span>
                        </div>
                      )}
                    </td>

                    {/* Grammarly */}
                    <td className="p-6 text-slate-400">
                      {typeof row.grammarly === 'boolean' ? (
                        row.grammarly ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-500" />
                      ) : (
                        <span>{row.grammarly}</span>
                      )}
                    </td>

                    {/* ChatGPT Extension */}
                    <td className="p-6 text-slate-400">
                      {typeof row.chatgptExt === 'boolean' ? (
                        row.chatgptExt ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-500" />
                      ) : (
                        <span>{row.chatgptExt}</span>
                      )}
                    </td>

                    {/* Browser Dict */}
                    <td className="p-6 text-slate-400">
                      {typeof row.dictExt === 'boolean' ? (
                        row.dictExt ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-500" />
                      ) : (
                        <span>{row.dictExt}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
