export type ExplanationMode = 
  | 'simple' 
  | 'eli5'
  | 'define'
  | 'grammar'
  | 'professional'
  | 'code'
  | 'math'
  | 'legal'
  | 'tldr'
  | 'translate'
  | 'summarize' 
  | 'example' 
  | 'keypoints' 
  | 'polish';

export interface StructuredExplanation {
  id: string;
  title: string;
  originalText: string;
  mode: ExplanationMode;
  summary: string;
  coreMeaning: string;
  whyItMatters: string;
  example: string;
  keyTerms?: string[];
  ipa?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  targetLanguage?: string;
  timestamp: number;
  sourceApp?: string;
  latencyMs: number;
  starred?: boolean;
  notes?: string;
  isOfflineFallback?: boolean;
  fallbackReason?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  linkedExplanationId?: string;
  tags: string[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface DesktopSettings {
  launchOnStartup: boolean;
  defaultMode: ExplanationMode;
  targetLanguage: string;
  notificationsEnabled: boolean;
  
  hotkeySpotlight: string;
  hotkeyScreenSelect: string;
  hotkeyClipboard: string;

  theme: 'dark' | 'light' | 'system';
  glassBlurLevel: number;
  compactMode: boolean;
  reduceMotion: boolean;

  activeProvider: 'gemini' | 'claude' | 'ollama' | 'openai' | 'offline';
  geminiApiKey?: string;
  claudeApiKey?: string;
  openaiApiKey?: string;
  ollamaEndpoint?: string;
  responseStyle: 'concise' | 'balanced' | 'detailed';

  dataRetentionDays: number;
  telemetryEnabled: boolean;
  saveHistory: boolean;
}

export const DEFAULT_SETTINGS: DesktopSettings = {
  launchOnStartup: true,
  defaultMode: 'simple',
  targetLanguage: 'English',
  notificationsEnabled: true,

  hotkeySpotlight: '⌥ Space',
  hotkeyScreenSelect: 'Ctrl+Shift+C',
  hotkeyClipboard: '⌥ V',

  theme: 'light',
  glassBlurLevel: 24,
  compactMode: false,
  reduceMotion: false,

  activeProvider: 'gemini',
  responseStyle: 'balanced',

  dataRetentionDays: 30,
  telemetryEnabled: false,
  saveHistory: true,
};
