import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Share2, 
  Tag, 
  Search, 
  Download, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { NoteItem } from '../types';

interface NotesViewProps {
  notes: NoteItem[];
  onSaveNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onShowToast,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active note editor state
  const activeNote = notes.find((n) => n.id === selectedNoteId) || null;
  const [editTitle, setEditTitle] = useState(activeNote?.title || '');
  const [editContent, setEditContent] = useState(activeNote?.content || '');

  React.useEffect(() => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditContent(activeNote.content);
    }
  }, [selectedNoteId, activeNote]);

  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: 'note_' + Date.now(),
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart typing your study notes, insights, or thoughts...',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['Study'],
    };
    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
    onShowToast('Created new note', 'success');
  };

  const handleSaveCurrentNote = () => {
    if (activeNote) {
      const updated: NoteItem = {
        ...activeNote,
        title: editTitle.trim() || 'Untitled Note',
        content: editContent,
        updatedAt: Date.now(),
      };
      onSaveNote(updated);
      onShowToast('Saved note changes!', 'success');
    }
  };

  const handleExportMarkdown = () => {
    if (!activeNote) return;
    const blob = new Blob([editContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    onShowToast('Exported Markdown note!', 'success');
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 select-none animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--accent)]" />
            Knowledge &amp; Study Notes
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Organize explanations into deep understanding, flashcards, and summary notebooks.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 font-semibold text-xs transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main 2-Column Split View: List (Left) + Markdown Editor (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[520px]">
        {/* Left Column: Notes List (4 cols) */}
        <div className="md:col-span-4 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] p-4 space-y-3 flex flex-col shadow-sm">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-500)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--paper-raised)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder-[var(--gray-500)] focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center text-[var(--gray-500)] text-xs">
                No notes found. Click "New Note" to begin.
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedNoteId === note.id
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)]/40 text-[var(--ink)] font-medium shadow-sm'
                      : 'bg-[var(--paper-raised)] border-[var(--line)] text-[var(--ink-soft)] hover:bg-[var(--paper-hover)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="text-xs font-semibold truncate mb-1">{note.title}</div>
                  <div className="text-[11px] text-[var(--gray-500)] truncate font-mono">
                    {note.content.replace(/[#*`_>]/g, '').slice(0, 45)}...
                  </div>
                  <div className="text-[10px] text-[var(--gray-500)] mt-2 font-mono">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Note Editor (8 cols) */}
        <div className="md:col-span-8 rounded-2xl bg-[var(--paper-card)] border border-[var(--line)] p-5 flex flex-col justify-between space-y-4 shadow-sm">
          {activeNote ? (
            <>
              {/* Note Editor Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] gap-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="bg-transparent text-base font-bold text-[var(--ink)] focus:outline-none flex-1 font-sans"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportMarkdown}
                    className="p-2 rounded-lg bg-[var(--paper-raised)] hover:bg-[var(--paper-hover)] text-[var(--gray-600)] hover:text-[var(--ink)] transition-colors"
                    title="Export Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNote(activeNote.id);
                      onShowToast('Deleted note', 'info');
                    }}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveCurrentNote}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 font-semibold text-xs transition-all shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Textarea Workspace */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write in Markdown or paste notes..."
                rows={16}
                className="w-full flex-1 bg-[var(--paper-raised)] p-4 rounded-xl border border-[var(--line)] text-xs font-mono text-[var(--ink)] leading-relaxed resize-none focus:outline-none focus:border-[var(--accent)]"
              />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-24 text-[var(--gray-500)] space-y-3">
              <BookOpen className="w-10 h-10 text-[var(--accent)]/30" />
              <p className="text-xs">Select or create a note on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
