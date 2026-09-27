import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../../types';

export const HistoryViewer: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (res) => {
        if (res?.success && Array.isArray(res.data)) {
          setHistory(res.data);
        }
      });
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'TOGGLE_STAR_HISTORY_ITEM', payload: { id } }, (res) => {
        if (res?.success) {
          setHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
          );
        }
      });
    } else {
      setHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
      );
    }
  };

  const handleDeleteItem = (id: string) => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'DELETE_HISTORY_ITEM', payload: { id } }, () => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      });
    }
  };

  const handleClearAll = () => {
    if (!window.confirm('Are you sure you want to clear your entire local reading history?')) return;
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'CLEAR_HISTORY' }, () => {
        setHistory([]);
      });
    }
  };

  const handleExportAnki = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'EXPORT_ANKI_FLASHCARDS', payload: { starredOnly: onlyStarred } }, (res) => {
        if (res?.success && res.data) {
          const blob = new Blob([res.data], { type: 'text/tab-separated-values;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const downloadAnchor = document.createElement('a');
          downloadAnchor.setAttribute('href', url);
          downloadAnchor.setAttribute('download', `clearly_anki_cards_${new Date().toISOString().slice(0, 10)}.tsv`);
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const handleExportMarkdown = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'EXPORT_HISTORY', payload: { format: 'markdown', starredOnly: onlyStarred } }, (res) => {
        if (res?.success && res.data) {
          const blob = new Blob([res.data], { type: 'text/markdown;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const downloadAnchor = document.createElement('a');
          downloadAnchor.setAttribute('href', url);
          downloadAnchor.setAttribute('download', `clearly_notebook_${new Date().toISOString().slice(0, 10)}.md`);
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `clearly_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = history.filter((item) => {
    if (onlyStarred && !item.isStarred) return false;

    const matchesSearch =
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.response.summary && item.response.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.response.rewrittenText && item.response.rewrittenText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.pageTitle && item.pageTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = selectedMode === 'all' || item.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Personal Knowledge Base & History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, review, star vocabulary, and export your highlighted notes to Notion, Obsidian, or Anki flashcards.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportAnki}
            disabled={history.length === 0}
            className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            title="Export to Anki / Quizlet spaced-repetition flashcards"
          >
            🎴 Export Anki (.tsv)
          </button>
          <button
            type="button"
            onClick={handleExportMarkdown}
            disabled={history.length === 0}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            title="Export full notes to Notion or Obsidian"
          >
            📥 Export Markdown
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={history.length === 0}
            className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Search vocabulary, concepts, rewritten text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() => setOnlyStarred(!onlyStarred)}
          className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
            onlyStarred
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
          }`}
        >
          <span>⭐</span> Starred Only
        </button>

        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
        >
          <option value="all">All Modes ({history.length})</option>
          <option value="explain">Explain</option>
          <option value="polish">Polish Writing</option>
          <option value="rephrase">Rephrase</option>
          <option value="concise">Make Concise</option>
          <option value="expand">Expand</option>
          <option value="legal">Legal Risk Scan</option>
          <option value="tldr">TL;DR</option>
          <option value="simplify">Simplify</option>
          <option value="define">Define</option>
          <option value="code">Code</option>
          <option value="math">Math</option>
          <option value="learning">Learning</option>
          <option value="translate">Translate</option>
        </select>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {history.length === 0
              ? 'No reading history yet. Highlight any text on any webpage to begin!'
              : 'No matching history items found.'}
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStar(item.id, e)}
                        className={`text-sm transition-transform hover:scale-125 ${
                          item.isStarred ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
                        }`}
                        title={item.isStarred ? 'Unstar bookmark' : 'Star vocabulary / note'}
                      >
                        {item.isStarred ? '⭐' : '☆'}
                      </button>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {item.mode}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      {item.pageTitle && (
                        <span className="text-[11px] text-slate-500 truncate max-w-xs">
                          · {item.pageTitle}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      "{item.originalText}"
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {item.response.rewrittenText ||
                        item.response.simplifiedText ||
                        item.response.summary ||
                        item.response.tldrPoints?.join(' • ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete item"
                    >
                      ✕
                    </button>
                    <span className="text-xs text-slate-400 pl-1">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2.5 text-slate-700 dark:text-slate-300">
                    {item.response.rewrittenText && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                          ✍️ Polished Result:
                        </span>
                        <div className="text-slate-900 dark:text-slate-100 font-medium whitespace-pre-wrap">
                          {item.response.rewrittenText}
                        </div>
                      </div>
                    )}
                    {item.response.tldrPoints && item.response.tldrPoints.length > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg space-y-1">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                          ⚡ Key Takeaways (TL;DR):
                        </span>
                        {item.response.tldrPoints.map((pt, idx) => (
                          <div key={idx} className="text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.response.legalFlags && (
                      <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg space-y-1.5">
                        <div className="font-semibold text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <span>⚖️ Legal Risk ({item.response.legalFlags.riskLevel}):</span>
                        </div>
                        <div className="text-slate-800 dark:text-slate-200 text-xs">
                          {item.response.legalFlags.summary}
                        </div>
                        {item.response.legalFlags.flags && item.response.legalFlags.flags.length > 0 && (
                          <ul className="list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                            {item.response.legalFlags.flags.map((flag, idx) => (
                              <li key={idx}>{flag}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {item.response.example && (
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Example / Analogy:
                        </span>
                        {item.response.example}
                      </div>
                    )}
                    {item.response.whyItMatters && (
                      <div className="text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Why it matters:</span> {item.response.whyItMatters}
                      </div>
                    )}
                    {item.pageUrl && (
                      <div className="text-[11px] text-blue-500 truncate">
                        <a href={item.pageUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          Source URL: {item.pageUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
