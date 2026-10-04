import { ExtensionSettings, DEFAULT_SETTINGS } from '../types';
import { migrateModelId } from '../config/models';

const SETTINGS_KEY = 'clearly_settings_v1';

function sanitizeProviders(rawProviders: any): ExtensionSettings['providers'] {
  const providers: any = { ...DEFAULT_SETTINGS.providers };
  if (!rawProviders || typeof rawProviders !== 'object') return providers;

  for (const key of ['gemini', 'openai', 'anthropic', 'ollama'] as const) {
    const defaultConf = DEFAULT_SETTINGS.providers[key];
    const storedConf = rawProviders[key] || {};
    providers[key] = {
      ...defaultConf,
      ...storedConf,
      model: migrateModelId(key, storedConf.model || defaultConf.model),
    };
  }

  return providers;
}

export async function getStoredSettings(): Promise<ExtensionSettings> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      // Fallback for non-extension / testing environments
      const local = localStorage.getItem(SETTINGS_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          resolve({
            ...DEFAULT_SETTINGS,
            ...parsed,
            providers: sanitizeProviders(parsed?.providers),
          });
          return;
        } catch (e) {
          // ignore
        }
      }
      resolve(DEFAULT_SETTINGS);
      return;
    }

    chrome.storage.local.get([SETTINGS_KEY], (result) => {
      if (chrome.runtime.lastError || !result[SETTINGS_KEY]) {
        resolve(DEFAULT_SETTINGS);
      } else {
        try {
          const stored = (typeof result[SETTINGS_KEY] === 'object' && result[SETTINGS_KEY] !== null)
            ? result[SETTINGS_KEY]
            : {};
          
          const merged: ExtensionSettings = {
            ...DEFAULT_SETTINGS,
            ...stored,
            _version: 1,
            providers: sanitizeProviders(stored.providers),
          };
          resolve(merged);
        } catch (e) {
          console.warn('Clearly: Recovered from corrupted settings storage', e);
          resolve(DEFAULT_SETTINGS);
        }
      }
    });
  });
}

export async function saveStoredSettings(newSettings: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
  const current = await getStoredSettings();
  const merged: ExtensionSettings = {
    ...current,
    ...newSettings,
    providers: {
      ...current.providers,
      ...(newSettings.providers || {}),
    },
  };

  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      resolve(merged);
      return;
    }

    chrome.storage.local.set({ [SETTINGS_KEY]: merged }, () => {
      resolve(merged);
    });
  });
}
