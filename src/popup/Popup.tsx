import React, { useState, useEffect } from 'react';
import { ExtensionSettings, DEFAULT_SETTINGS, AIProviderType } from '../types';

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (res) => {
        if (res?.success && res.data) {
          setSettings(res.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const updateSetting = <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', payload: { [key]: value } }, () => {
        setSavedMessage('Saved');
        setTimeout(() => setSavedMessage(null), 1500);
      });
    }
  };

  const openOptionsPage = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html', '_blank');
    }
  };

  const openSidePanel = () => {
    if (typeof chrome !== 'undefined') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id && (chrome as any).sidePanel?.open) {
          (chrome as any).sidePanel.open({ tabId: activeTab.id, windowId: activeTab.windowId });
          window.close();
        }
      });
    }
  };

  const openPdfReader = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('reader.html') });
      window.close();
    } else {
      window.open('reader.html', '_blank');
    }
  };

  const clearCache = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'CLEAR_CACHE' }, () => {
        setSavedMessage('Cache cleared');
        setTimeout(() => setSavedMessage(null), 1500);
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-stone-500 bg-[#FDFBF7]">
        Loading Clearly...
      </div>
    );
  }

  return (
    <div className="p-4 font-sans text-sm bg-[#FDFBF7]/95 backdrop-blur-2xl text-[#292524] border border-orange-100/80 shadow-[0_12px_40px_rgba(249,115,22,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-orange-100/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/25 ring-1 ring-white/60">
            ✨
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 leading-tight flex items-center gap-1.5">
              Clearly
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                settings.enabled 
                  ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' 
                  : 'bg-stone-500/10 text-stone-500 border-stone-500/20'
              }`}>
                {settings.enabled ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Enable / Disable Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={settings.enabled}
            onChange={(e) => updateSetting('enabled', e.target.checked)}
          />
          <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-amber-500 shadow-inner"></div>
        </label>
      </div>

      {/* Quick Launch Buttons */}
      <div className="py-3 grid grid-cols-2 gap-2 border-b border-orange-100/70">
        <button
          type="button"
          onClick={openSidePanel}
          className="p-2.5 rounded-2xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/60 text-orange-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
        >
          <span className="text-base">📑</span>
          <span>Side Panel</span>
        </button>
        <button
          type="button"
          onClick={openPdfReader}
          className="p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 text-amber-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
        >
          <span className="text-base">📖</span>
          <span>PDF Studio</span>
        </button>
      </div>

      {/* Main Controls */}
      <div className="py-3.5 space-y-3">
        {/* Active Provider */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600">AI Provider</span>
          <select
            value={settings.activeProvider}
            onChange={(e) => updateSetting('activeProvider', e.target.value as AIProviderType)}
            className="text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 outline-none shadow-xs font-medium focus:ring-2 focus:ring-orange-400/40"
          >
            <option value="gemini">Google Gemini</option>
            <option value="nano">Chrome Built-in (Nano)</option>
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic Claude</option>
            <option value="ollama">Ollama (Local)</option>
            <option value="custom">Custom Endpoint</option>
            <option value="mock">Demo Engine</option>
          </select>
        </div>

        {/* Learning Mode Switch */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-orange-50/50 border border-orange-100">
          <div>
            <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <span>🎓</span> Learning Mode
            </div>
            <div className="text-[10.5px] text-stone-500">Interactive quizzes & analogies</div>
          </div>
          <input
            type="checkbox"
            checked={settings.learningMode}
            onChange={(e) => updateSetting('learningMode', e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
          />
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600">Language</span>
          <select
            value={settings.defaultLanguage}
            onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 outline-none shadow-xs font-medium focus:ring-2 focus:ring-orange-400/40"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
            <option value="Hindi">Hindi</option>
            <option value="Portuguese">Portuguese</option>
          </select>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-2.5 border-t border-orange-100/70 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-stone-400">
          <span>Shortcut: <kbd className="px-1.5 py-0.5 bg-stone-100 rounded-md border border-stone-200 text-[10px] font-mono">Ctrl+Shift+E</kbd></span>
          <button
            type="button"
            onClick={clearCache}
            className="hover:underline text-stone-500 hover:text-orange-600 font-medium transition-colors"
          >
            Clear Cache
          </button>
        </div>

        <button
          type="button"
          onClick={openOptionsPage}
          className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <span>All Settings & History</span>
          <span>↗</span>
        </button>

        {savedMessage && (
          <div className="text-center text-[11px] text-orange-600 font-semibold animate-pulse">
            ✓ {savedMessage}
          </div>
        )}
      </div>
    </div>
  );
};
