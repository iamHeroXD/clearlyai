import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  FileText, 
  Share2, 
  Tag, 
  Clock, 
  Download,
  FolderOpen
} from 'lucide-react';
import { StructuredExplanation } from '../types';
import { playTextAudio } from '../services/desktopAiService';

interface LibraryViewProps {
  libraryItems: StructuredExplanation[];
  onDeleteItem: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenItemDetail: (item: StructuredExplanation) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  libraryItems,
  onDeleteItem,
  onShowToast,
  onOpenItemDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === 'all' || item.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(libraryItems, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `clearly_library_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported Library to JSON!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[var(--accent)]" />
            Your Saved Library
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Key definitions, summaries, and explanations you've saved for future reference.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          disabled={libraryItems.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] border border-[var(--line)] text-xs font-medium text-[var(--ink)] transition-all disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gray-500)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved explanations, terms, or notes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--paper-card)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder-[var(--gray-500)] focus:border-[var(--accent)] focus:outline-none font-sans shadow-sm"
          />
        </div>

        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[var(--paper-card)] border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none shadow-sm"
        >
          <option value="all">All Modes</option>
          <option value="simple">Simple Terms</option>
          <option value="define">Definitions</option>
          <option value="summarize">Summaries</option>
          <option value="example">Examples</option>
          <option value="translate">Translations</option>
        </select>
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[var(--paper-card)] border border-[var(--line)] space-y-3 shadow-sm">
          <FolderOpen className="w-10 h-10 text-[var(--accent)]/40 mx-auto" />
          <h3 className="text-sm font-semibold text-[var(--ink)]">No saved explanations found</h3>
          <p className="text-xs text-[var(--ink-soft)] max-w-sm mx-auto">
            When you're reading or exploring explanations on the Home screen, click the Bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] hover:border-[var(--line-strong)] transition-all flex flex-col justify-between space-y-4 shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20 capitalize font-medium">
                    {item.mode}
                  </span>
                  <span className="text-[11px] text-[var(--gray-500)] font-mono">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--ink)] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[var(--ink-soft)] leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                {item.keyTerms && item.keyTerms.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {item.keyTerms.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--paper-raised)] text-[var(--gray-600)] border border-[var(--line)]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => playTextAudio(item.summary)}
                    className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
                    title="Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.id, item.summary)}
                    className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-[var(--ink)] hover:bg-[var(--paper-raised)] transition-colors"
                    title="Copy"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-[var(--gray-500)] hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenItemDetail(item)}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
