import { ExtensionSettings, DEFAULT_SETTINGS } from '../types';

const SETTINGS_KEY = 'clearly_settings_v1';

export async function getStoredSettings(): Promise<ExtensionSettings> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      // Fallback for non-extension / testing environments
      const local = localStorage.getItem(SETTINGS_KEY);
      if (local) {
        try {
          resolve({ ...DEFAULT_SETTINGS, ...JSON.parse(local) });
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
        const stored = result[SETTINGS_KEY] || {};
        const storedProviders = stored.providers || {};
        
        // Ensure default gemini key is used if stored key is empty
        const geminiKey = storedProviders.gemini?.apiKey || DEFAULT_SETTINGS.providers.gemini.apiKey;
        let geminiModel = storedProviders.gemini?.model || DEFAULT_SETTINGS.providers.gemini.model;

        // Auto-migrate legacy/deprecated models that cause 404s
        const deprecatedModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
        if (!geminiModel || deprecatedModels.includes(geminiModel)) {
          geminiModel = 'gemini-flash-lite-latest';
        }

        const merged: ExtensionSettings = {
          ...DEFAULT_SETTINGS,
          ...stored,
          providers: {
            ...DEFAULT_SETTINGS.providers,
            ...storedProviders,
            gemini: {
              ...DEFAULT_SETTINGS.providers.gemini,
              ...(storedProviders.gemini || {}),
              apiKey: geminiKey,
              model: geminiModel,
            },
          },
        };
        resolve(merged);
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
