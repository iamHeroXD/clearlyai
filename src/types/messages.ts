import { ExplanationMode, ExtensionSettings } from './settings';

export interface ExplanationRequest {
  text: string;
  contextBefore?: string;
  contextAfter?: string;
  mode: ExplanationMode;
  targetLanguage?: string;
  followUpQuery?: string;
  customPrompt?: string;
  pageTitle?: string;
  pageUrl?: string;
}

export interface StructuredExplanation {
  mode: ExplanationMode;
  title?: string;
  summary: string;
  example?: string;
  whyItMatters?: string;
  simplifiedText?: string;
  translatedText?: string;
  rewrittenText?: string;
  phoneticSpelling?: string;
  tldrPoints?: string[];
  legalFlags?: {
    riskLevel: 'low' | 'medium' | 'high';
    flags: string[];
    summary: string;
  };
  codeBreakdown?: {
    language?: string;
    whatItDoes: string;
    keyParts?: string[];
    potentialIssues?: string;
  };
  mathBreakdown?: {
    concept: string;
    whatItMeans: string;
    steps?: string[];
  };
  defineBreakdown?: {
    word: string;
    partOfSpeech?: string;
    definition: string;
    example: string;
    phonetic?: string;
    similarWords?: string[];
  };
  learningQuiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
  rawText?: string;
  cached?: boolean;
  provider?: string;
  model?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  mode: ExplanationMode;
  response: StructuredExplanation;
  isStarred?: boolean;
  tags?: string[];
  pageTitle?: string;
  pageUrl?: string;
}

// Extension Internal Messaging
export type ExtensionMessage =
  | { type: 'EXPLAIN_TEXT'; payload: ExplanationRequest }
  | { type: 'TRIGGER_EXPLAIN_SHORTCUT'; payload?: { text?: string } }
  | { type: 'GET_SETTINGS' }
  | { type: 'SAVE_SETTINGS'; payload: Partial<ExtensionSettings> }
  | { type: 'GET_HISTORY' }
  | { type: 'TOGGLE_STAR_HISTORY_ITEM'; payload: { id: string } }
  | { type: 'EXPORT_HISTORY'; payload?: { format: 'markdown' | 'json'; starredOnly?: boolean } }
  | { type: 'DELETE_HISTORY_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_CACHE' }
  | { type: 'TEST_PROVIDER'; payload: { provider: string } };

export type ExtensionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
