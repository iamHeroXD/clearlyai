import React, { useState } from 'react';

export const KnowledgeCard: React.FC = () => {
  const [starred, setStarred] = useState(true);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const u = new SpeechSynthesisUtterance('Ambiguity');
      u.rate = 0.9;
      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const copyExport = (format: string) => {
    let content = '';
    if (format === 'Markdown') {
      content = '### Ambiguity\n**/ˌæm.bɪˈɡjuː.ə.ti/**\n> Open to more than one interpretation; not clearly defined.\n';
    } else if (format === 'CSV') {
      content = '"Ambiguity","/ˌæm.bɪˈɡjuː.ə.ti/","Open to more than one interpretation; not clearly defined."';
    } else if (format === 'Anki') {
      content = 'Ambiguity\t/ˌæm.bɪˈɡjuː.ə.ti/<br>Open to more than one interpretation; not clearly defined.';
    }
    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1200);
  };

  return (
    <div className="max-w-[420px] mx-auto border border-[var(--line)] rounded-[var(--radius-lg)] p-7 bg-[var(--paper)] shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[1.375rem] font-semibold text-[var(--ink)] tracking-tight">
            Ambiguity
          </div>
          <div className="font-mono text-[0.875rem] text-[var(--gray-600)] mt-1">
            /ˌæm.bɪˈɡjuː.ə.ti/
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Speaker Button */}
          <button
            onClick={speak}
            aria-label="Play pronunciation"
            className={`w-8 h-8 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--gray-600)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors ${
              isPlaying ? 'border-[var(--accent)] text-[var(--accent)]' : ''
            }`}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9v6h4l5 5V4L8 9H4z"/>
              <path d="M16.5 8.5a5 5 0 0 1 0 7"/>
            </svg>
          </button>

          {/* Star Button */}
          <button
            onClick={() => setStarred(!starred)}
            aria-label={starred ? 'Saved to notebook' : 'Star to notebook'}
            aria-pressed={starred}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              starred
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent'
                : 'border-[var(--line-strong)] text-[var(--gray-600)] hover:border-[var(--ink)]'
            }`}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2l2.9 6.6L22 9.6l-5 4.7L18.2 22 12 18.3 5.8 22 7 14.3l-5-4.7 7.1-1z"/>
            </svg>
          </button>
        </div>
      </div>

      <p className="text-[0.9375rem] text-[var(--ink-soft)] mt-3 leading-[1.55]">
        Open to more than one interpretation; not clearly defined.
      </p>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between flex-wrap gap-3">
        <span className="text-[0.8125rem] text-[var(--gray-500)]">
          {starred ? 'Saved to notebook' : 'Click star to save'}
        </span>

        <div className="flex items-center gap-1.5">
          {['Markdown', 'CSV', 'Anki'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => copyExport(fmt)}
              className="text-[0.8125rem] px-3 py-1 rounded-full border border-[var(--line-strong)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            >
              {copiedFormat === fmt ? 'Copied' : fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
