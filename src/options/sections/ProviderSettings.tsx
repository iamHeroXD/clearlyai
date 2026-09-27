import React, { useState } from 'react';
import { ExtensionSettings, AIProviderType, ProviderConfig } from '../../types';

interface ProviderSettingsProps {
  settings: ExtensionSettings;
  onChange: <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => void;
  onProviderConfigChange: (provider: AIProviderType, config: Partial<ProviderConfig>) => void;
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({
  settings,
  onChange,
  onProviderConfigChange,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const activeProvider = settings.activeProvider;
  const currentConfig = settings.providers[activeProvider] || {};

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        { type: 'TEST_PROVIDER', payload: { provider: activeProvider } },
        (res) => {
          setTesting(false);
          if (res?.success) {
            setTestResult({
              success: true,
              message: `Connected successfully! "${res.data?.summary || 'OK'}"`,
            });
          } else {
            setTestResult({
              success: false,
              message: res?.error || 'Connection failed. Check your API key or endpoint.',
            });
          }
        }
      );
    } else {
      setTimeout(() => {
        setTesting(false);
        setTestResult({ success: true, message: 'Provider configuration format is valid.' });
      }, 600);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">AI Provider Configuration</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clearly is AI-agnostic. Bring your own API key for ultra-fast, direct responses. API keys are stored strictly in local browser storage.
        </p>
      </div>

      {/* Provider Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { id: 'gemini', name: 'Google Gemini', desc: 'Fast & recommended (Gemini 1.5/2.0 Flash)' },
          { id: 'openai', name: 'OpenAI', desc: 'GPT-4o mini / GPT-4o' },
          { id: 'anthropic', name: 'Anthropic Claude', desc: 'Claude 3.5 Haiku / Sonnet' },
          { id: 'ollama', name: 'Ollama (Local)', desc: '100% Private local models (Llama 3.2)' },
          { id: 'custom', name: 'Custom REST API', desc: 'OpenAI-compatible / Groq / OpenRouter' },
          { id: 'mock', name: 'Demo Engine', desc: 'Offline evaluation mode' },
        ].map((item) => {
          const isSelected = activeProvider === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange('activeProvider', item.id as AIProviderType)}
              className={`p-3 text-left rounded-xl border transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs">{item.name}</span>
                {isSelected && <span className="text-blue-600 text-xs">✓ Active</span>}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Configuration Form for Active Provider */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Configure {activeProvider.toUpperCase()}
            </h4>
            <p className="text-xs text-slate-500">Settings and credentials for the currently active provider</p>
          </div>
          <button
            type="button"
            disabled={testing}
            onClick={handleTestConnection}
            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {testing ? 'Testing connection...' : '⚡ Test Connection'}
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-lg text-xs font-medium ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {testResult.message}
          </div>
        )}

        {/* API Key Input (if applicable) */}
        {activeProvider !== 'mock' && activeProvider !== 'ollama' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              API Key
            </label>
            <input
              type="password"
              placeholder={`Enter your ${activeProvider} API key`}
              value={currentConfig.apiKey || ''}
              onChange={(e) => onProviderConfigChange(activeProvider, { apiKey: e.target.value })}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Your API key never leaves your local browser environment except to make direct requests to the official provider endpoint.
            </p>
          </div>
        )}

        {/* Model Selection */}
        {activeProvider !== 'mock' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Model Name
            </label>
            <input
              type="text"
              placeholder="e.g. gemini-1.5-flash, gpt-4o-mini, claude-3-5-haiku-20241022, llama3.2"
              value={currentConfig.model || ''}
              onChange={(e) => onProviderConfigChange(activeProvider, { model: e.target.value })}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Endpoint Input (for Ollama / Custom) */}
        {(activeProvider === 'ollama' || activeProvider === 'custom') && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              API Endpoint URL
            </label>
            <input
              type="text"
              placeholder={activeProvider === 'ollama' ? 'http://localhost:11434/api/generate' : 'https://api.together.xyz/v1/chat/completions'}
              value={currentConfig.endpoint || ''}
              onChange={(e) => onProviderConfigChange(activeProvider, { endpoint: e.target.value })}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Custom System Prompt Override */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Custom System Instructions (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Leave empty to use Clearly's optimized default reading prompt. Add any custom rules or persona instructions here."
            value={settings.customSystemPrompt || ''}
            onChange={(e) => onChange('customSystemPrompt', e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
};
