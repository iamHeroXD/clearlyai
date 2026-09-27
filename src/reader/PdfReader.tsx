import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FloatingPill } from '../content/components/FloatingPill';
import { ExplanationCard } from '../content/components/ExplanationCard';
import {
  ExtensionSettings,
  DEFAULT_SETTINGS,
  ExplanationMode,
  StructuredExplanation,
} from '../types';
import { calculatePillPosition, calculateCardPosition, PositionCoordinates } from '../services/positioning';
import { detectCode } from '../utils/codeDetector';
import { detectMath } from '../utils/mathDetector';

// Configure local PDF.js worker (MV3 CSP compliant)
if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.mjs');
} else {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export const PdfReader: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.25);
  const [fileName, setFileName] = useState<string>('');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Selection & Explanation States
  const [selectedText, setSelectedText] = useState('');
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [pillPos, setPillPos] = useState<PositionCoordinates | null>(null);
  const [cardPos, setCardPos] = useState<PositionCoordinates | null>(null);
  const [showPill, setShowPill] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [explanationData, setExplanationData] = useState<StructuredExplanation | null>(null);
  const [currentMode, setCurrentMode] = useState<ExplanationMode>('explain');
  const [explanationError, setExplanationError] = useState<string | null>(null);

  // Paper Overview Sidebar
  const [showSidebar, setShowSidebar] = useState(true);
  const [paperNotes, setPaperNotes] = useState<{ time: string; text: string; mode: string; summary: string }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textLayerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load Settings
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (res) => {
        if (res?.success && res.data) {
          setSettings(res.data);
        }
      });
    }
  }, []);

  // Load PDF from ArrayBuffer / URL
  const loadPdfData = async (data: ArrayBuffer | Uint8Array, name: string) => {
    try {
      setLoadingPdf(true);
      setPdfError(null);
      setFileName(name);
      const loadingTask = pdfjsLib.getDocument({ data });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setLoadingPdf(false);
    } catch (err: any) {
      setLoadingPdf(false);
      setPdfError(err.message || 'Failed to load PDF file.');
    }
  };

  // Render current page canvas and text layer
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !textLayerRef.current) return;

    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render Canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      // Render Text Layer for Native Selection
      const textContent = await page.getTextContent();
      const textLayer = textLayerRef.current;
      textLayer.innerHTML = '';
      textLayer.style.height = `${viewport.height}px`;
      textLayer.style.width = `${viewport.width}px`;

      // Render text spans
      textContent.items.forEach((item: any) => {
        if (!item.str) return;
        const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
        const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);

        const span = document.createElement('span');
        span.textContent = item.str;
        span.style.left = `${tx[4]}px`;
        span.style.top = `${tx[5] - fontHeight}px`;
        span.style.fontSize = `${fontHeight}px`;
        span.style.fontFamily = item.fontName || 'sans-serif';
        span.style.position = 'absolute';
        span.style.color = 'transparent';
        span.style.cursor = 'text';
        span.style.transformOrigin = 'left bottom';
        span.style.whiteSpace = 'pre';
        span.style.lineHeight = '1';
        textLayer.appendChild(span);
      });
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage();
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  // Handle File Picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        loadPdfData(reader.result, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          loadPdfData(reader.result, file.name);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle Text Selection inside PDF Text Layer
  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (!showCard) setShowPill(false);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 2) {
      if (!showCard) setShowPill(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    setSelectedText(text);
    setSelectionRect(rect);

    const pos = calculatePillPosition(rect);
    setPillPos(pos);

    if (!showCard) {
      setShowPill(true);
    }
  };

  const dismissAll = () => {
    setShowPill(false);
    setShowCard(false);
    setExplaining(false);
  };

  // Request Explanation
  const requestExplanation = (mode: ExplanationMode, targetLang?: string, followUp?: string) => {
    if (!selectedText) return;

    setShowPill(false);
    setShowCard(true);
    setExplaining(true);
    setExplanationError(null);
    setCurrentMode(mode);

    if (selectionRect) {
      const pos = calculateCardPosition(selectionRect);
      setCardPos(pos);
    }

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          type: 'EXPLAIN_TEXT',
          payload: {
            text: selectedText,
            mode: mode,
            targetLanguage: targetLang || settings.defaultLanguage,
            followUpQuery: followUp,
            pageTitle: fileName || 'Clearly PDF Studio',
          },
        },
        (res) => {
          setExplaining(false);
          if (res?.success && res.data) {
            setExplanationData(res.data);
            setPaperNotes((prev) => [
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: selectedText.slice(0, 75) + (selectedText.length > 75 ? '...' : ''),
                mode,
                summary: res.data.summary || res.data.simplifiedText || '',
              },
              ...prev,
            ]);
          } else {
            setExplanationError(res?.error || 'Could not explain text.');
          }
        }
      );
    }
  };

  // Detect context type
  let detectedType: 'code' | 'math' | 'word' | 'paragraph' | 'text' | 'legal' = 'text';
  if (selectedText) {
    if (detectCode(selectedText).isCode) detectedType = 'code';
    else if (detectMath(selectedText).isMath) detectedType = 'math';
    else if (selectedText.split(/\s+/).length <= 3) detectedType = 'word';
    else if (selectedText.length > 200) detectedType = 'paragraph';
  }

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="h-screen flex flex-col font-sans bg-[#FBF9F5] text-[#292524] transition-colors selection:bg-orange-200 selection:text-orange-950"
    >
      {/* Top Header: Warm White Frosted Glass with Orange Accents */}
      <header className="h-14 border-b border-orange-100/80 bg-white/80 backdrop-blur-xl px-5 flex items-center justify-between z-30 shrink-0 shadow-[0_2px_12px_rgba(249,115,22,0.04)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/25 ring-2 ring-white/60">
            ✨
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
              Clearly PDF Studio
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 font-semibold border border-orange-500/20">
                Paper & Research Copilot
              </span>
            </div>
            {fileName && (
              <div className="text-[11px] text-stone-400 font-mono truncate max-w-xs">
                {fileName}
              </div>
            )}
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-semibold shadow-sm shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>📁</span> Open PDF
          </button>

          {pdfDoc && (
            <>
              {/* Pagination */}
              <div className="flex items-center bg-stone-100/80 border border-stone-200/60 rounded-xl p-1 text-xs text-stone-700 font-medium">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-0.5 hover:bg-white rounded-lg transition-colors disabled:opacity-35"
                >
                  ◀
                </button>
                <span className="px-2 font-mono">
                  {currentPage} / {numPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  className="px-2 py-0.5 hover:bg-white rounded-lg transition-colors disabled:opacity-35"
                >
                  ▶
                </button>
              </div>

              {/* Zoom */}
              <div className="flex items-center bg-stone-100/80 border border-stone-200/60 rounded-xl p-1 text-xs text-stone-700 font-medium">
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
                  className="px-2 py-0.5 hover:bg-white rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="px-2 font-mono">{Math.round(scale * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
                  className="px-2 py-0.5 hover:bg-white rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </>
          )}

          {/* Toggle Sidebar */}
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showSidebar
                ? 'bg-orange-50 border-orange-300/80 text-orange-700 shadow-xs'
                : 'bg-white/80 border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            📊 Study Notes ({paperNotes.length})
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* PDF Canvas Viewport */}
        <div
          className="flex-1 overflow-auto p-8 flex justify-center items-start bg-[#F5F2EB]/60"
          onMouseUp={handleSelection}
        >
          {loadingPdf && (
            <div className="text-center py-24 space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm font-semibold text-stone-600">Rendering document pages...</div>
            </div>
          )}

          {pdfError && (
            <div className="max-w-md p-6 bg-orange-50/90 border border-orange-200 rounded-3xl text-center space-y-3 text-stone-800 shadow-xl backdrop-blur-xl">
              <div className="text-2xl">⚠️</div>
              <div className="text-sm font-semibold text-orange-900">{pdfError}</div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95"
              >
                Choose PDF File
              </button>
            </div>
          )}

          {!pdfDoc && !loadingPdf && !pdfError && (
            <div className="max-w-lg my-auto p-10 rounded-3xl border-2 border-dashed border-orange-200/80 bg-white/80 backdrop-blur-2xl text-center space-y-5 shadow-[0_12px_40px_rgba(249,115,22,0.06)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 text-white">
                📄
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-stone-900">Understand Research Papers & PDFs</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Drag and drop any research paper (like <code className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-mono font-semibold">myrealpapers.pdf</code>) or document to unlock instant AI hover explanations, math breakdown, and study flashcards!
                </p>
              </div>

              <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-transform active:scale-95"
                >
                  Choose PDF from Device
                </button>
              </div>
            </div>
          )}

          {pdfDoc && (
            <div className="relative shadow-[0_10px_35px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden border border-stone-200/80 bg-white">
              <canvas ref={canvasRef} className="block" />
              <div
                ref={textLayerRef}
                className="absolute top-0 left-0 textLayer select-text"
                style={{
                  lineHeight: '1',
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                }}
              />
            </div>
          )}
        </div>

        {/* Paper Insights Sidebar: Clean Warm White Frosted Glass */}
        {showSidebar && (
          <aside className="w-84 border-l border-orange-100/80 bg-white/85 backdrop-blur-2xl flex flex-col shrink-0 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-4 border-b border-orange-100/80 flex items-center justify-between">
              <div className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                <span>🧠</span> Study Notes & Decoders ({paperNotes.length})
              </div>
              {paperNotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const md = paperNotes
                      .map((n) => `### [${n.mode.toUpperCase()}] ${n.text}\n\n${n.summary}\n`)
                      .join('\n---\n\n');
                    const blob = new Blob([md], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${fileName || 'paper'}_notes.md`;
                    a.click();
                  }}
                  className="text-[10.5px] px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 font-semibold border border-orange-500/20 transition-colors"
                >
                  Export MD
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {paperNotes.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                  <div className="text-2xl">✨</div>
                  <div className="font-medium text-stone-600">Highlight any sentence or equation</div>
                  <div className="text-[11px] text-stone-400 leading-relaxed">
                    Clearly's floating pill will appear. Your explanations and math breakdowns will be saved here automatically.
                  </div>
                </div>
              ) : (
                paperNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FDFCF9] border border-orange-100/90 text-xs space-y-1.5 shadow-[0_2px_10px_rgba(249,115,22,0.04)] hover:border-orange-300/80 transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                        {note.mode}
                      </span>
                      <span>{note.time}</span>
                    </div>
                    <div className="font-medium text-stone-800 italic">"{note.text}"</div>
                    <div className="text-stone-600 text-[11px] leading-relaxed pt-1.5 border-t border-stone-100">
                      {note.summary}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3.5 border-t border-orange-100/80 bg-orange-50/30 text-[11px] text-stone-500 text-center">
              💡 Tip: Highlight complex microcontroller & math terms for ELI5 breakdowns.
            </div>
          </aside>
        )}
      </div>

      {/* Floating Pill on PDF Text Selection */}
      {showPill && pillPos && (
        <FloatingPill
          position={pillPos}
          isDark={false}
          isEditable={false}
          detectedType={detectedType}
          selectedText={selectedText}
          onTrigger={(mode, lang) => requestExplanation(mode, lang)}
        />
      )}

      {/* Popup Explanation Card */}
      {showCard && cardPos && (
        <ExplanationCard
          position={cardPos}
          selectionRect={selectionRect || undefined}
          isDark={false}
          isEditable={false}
          loading={explaining}
          error={explanationError}
          data={explanationData}
          onClose={dismissAll}
          onFollowUp={(query) => requestExplanation(currentMode, undefined, query)}
          onRetry={() => requestExplanation(currentMode)}
          onModeSwitch={(newMode) => requestExplanation(newMode)}
          onReplaceText={() => {}}
        />
      )}
    </div>
  );
};
