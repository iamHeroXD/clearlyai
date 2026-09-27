import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Bookmark, 
  Download, 
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import { StructuredExplanation } from '../types';

interface HistoryViewProps {
  historyItems: StructuredExplanation[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onSaveToLibrary: (item: StructuredExplanation) => void;
  onReExplain: (item: StructuredExplanation) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onClearHistory,
  onDeleteItem,
  onSaveToLibrary,
  onReExplain,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Mode,Title,Original Text,Summary,Latency(ms)']
        .concat(
          historyItems.map(
            (i) =>
              `"${new Date(i.timestamp).toISOString()}","${i.mode}","${i.title.replace(/"/g, '""')}","${i.originalText.replace(/"/g, '""')}","${i.summary.replace(/"/g, '""')}",${i.latencyMs}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clearly_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onShowToast('Exported history to CSV!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--accent)]" />
            Explanation History
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Chronological audit of every text you've highlighted and deconstructed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={historyItems.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-xs font-medium text-[var(--ink)] transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onClearHistory}
            disabled={historyItems.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-600 transition-all disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gray-500)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history by keyword, title, or original text..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--paper-card)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder-[var(--gray-500)] focus:border-[var(--accent)] focus:outline-none font-sans shadow-sm"
        />
      </div>

      {/* Timeline List */}
      {filteredHistory.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] space-y-3 shadow-sm">
          <Inbox className="w-10 h-10 text-[var(--accent)]/40 mx-auto" />
          <h3 className="text-sm font-semibold text-[var(--ink)]">No history records</h3>
          <p className="text-xs text-[var(--ink-soft)] max-w-sm mx-auto">
            Your recent screen selections and explanations will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] hover:border-[var(--line-strong)] transition-all space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20 capitalize font-medium">
                    {item.mode}
                  </span>
                  <span className="font-medium text-[var(--ink)]">{item.title}</span>
                </div>

                <span className="text-[11px] text-[var(--gray-500)] font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.latencyMs}ms
                </span>
              </div>

              {/* Original snippet */}
              <div className="text-xs text-[var(--ink-soft)] font-mono bg-[var(--paper-raised)] p-2.5 rounded-xl border border-[var(--line)] truncate">
                &ldquo;{item.originalText}&rdquo;
              </div>

              {/* Resolved Explanation */}
              <div className="text-xs text-[var(--ink)] leading-relaxed font-sans">
                {item.summary}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.id, item.summary)}
                    className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
                    title="Copy"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      onSaveToLibrary(item);
                      onShowToast('Saved to Library!', 'success');
                    }}
                    className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--accent)] hover:bg-[var(--paper-raised)] transition-colors"
                    title="Bookmark to Library"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onReExplain(item)}
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-open in Home</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
