import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Sparkles, Download, ArrowRight, Scan, Shield } from 'lucide-react';

export const DesktopPreview: React.FC = () => {
  return (
    <div className="text-center max-w-[720px] mx-auto">
      <span className="inline-flex items-center gap-1.5 text-[0.8125rem] px-3.5 py-1 rounded-full bg-[#E1993B]/10 border border-[#E1993B]/25 text-[var(--ink)] font-medium mb-4">
        <span className="w-2 h-2 rounded-full bg-[#E1993B] animate-pulse"></span>
        Standalone Reader Studio • Windows x64 Portable
      </span>

      <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)] tracking-tight">
        Clearly Reader Studio, for deep reading.
      </h2>
      <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3 leading-[1.6]">
        A distraction-free reading and document workbench. Paste text, research papers, code snippets, or contracts from any app and deconstruct them instantly across all 10 canonical lenses with native speech audio and offline heuristic fallback.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <Link
          to="/download"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.9375rem] font-semibold bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <Monitor className="w-4 h-4 text-[#E1993B]" />
          <span>Get Reader Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="/downloads/clearly-desktop-v1.0.0-windows.zip"
          download="clearly-desktop-v1.0.0-windows.zip"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[0.9375rem] font-medium border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)] transition-all bg-[var(--paper)]"
        >
          <Download className="w-4 h-4" />
          <span>Direct ZIP (Windows x64)</span>
        </a>
      </div>

      {/* Visual Studio Info */}
      <div className="mt-10 p-6 rounded-[var(--radius-xl)] bg-[var(--paper-raised)] border border-[var(--line)] flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--paper)] border border-[var(--line-strong)] text-xs font-mono text-[var(--ink)] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#E1993B]" />
          <span className="font-semibold">Clearly Reader Studio</span>
          <span className="bg-[var(--paper-raised)] border border-[var(--line)] rounded px-1.5 py-0.5 text-[11px] text-[var(--gray-600)]">
            Launch_Clearly_Reader.bat
          </span>
        </div>

        {/* Input Format Chips */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[
            { name: 'Research Papers', label: 'arXiv, PubMed, and journal preprints' },
            { name: 'Contracts & Terms', label: 'EULAs, NDAs, and TOS agreements' },
            { name: 'Code & Logs', label: 'Stack traces, algorithms, and regex' },
            { name: 'Technical Docs', label: 'API references and architectural specs' },
            { name: 'Notes & Drafts', label: 'Markdown, clipboard text, and articles' },
          ].map((item) => (
            <div
              key={item.name}
              title={item.label}
              className="px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper)] border border-[var(--line)] flex items-center gap-2 font-mono text-xs font-medium text-[var(--ink-soft)] shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
