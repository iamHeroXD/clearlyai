import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Star, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Volume2, 
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { DeconstructResult, LensType } from '../types';
import { playTextToSpeech } from '../services/desktopAiService';

interface HistoryVaultProps {
  results: DeconstructResult[];
  onToggleStar: (id: string) => void;
  onClearHistory: () => void;
  onSelectResult: (result: DeconstructResult) => void;
}

export const HistoryVault: React.FC<HistoryVaultProps> = ({
  results,
  onToggleStar,
  onClearHistory,
  onSelectResult,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLens, setFilterLens] = useState<string>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredResults = results.filter((item) => {
    const matchesSearch =
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.result.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLens = filterLens === 'all' || item.lens === filterLens;
    const matchesStarred = !onlyStarred || item.starred;
    return matchesSearch && matchesLens && matchesStarred;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Date,Lens,Original Text,Deconstructed Result,Latency(ms)']
        .concat(
          results.map(
            (r) =>
              `"${new Date(r.timestamp).toISOString()}","${r.lens}","${r.originalText.replace(/"/g, '""')}","${r.result.replace(/"/g, '""')}",${r.latencyMs}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clearly_vault_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161614] border border-white/10">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-[#F5F5F1] flex items-center gap-2">
            <History className="w-5 h-5 text-amber-brand" />
            Deconstruction Vault & Starred Glossary
          </h2>
          <p className="text-xs text-[#8E8E86] mt-0.5">
            Search, revisit, export, and manage your historical screen resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F5F5F1] border border-white/5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-400 border border-red-500/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E86]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search original text or resolution keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161614] border border-white/10 text-xs text-[#F5F5F1] placeholder-[#8E8E86]/50 focus:border-amber-brand/50 focus:outline-none font-sans"
          />
        </div>

        {/* Filter by lens */}
        <div className="flex items-center gap-2">
          <select
            value={filterLens}
            onChange={(e) => setFilterLens(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#161614] border border-white/10 text-xs text-[#F5F5F1] focus:outline-none font-mono"
          >
            <option value="all">All Lenses</option>
            <option value="polish">Polish</option>
            <option value="meaning">Meaning</option>
            <option value="simplify">Simplify</option>
            <option value="deconstruct">Deconstruct</option>
            <option value="counter">Counter</option>
            <option value="translate">Translate</option>
          </select>

          {/* Starred filter button */}
          <button
            onClick={() => setOnlyStarred(!onlyStarred)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              onlyStarred
                ? 'bg-amber-brand/20 text-amber-brand border border-amber-brand/40'
                : 'bg-[#161614] text-[#8E8E86] border border-white/10 hover:text-[#F5F5F1]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyStarred ? 'fill-current' : ''}`} />
            <span>Starred</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#161614] border border-white/5 space-y-2">
            <Sparkles className="w-8 h-8 opacity-30 text-amber-brand mx-auto" />
            <p className="text-sm font-medium text-[#D8D8D2]">No matching records found</p>
            <p className="text-xs text-[#8E8E86]">
              Try adjusting your query or run a new scan from the Screen Controller.
            </p>
          </div>
        ) : (
          filteredResults.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#161614] border border-white/5 hover:border-white/15 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-amber-brand border border-white/5">
                    {item.lens}
                  </span>
                  <span className="text-[11px] font-mono text-[#8E8E86]">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.latencyMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleStar(item.id)}
                    className="p-1.5 rounded-lg text-[#8E8E86] hover:text-amber-brand hover:bg-white/5 transition-all"
                    title="Star"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.starred ? 'text-amber-brand fill-current' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => playTextToSpeech(item.result)}
                    className="p-1.5 rounded-lg text-[#8E8E86] hover:text-[#F5F5F1] hover:bg-white/5 transition-all"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.id, item.result)}
                    className="p-1.5 rounded-lg text-[#8E8E86] hover:text-[#F5F5F1] hover:bg-white/5 transition-all"
                    title="Copy Result"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Original Input Text */}
              <div className="text-xs text-[#8E8E86] font-mono bg-black/30 p-2.5 rounded-lg border border-white/5 truncate">
                &ldquo;{item.originalText}&rdquo;
              </div>

              {/* Resolved Output */}
              <div className="text-sm text-[#F5F5F1] leading-relaxed whitespace-pre-line font-sans">
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
