import { CanonicalLensId, ExplanationMode } from './lenses';

export type { CanonicalLensId, ExplanationMode };
export type AIProviderType = 'gemini' | 'nano' | 'openai' | 'anthropic' | 'ollama' | 'custom' | 'mock';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ProviderConfig {
  apiKey?: string;
  model?: string;
  endpoint?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ExtensionSettings {
  enabled: boolean;
  activeProvider: AIProviderType;
  providers: {
    gemini: ProviderConfig;
    nano: ProviderConfig;
    openai: ProviderConfig;
    anthropic: ProviderConfig;
    ollama: ProviderConfig;
    custom: ProviderConfig;
    mock: ProviderConfig;
  };
  defaultLanguage: string;
  learningMode: boolean;
  altKeyQuickPeek: boolean;
  voiceSpeed: number;
  theme: ThemePreference;
  autoDetectCode: boolean;
  autoDetectMath: boolean;
  showFloatingButton: boolean;
  maxSelectionLength: number;
  enableContextMenu: boolean;
  keyboardShortcutEnabled: boolean;
  historyEnabled: boolean;
  cacheEnabled: boolean;
  includeSurroundingContext: boolean;
  customSystemPrompt?: string;
  _version?: number;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  _version: 1,
  enabled: true,
  activeProvider: 'gemini',
  providers: {
    gemini: {
      apiKey: '',
      model: 'gemini-2.0-flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    },
    nano: {
      model: 'gemini-nano',
    },
    openai: {
      apiKey: '',
      model: 'gpt-4o-mini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
    },
    anthropic: {
      apiKey: '',
      model: 'claude-3-5-haiku-20241022',
      endpoint: 'https://api.anthropic.com/v1/messages',
    },
    ollama: {
      apiKey: '',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434/api/generate',
    },
    custom: {
      apiKey: '',
      model: 'custom-model',
      endpoint: '',
    },
    mock: {
      apiKey: 'demo',
      model: 'mock-engine',
    },
  },
  defaultLanguage: 'English',
  learningMode: false,
  altKeyQuickPeek: true,
  voiceSpeed: 1.0,
  theme: 'system',
  autoDetectCode: true,
  autoDetectMath: true,
  showFloatingButton: true,
  maxSelectionLength: 4000,
  enableContextMenu: true,
  keyboardShortcutEnabled: true,
  historyEnabled: true,
  cacheEnabled: true,
  includeSurroundingContext: true,
  customSystemPrompt: '',
};
