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
        try {
          const stored = (typeof result[SETTINGS_KEY] === 'object' && result[SETTINGS_KEY] !== null)
            ? result[SETTINGS_KEY]
            : {};
          const storedProviders = (typeof stored.providers === 'object' && stored.providers !== null)
            ? stored.providers
            : {};
          
          const geminiKey = storedProviders.gemini?.apiKey ?? DEFAULT_SETTINGS.providers.gemini.apiKey;
          let geminiModel = storedProviders.gemini?.model || DEFAULT_SETTINGS.providers.gemini.model;

          // Migrate obsolete or retired model names to current stable production model
          const obsoleteModels = ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-latest'];
          if (obsoleteModels.includes(geminiModel)) {
            geminiModel = 'gemini-1.5-flash';
          }

          const merged: ExtensionSettings = {
            ...DEFAULT_SETTINGS,
            ...stored,
            _version: 1,
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
