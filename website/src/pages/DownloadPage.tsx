import React, { useState } from 'react';
import { 
  Download, 
  Monitor, 
  Chrome, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  ArrowDown, 
  Terminal, 
  Layers, 
  ExternalLink,
  Laptop
} from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<'extension' | 'desktop'>('extension');

  const copyText = (txt: string, step: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  return (
    <main id="main" className="animate-fade-in">
      {/* Hero */}
      <section className="section-padding hero pb-12">
        <div className="container-custom">
          <div className="max-w-[42rem] mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] px-3 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--gray-600)] font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-[#E1993B] animate-pulse"></span>
              Latest Release • v1.0.0 Production Ready
            </span>
            <h1 className="text-[var(--text-display)] font-semibold text-[var(--ink)] leading-[1.06] tracking-tight">
              Get Clearly for Browser & Desktop.
            </h1>
            <p className="text-[1.125rem] text-[var(--ink-soft)] mt-4 leading-[1.6]">
              Instant text deconstruction anywhere you read or write. Choose the Chrome Extension for seamless web reading, or the Desktop App for universal screen control across all native applications.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Download Cards Grid */}
      <section className="section-padding section-flush-top pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: Chrome Extension */}
            <div className="p-8 rounded-[var(--radius-xl)] border border-[var(--line-strong)] bg-[var(--paper)] shadow-[var(--shadow-sm)] flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E1993B]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E1993B]/10 transition-all"></div>
              
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--paper-raised)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]">
                    <Chrome className="w-6 h-6 text-[#E1993B]" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--gray-600)]">
                    Manifest V3 • 150 KB
                  </span>
                </div>

                <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] tracking-tight">
                  Clearly for Chrome & Arc
                </h2>
                <p className="text-[0.9375rem] text-[var(--ink-soft)] mt-2 leading-[1.6]">
                  Select any text on any webpage. Shadow DOM aerogel card with 6 instant lenses, pronunciation, and sub-50ms window.ai Nano acceleration.
                </p>

                <ul className="my-6 space-y-2.5 text-xs text-[var(--ink-soft)] font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Chrome, Arc, Brave, Edge & Opera</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Built-in Chrome Gemini Nano (Local)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Zero telemetry & 100% private</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="/downloads/clearly-extension-v1.0.0.zip"
                  download="clearly-extension-v1.0.0.zip"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[0.9375rem] font-semibold bg-[var(--ink)] text-[var(--paper)] hover:bg-[#E1993B] hover:text-[#0C0C0A] transition-all shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extension ZIP</span>
                </a>
                <a
                  href="#install-steps"
                  onClick={() => setSelectedTab('extension')}
                  className="px-4 py-3.5 rounded-full text-xs font-mono text-center border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                >
                  Install Guide ↓
                </a>
              </div>
            </div>

            {/* Card 2: Desktop App */}
            <div className="p-8 rounded-[var(--radius-xl)] border border-[#E1993B]/40 bg-[var(--paper)] shadow-[var(--shadow-sm)] flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E1993B]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E1993B]/20 transition-all"></div>
              
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#E1993B]/10 border border-[#E1993B]/30 flex items-center justify-center text-[#E1993B]">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#E1993B]/15 border border-[#E1993B]/30 text-[#E1993B] font-semibold">
                    Windows x64 • 75 KB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] tracking-tight">
                    Clearly Desktop OS
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Portable
                  </span>
                </div>
                
                <p className="text-[0.9375rem] text-[var(--ink-soft)] mt-2 leading-[1.6]">
                  Global screen area controller & text deconstructor. Works seamlessly across VS Code, Slack, PDF readers, Terminal, Word, and Notion.
                </p>

                <ul className="my-6 space-y-2.5 text-xs text-[var(--ink-soft)] font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Global Spotlight HUD (⌥ Space / Ctrl+Shift+C)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Screen area capture & live OCR deconstruct</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Personal usage metrics & saved glossary vault</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="/downloads/clearly-desktop-v1.0.0-windows.zip"
                  download="clearly-desktop-v1.0.0-windows.zip"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[0.9375rem] font-semibold bg-[#E1993B] text-[#0C0C0A] hover:bg-[#D97706] transition-all shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Desktop App ZIP</span>
                </a>
                <a
                  href="#install-steps"
                  onClick={() => setSelectedTab('desktop')}
                  className="px-4 py-3.5 rounded-full text-xs font-mono text-center border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                >
                  Launch Guide ↓
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Step-by-Step Installation Guides */}
      <section id="install-steps" className="section-padding divider section-flush-top">
        <div className="container-custom">
          <div className="max-w-[36rem] mb-10 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
              Quick setup instructions.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
              Get up and running in under 60 seconds with zero complex configuration.
            </p>

            {/* Tab Switcher */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setSelectedTab('extension')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                  selectedTab === 'extension'
                    ? 'bg-[var(--ink)] text-[var(--paper)] shadow'
                    : 'bg-[var(--paper-raised)] text-[var(--gray-600)] border border-[var(--line)]'
                }`}
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Chrome Extension Setup</span>
              </button>
              <button
                onClick={() => setSelectedTab('desktop')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                  selectedTab === 'desktop'
                    ? 'bg-[#E1993B] text-[#0C0C0A] font-semibold shadow'
                    : 'bg-[var(--paper-raised)] text-[var(--gray-600)] border border-[var(--line)]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop App Setup</span>
              </button>
            </div>
          </div>

          {selectedTab === 'extension' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
              {/* Step 1 */}
              <div className="p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] flex items-center justify-center font-mono font-semibold text-xs text-[var(--ink)] mb-4">
                    01
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">Unzip Archive</h3>
                  <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5] mb-5">
                    Extract <code className="font-mono text-xs bg-[var(--paper-raised)] px-1 py-0.5 rounded">clearly-extension-v1.0.0.zip</code> to a local folder.
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] font-mono text-xs flex items-center justify-between">
                  <span>Extract to folder</span>
                  <span className="text-emerald-500 font-semibold">ZIP Ready</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] flex items-center justify-center font-mono font-semibold text-xs text-[var(--ink)] mb-4">
                    02
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">Open Extensions</h3>
                  <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5] mb-5">
                    Navigate to extensions in Chrome and enable <strong>Developer mode</strong> in the top right.
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] font-mono text-xs flex items-center justify-between">
                  <span>chrome://extensions</span>
                  <button
                    onClick={() => copyText('chrome://extensions', 2)}
                    className="text-[var(--gray-600)] hover:text-[var(--ink)]"
                  >
                    {copiedStep === 2 ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] flex items-center justify-center font-mono font-semibold text-xs text-[var(--ink)] mb-4">
                    03
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">Load Unpacked</h3>
                  <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5] mb-5">
                    Click <strong>Load unpacked</strong> and select the extracted extension folder.
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[#E1993B]/15 text-[#0C0C0A] dark:text-[#E1993B] font-mono text-xs flex items-center justify-between font-semibold border border-[#E1993B]/30">
                  <span>✓ Active on Web</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
              {/* Step 1 */}
              <div className="p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#E1993B]/10 border border-[#E1993B]/30 flex items-center justify-center font-mono font-semibold text-xs text-[#E1993B] mb-4">
                    01
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">Unzip Desktop Package</h3>
                  <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5] mb-5">
                    Extract <code className="font-mono text-xs bg-[var(--paper-raised)] px-1 py-0.5 rounded">clearly-desktop-v1.0.0-windows.zip</code> anywhere on your PC.
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] font-mono text-xs flex items-center justify-between">
                  <span>Portable • Zero Install</span>
                  <span className="text-emerald-500 font-semibold">Standalone</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#E1993B]/10 border border-[#E1993B]/30 flex items-center justify-center font-mono font-semibold text-xs text-[#E1993B] mb-4">
                    02
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">Run Launcher</h3>
                  <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5] mb-5">
                    Double-click <code className="font-mono text-xs bg-[var(--paper-raised)] px-1 py-0.5 rounded">Launch_Clearly_Desktop.bat</code> or open <code className="font-mono text-xs bg-[var(--paper-raised)] px-1 py-0.5 rounded">index.html</code>.
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] font-mono text-xs flex items-center justify-between">
                  <span>Launch_Clearly_Desktop.bat</span>
                  <span className="text-[#E1993B] font-semibold">1-Click</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-7 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#E1993B]/10 border border-[#E1993B]/30 flex items-center justify-center font-mono font-semibold text-xs text-[#E1993B] mb-4">
                    03
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold text-[var(--ink)] mb-2">Control Screen</h3>
                  <p className="text-[0.875rem] text-[var(--ink-soft)] leading-[1.5] mb-5">
                    Press <kbd className="font-mono text-xs bg-[var(--paper-raised)] px-1 py-0.5 rounded">⌥ Space</kbd> or <kbd className="font-mono text-xs bg-[var(--paper-raised)] px-1 py-0.5 rounded">Ctrl+Shift+C</kbd> to deconstruct text in any native app.
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[#E1993B]/15 text-[#0C0C0A] dark:text-[#E1993B] font-mono text-xs flex items-center justify-between font-semibold border border-[#E1993B]/30">
                  <span>✓ Screen Controller Live</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Architecture & Compatibility Matrix */}
      <section className="section-padding divider raised">
        <div className="container-custom">
          <div className="max-w-[34rem] mb-10 text-center mx-auto">
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
              Cross-platform compatibility.
            </h2>
            <p className="text-[1.0625rem] text-[var(--ink-soft)] mt-3">
              Engineered for maximum speed and zero friction across modern platforms.
            </p>
          </div>

          <div className="max-w-2xl mx-auto border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--paper)]">
            <div className="divide-y divide-[var(--line)] text-[0.9375rem]">
              {[
                { platform: 'Google Chrome / Arc', type: 'Extension', support: 'window.ai Nano + Gemini Cloud', badge: 'Verified' },
                { platform: 'Windows 10 / 11 (x64)', type: 'Desktop App', support: 'Screen OCR & Controller HUD', badge: 'Verified' },
                { platform: 'Brave / Edge / Opera', type: 'Extension', support: 'Full Multi-Lens Support', badge: 'Verified' },
                { platform: 'macOS / Linux', type: 'Web & Extension', support: 'Universal Chromium + Web HUD', badge: 'Verified' },
              ].map((row, i) => (
                <div key={i} className="p-5 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-semibold text-[var(--ink)]">{row.platform}</span>
                    <span className="ml-2 text-xs font-mono text-[var(--gray-500)]">({row.type})</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[var(--gray-600)]">
                    <span>{row.support}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {row.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
