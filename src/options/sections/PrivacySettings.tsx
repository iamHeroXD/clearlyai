import React from 'react';
import { ExtensionSettings } from '../../types';

interface PrivacySettingsProps {
  settings: ExtensionSettings;
  onChange: <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Privacy & Security</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clearly is designed with strict data privacy principles. You control what information is processed.
        </p>
      </div>

      {/* Privacy Guarantees */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-xs space-y-2 text-emerald-900 dark:text-emerald-200">
        <div className="font-semibold text-sm flex items-center gap-1.5">
          <span>🛡️</span> Zero Data Collection Guarantee
        </div>
        <ul className="list-disc pl-4 space-y-1 text-[11.5px] leading-relaxed text-emerald-800 dark:text-emerald-300">
          <li><strong>No Browsing History:</strong> Clearly never tracks, logs, or stores what websites you visit.</li>
          <li><strong>No Full-Page Scanning:</strong> Clearly only inspects text when you explicitly highlight and trigger an action.</li>
          <li><strong>No Third-Party Analytics:</strong> No telemetry, user trackers, or marketing pixels are included.</li>
          <li><strong>Direct API Calls:</strong> Extension requests connect directly from your browser to your selected AI provider.</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
        {/* Surrounding Context Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Smart Surrounding Context</div>
            <div className="text-xs text-slate-500">
              Include 1-2 surrounding sentences to help the AI resolve pronouns (e.g., "it", "they") accurately.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.includeSurroundingContext}
            onChange={(e) => onChange('includeSurroundingContext', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Local History Storage */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Save Local Reading History</div>
            <div className="text-xs text-slate-500">
              Save explanations to your local browser storage so you can review them in the History tab.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.historyEnabled}
            onChange={(e) => onChange('historyEnabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Local Response Caching */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Enable Local Response Caching</div>
            <div className="text-xs text-slate-500">
              Speed up repeated selections and reduce API token consumption.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.cacheEnabled}
            onChange={(e) => onChange('cacheEnabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
