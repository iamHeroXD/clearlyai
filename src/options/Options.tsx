import React, { useState, useEffect } from 'react';
import { ExtensionSettings, DEFAULT_SETTINGS, AIProviderType, ProviderConfig } from '../types';
import { GeneralSettings } from './sections/GeneralSettings';
import { ProviderSettings } from './sections/ProviderSettings';
import { HistoryViewer } from './sections/HistoryViewer';
import { PrivacySettings } from './sections/PrivacySettings';

type TabType = 'general' | 'providers' | 'history' | 'privacy';

export const Options: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<TabType>('providers');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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

  const handleSettingChange = <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettingsToStorage({ [key]: value });
  };

  const handleProviderConfigChange = (provider: AIProviderType, config: Partial<ProviderConfig>) => {
    const updatedProviders = {
      ...settings.providers,
      [provider]: {
        ...settings.providers[provider],
        ...config,
      },
    };
    const updated = { ...settings, providers: updatedProviders };
    setSettings(updated);
    saveSettingsToStorage({ providers: updatedProviders });
  };

  const saveSettingsToStorage = (payload: Partial<ExtensionSettings>) => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', payload }, () => {
        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(null), 1500);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm">
        Loading Clearly Settings...
      </div>
    );
  }

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navigation Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-10 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              ✨
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Clearly Settings</h1>
              <p className="text-xs text-slate-400">Highlight · Understand · Continue</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                ✓ {saveStatus}
              </span>
            )}
            <span className="text-xs text-slate-400">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {[
            { id: 'providers', label: 'AI Providers & Keys', icon: '🔑' },
            { id: 'general', label: 'General Settings', icon: '⚙️' },
            { id: 'history', label: 'Reading History', icon: '📚' },
            { id: 'privacy', label: 'Privacy & Security', icon: '🛡️' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <GeneralSettings settings={settings} onChange={handleSettingChange} />
          )}

          {activeTab === 'providers' && (
            <ProviderSettings
              settings={settings}
              onChange={handleSettingChange}
              onProviderConfigChange={handleProviderConfigChange}
            />
          )}

          {activeTab === 'history' && <HistoryViewer />}

          {activeTab === 'privacy' && (
            <PrivacySettings settings={settings} onChange={handleSettingChange} />
          )}
        </main>
      </div>
    </div>
  );
};
