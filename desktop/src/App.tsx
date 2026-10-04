import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { HomeView } from './components/HomeView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { Modals } from './components/Modals';
import { 
  StructuredExplanation, 
  DesktopSettings, 
  DEFAULT_SETTINGS, 
  ToastNotification 
} from './types';

const INITIAL_EXPLANATIONS: StructuredExplanation[] = [
  {
    id: 'exp-1',
    title: 'Photosynthesis Process',
    originalText: 'Photosynthesis is the process by which autotrophic organisms convert light energy into chemical energy, synthesizing glucose from carbon dioxide and water while releasing molecular oxygen.',
    mode: 'simple',
    summary: 'Plants convert sunlight into chemical energy (sugars) using water and carbon dioxide, releasing oxygen as a byproduct.',
    coreMeaning: 'Biological photochemical conversion of solar radiation into chemical bonds of carbohydrates.',
    whyItMatters: 'Produces virtually all atmospheric oxygen and forms the energetic base of Earth\'s food webs.',
    example: 'Think of plant leaves as solar-powered microscopic factories manufacturing sugar from sunlight and air.',
    keyTerms: ['Chloroplasts', 'Calvin Cycle', 'Glucose'],
    timestamp: Date.now() - 1000 * 60 * 15,
    latencyMs: 38,
    starred: true,
  },
  {
    id: 'exp-2',
    title: 'Binding Arbitration Clause',
    originalText: 'You agree that any dispute, claim, or controversy arising out of or relating to this Agreement shall be settled exclusively by binding, individual arbitration, and you waive any right to participate in a class action lawsuit.',
    mode: 'legal',
    summary: 'You surrender your right to sue in court or join class actions; disputes must be handled privately through binding individual arbitration.',
    coreMeaning: 'Mandatory alternative dispute resolution waiver eliminating public civil court jurisdiction and collective litigation.',
    whyItMatters: 'Limits legal recourse, shields company from class liability, and requires individual dispute filings.',
    example: 'If thousands of customers are overcharged $10, each customer must pay arbitration fees individually rather than uniting.',
    keyTerms: ['Binding Arbitration', 'Class Action Waiver', 'Jurisdiction'],
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    latencyMs: 42,
    starred: true,
  },
  {
    id: 'exp-3',
    title: 'Quantum Computing Superposition',
    originalText: 'Quantum superposition allows qubits to exist as linear combinations of orthogonal basis states |0⟩ and |1⟩ simultaneously, exponentially expanding computational state space.',
    mode: 'eli5',
    summary: 'A normal switch is either ON or OFF. A quantum switch can be spinning like a coin in the air—both at once until caught.',
    coreMeaning: 'Quantum state vectors exist simultaneously across probabilistic linear combinations of eigenvectors prior to wavefunction collapse.',
    whyItMatters: 'Allows quantum computers to evaluate vast combinatorial possibilities simultaneously rather than step by step.',
    example: 'A regular computer tests one key at a time. A quantum computer tries the whole keychain in every lock at once.',
    keyTerms: ['Qubits', 'Superposition', 'Wavefunction'],
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    latencyMs: 35,
    starred: false,
  },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Persistent Settings
  const [settings, setSettings] = useState<DesktopSettings>(() => {
    try {
      const stored = localStorage.getItem('clearly_desktop_settings');
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Persistent History
  const [historyItems, setHistoryItems] = useState<StructuredExplanation[]>(() => {
    try {
      const stored = localStorage.getItem('clearly_desktop_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_EXPLANATIONS;
  });

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clearly_desktop_settings', JSON.stringify(settings));
    } catch {
      // Storage unavailable
    }
  }, [settings]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clearly_desktop_history', JSON.stringify(historyItems));
    } catch {
      // Storage unavailable
    }
  }, [historyItems]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const handleSaveToHistory = (item: StructuredExplanation) => {
    setHistoryItems((prev) => {
      const filtered = prev.filter((x) => x.id !== item.id);
      return [item, ...filtered];
    });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((x) => x.id !== id));
    showToast('Deleted history record', 'info');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all historical explanation records?')) {
      setHistoryItems([]);
      showToast('Cleared all history', 'info');
    }
  };

  const handleUpdateSettings = (newSettings: Partial<DesktopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className={`flex flex-col h-screen w-screen bg-[var(--paper)] text-[var(--ink)] overflow-hidden font-sans select-none antialiased ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Navigation Bar */}
      <HeaderBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={settings.theme}
        onToggleTheme={() =>
          handleUpdateSettings({
            theme: settings.theme === 'dark' ? 'light' : 'dark',
          })
        }
        activeProvider={settings.activeProvider}
        hasApiKey={Boolean(settings.geminiApiKey?.trim())}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--paper)]">
        {activeTab === 'home' && (
          <HomeView
            onSaveToHistory={handleSaveToHistory}
            onShowToast={showToast}
            activeProvider={settings.activeProvider}
            geminiApiKey={settings.geminiApiKey}
            defaultMode={settings.defaultMode}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            historyItems={historyItems}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
            onSaveToLibrary={handleSaveToHistory}
            onReExplain={(item) => {
              setActiveTab('home');
            }}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onShowToast={showToast}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-8 border-t border-[var(--line)] bg-[var(--paper-card)] px-6 flex items-center justify-between text-[11px] font-mono text-[var(--gray-600)] select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[var(--ink)] font-medium">Clearly Reader Studio v1.0.0</span>
          <span className="text-[var(--line-strong)]">|</span>
          <span>10 Canonical Lenses Active</span>
        </div>

        <div className="flex items-center gap-3 text-[var(--ink-soft)]">
          <span>Local-first &bull; Zero tracking</span>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Modals
        toasts={toasts}
        onDismissToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};

export default App;
