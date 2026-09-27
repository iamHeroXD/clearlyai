import React from 'react';
import { ExtensionSettings, ThemePreference } from '../../types';

interface GeneralSettingsProps {
  settings: ExtensionSettings;
  onChange: <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">General Preferences</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure how Clearly appears and behaves while browsing.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
        {/* Enable / Disable */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Extension Status</div>
            <div className="text-xs text-slate-500">Enable or temporarily pause text selection detection</div>
          </div>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange('enabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Floating Action Button */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Show Floating Action Button</div>
            <div className="text-xs text-slate-500">Display the tiny [ ✨ Explain ] pill immediately when selecting text</div>
          </div>
          <input
            type="checkbox"
            checked={settings.showFloatingButton}
            onChange={(e) => onChange('showFloatingButton', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Right-click Context Menu */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Right-Click Context Menu</div>
            <div className="text-xs text-slate-500">Add "Explain with Clearly" to your right-click context menu</div>
          </div>
          <input
            type="checkbox"
            checked={settings.enableContextMenu}
            onChange={(e) => onChange('enableContextMenu', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Auto Detect Code */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Intelligent Code Detection</div>
            <div className="text-xs text-slate-500">Automatically switch to Code Mode when selecting programming code</div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoDetectCode}
            onChange={(e) => onChange('autoDetectCode', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Auto Detect Math */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Intelligent Math & Equation Detection</div>
            <div className="text-xs text-slate-500">Automatically break down equations, formulas, and LaTeX notations</div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoDetectMath}
            onChange={(e) => onChange('autoDetectMath', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Learning Mode */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Learning & Student Mode</div>
            <div className="text-xs text-slate-500">Includes real-world analogies, key takeaways, and quick understanding quizzes</div>
          </div>
          <input
            type="checkbox"
            checked={settings.learningMode}
            onChange={(e) => onChange('learningMode', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
        </div>

        {/* Theme Preference */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Appearance Theme</div>
            <div className="text-xs text-slate-500">Choose light, dark, or follow operating system settings</div>
          </div>
          <select
            value={settings.theme}
            onChange={(e) => onChange('theme', e.target.value as ThemePreference)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
          >
            <option value="system">System Default</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Default Language */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Default Output Language</div>
            <div className="text-xs text-slate-500">Target language for all explanations and translations</div>
          </div>
          <select
            value={settings.defaultLanguage}
            onChange={(e) => onChange('defaultLanguage', e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
            <option value="German">German (Deutsch)</option>
            <option value="Italian">Italian (Italiano)</option>
            <option value="Japanese">Japanese (日本語)</option>
            <option value="Chinese">Chinese (Simplified / 简体中文)</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Portuguese">Portuguese (Português)</option>
            <option value="Russian">Russian (Русский)</option>
            <option value="Arabic">Arabic (العربية)</option>
          </select>
        </div>

        {/* Max Selection Length */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Max Selection Length</div>
            <div className="text-xs text-slate-500">Maximum characters allowed per selection (prevents accidental whole-page highlights)</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="200"
              max="15000"
              step="500"
              value={settings.maxSelectionLength}
              onChange={(e) => onChange('maxSelectionLength', parseInt(e.target.value, 10) || 4000)}
              className="w-24 text-xs py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-right outline-none"
            />
            <span className="text-xs text-slate-400">chars</span>
          </div>
        </div>
      </div>
    </div>
  );
};
