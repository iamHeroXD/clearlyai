import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { HomeView } from './components/HomeView';
import { LibraryView } from './components/LibraryView';
import { HistoryView } from './components/HistoryView';
import { NotesView } from './components/NotesView';
import { SettingsView } from './components/SettingsView';
import { RightFeaturesSidebar } from './components/RightFeaturesSidebar';
import { Modals } from './components/Modals';
import { 
  StructuredExplanation, 
  NoteItem, 
  DesktopSettings, 
  DEFAULT_SETTINGS, 
  ToastNotification,
  ExplanationMode 
} from './types';

const INITIAL_EXPLANATIONS: StructuredExplanation[] = [
  {
    id: 'exp-1',
    title: 'Photosynthesis Process',
    originalText: 'Photosynthesis is the process by which plants convert light energy into chemical energy.',
    mode: 'simple',
    summary: 'Plants use sunlight to make their own food (sugars) from carbon dioxide and water.',
    coreMeaning: 'The biological mechanism through which plants transform light energy into chemical energy stored in glucose molecules.',
    whyItMatters: 'It produces nearly all the oxygen on Earth and feeds the food chain.',
    example: 'A leaf acts like a solar-powered sugar factory during the day.',
    keyTerms: ['Chlorophyll', 'Sunlight', 'Glucose'],
    timestamp: Date.now() - 1000 * 60 * 2,
    latencyMs: 42,
    starred: true,
  },
  {
    id: 'exp-2',
    title: 'Quantum computing (basic)',
    originalText: 'Quantum computing relies on quantum bits or qubits that can exist in multiple states simultaneously.',
    mode: 'simple',
    summary: 'Unlike normal computers that calculate one thing at a time, quantum computers explore millions of possibilities at once.',
    coreMeaning: 'Exploitation of quantum superposition and entanglement for computational advantages.',
    whyItMatters: 'Solves complex problems in molecular modeling, battery research, and cryptography.',
    example: 'Searching every book in a library at once instead of looking page by page.',
    keyTerms: ['Qubits', 'Superposition', 'Entanglement'],
    timestamp: Date.now() - 1000 * 60 * 12,
    latencyMs: 38,
    starred: true,
  },
  {
    id: 'exp-3',
    title: 'What is machine learning?',
    originalText: 'Machine learning is a subset of artificial intelligence focused on building systems that learn from data.',
    mode: 'define',
    summary: 'Teaching computers to recognize patterns from examples rather than writing explicit rules by hand.',
    coreMeaning: 'Statistical optimization algorithms that adjust internal parameters based on sample inputs.',
    whyItMatters: 'Powers speech recognition, autonomous driving, medical diagnostics, and search.',
    example: 'Showing a computer 10,000 cat photos so it learns to recognize cats on its own.',
    keyTerms: ['Neural Networks', 'Training Data', 'Inference'],
    timestamp: Date.now() - 1000 * 60 * 60,
    latencyMs: 45,
    starred: false,
  },
  {
    id: 'exp-4',
    title: 'Human brain memory',
    originalText: 'Synaptic plasticity is the biological foundation of human brain memory storage.',
    mode: 'summarize',
    summary: 'Brain cells create and strengthen connections each time you learn or practice something new.',
    coreMeaning: 'Adaptive remodeling of dendritic synapses in response to neural firing patterns.',
    whyItMatters: 'Forms the physical mechanism of memory, adaptation, and lifelong learning.',
    example: 'Like walking through tall grass: the more you walk a path, the clearer the trail becomes.',
    keyTerms: ['Synapses', 'Neurons', 'Plasticity'],
    timestamp: Date.now() - 1000 * 60 * 180,
    latencyMs: 34,
    starred: false,
  },
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Biology & Photosynthesis Notes',
    content: `# Biology Study Notes\n\n## Core Process\nPhotosynthesis converts light energy into chemical energy stored in glucose.\n\n- Primary reactant: Water + CO2\n- Energy source: Photons absorbed by Chlorophyll\n- Result: Oxygen + Glucose`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 20,
    tags: ['Biology', 'Science'],
  },
  {
    id: 'note-2',
    title: 'Quantum vs Classical Computing',
    content: `# Quantum Principles\n\n- **Classical Bit**: 0 or 1\n- **Qubit**: Superposition of 0 and 1\n- **Entanglement**: Instantaneous correlation across physical distance`,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    tags: ['Tech', 'Physics'],
  },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'history' | 'notes' | 'settings'>('home');
  const [settings, setSettings] = useState<DesktopSettings>(DEFAULT_SETTINGS);
  const [historyItems, setHistoryItems] = useState<StructuredExplanation[]>(INITIAL_EXPLANATIONS);
  const [libraryItems, setLibraryItems] = useState<StructuredExplanation[]>(INITIAL_EXPLANATIONS.filter((i) => i.starred));
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals state
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [hudOpen, setHudOpen] = useState(false);

  // Global hotkeys (Alt+Space for HUD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        setHudOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const handleSaveToLibrary = (item: StructuredExplanation) => {
    setLibraryItems((prev) => {
      if (prev.some((x) => x.id === item.id)) return prev;
      return [{ ...item, starred: true }, ...prev];
    });
    setHistoryItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, starred: true } : x))
    );
  };

  const handleDeleteLibraryItem = (id: string) => {
    setLibraryItems((prev) => prev.filter((x) => x.id !== id));
    showToast('Removed item from Library', 'info');
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

  const handleSaveNote = (note: NoteItem) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === note.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = note;
        return next;
      }
      return [note, ...prev];
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpdateSettings = (newSettings: Partial<DesktopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className={`flex h-screen w-screen bg-[var(--paper)] text-[var(--ink)] overflow-hidden font-sans select-none antialiased ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProModal={() => setProModalOpen(true)}
      />

      {/* Center Main Stage + Header + Status Bar */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--paper)] overflow-hidden">
        {/* Top Header Controls Bar */}
        <HeaderBar
          theme={settings.theme}
          onToggleTheme={() =>
            handleUpdateSettings({
              theme: settings.theme === 'dark' ? 'light' : 'dark',
            })
          }
          onOpenQuickSettings={() => setQuickSettingsOpen(true)}
          onOpenAccount={() => setAccountModalOpen(true)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {activeTab === 'home' && (
            <HomeView
              onSaveToLibrary={handleSaveToLibrary}
              onAddNote={(title, content) => {
                handleSaveNote({
                  id: 'note_' + Date.now(),
                  title,
                  content,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  tags: ['Explanation'],
                });
                setActiveTab('notes');
              }}
              onShowToast={showToast}
              activeProvider={settings.activeProvider}
              geminiApiKey={settings.geminiApiKey}
              defaultMode={settings.defaultMode}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              libraryItems={libraryItems}
              onDeleteItem={handleDeleteLibraryItem}
              onShowToast={showToast}
              onOpenItemDetail={(item) => {
                setActiveTab('home');
              }}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              historyItems={historyItems}
              onClearHistory={handleClearHistory}
              onDeleteItem={handleDeleteHistoryItem}
              onSaveToLibrary={handleSaveToLibrary}
              onReExplain={(item) => {
                setActiveTab('home');
              }}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Bottom Status Bar */}
        <footer className="h-8 border-t border-[var(--line)] bg-[var(--paper-card)] px-5 flex items-center justify-between text-[11px] font-mono text-[var(--gray-600)] select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[var(--ink)] font-medium">Extension &amp; Screen Hook Connected</span>
            <span className="text-[var(--line-strong)]">|</span>
            <span>Your ambient AI reader</span>
          </div>

          <div className="flex items-center gap-1 text-[var(--ink-soft)] font-medium">
            <span>⚡ Powered by Clearly</span>
          </div>
        </footer>
      </div>

      {/* Right Feature Sidebar (Only on Home View) */}
      {activeTab === 'home' && (
        <RightFeaturesSidebar
          recentExplanations={historyItems}
          onSelectExplanation={(exp) => {}}
          onViewAllHistory={() => setActiveTab('history')}
          onSelectFeatureMode={(mode) => {}}
        />
      )}

      {/* Global Modals & Toasts */}
      <Modals
        quickSettingsOpen={quickSettingsOpen}
        onCloseQuickSettings={() => setQuickSettingsOpen(false)}
        proModalOpen={proModalOpen}
        onCloseProModal={() => setProModalOpen(false)}
        accountModalOpen={accountModalOpen}
        onCloseAccountModal={() => setAccountModalOpen(false)}
        hudOpen={hudOpen}
        onCloseHUD={() => setHudOpen(false)}
        toasts={toasts}
        onDismissToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        onSaveExplanation={handleSaveToLibrary}
        activeProvider={settings.activeProvider}
        geminiApiKey={settings.geminiApiKey}
      />
    </div>
  );
};

export default App;
