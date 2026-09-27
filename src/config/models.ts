/**
 * Single Source of Truth for AI Models & Provider Configurations
 * Based strictly on current official provider API documentation.
 */

export interface ModelMetadata {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  recommended?: boolean;
}

export interface ProviderMetadata {
  id: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'nano' | 'custom' | 'mock';
  name: string;
  defaultModel: string;
  models: ModelMetadata[];
  endpoint: string;
  authHeader?: string;
  authPrefix?: string;
  docUrl: string;
}

export const AI_MODEL_CONFIG = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    models: [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast, lightweight multimodal model for high-frequency low-latency tasks.',
        contextWindow: 1048576,
        recommended: true,
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'High-capability model for dense reasoning, deep research, and complex code.',
        contextWindow: 2097152,
      },
    ],
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    authHeader: 'x-goog-api-key',
    docUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    models: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Fast, cost-efficient model for everyday reading tasks.',
        contextWindow: 128000,
        recommended: true,
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Flagship model for complex multimodal analysis.',
        contextWindow: 128000,
      },
    ],
    endpoint: 'https://api.openai.com/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    docUrl: 'https://platform.openai.com/docs/models',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    defaultModel: 'claude-3-5-haiku-20241022',
    models: [
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'Fastest Claude model for rapid reading assistance.',
        contextWindow: 200000,
        recommended: true,
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'High-intelligence reasoning for deep analysis.',
        contextWindow: 200000,
      },
    ],
    endpoint: 'https://api.anthropic.com/v1/messages',
    authHeader: 'x-api-key',
    docUrl: 'https://docs.anthropic.com/en/docs/about-claude/models',
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    defaultModel: 'llama3.2',
    models: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2',
        description: 'Local on-device inference via Ollama server.',
        contextWindow: 128000,
        recommended: true,
      },
    ],
    endpoint: 'http://localhost:11434/api/generate',
    docUrl: 'https://ollama.com',
  },
} as const;

/**
 * Returns human-friendly provider failure instructions
 */
export function formatProviderError(provider: string, rawError: string): string {
  const lower = rawError.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('invalid api key') || lower.includes('unauthorized') || lower.includes('401')) {
    return `${provider.toUpperCase()} couldn't process this request: API key is invalid. Please check your key in Settings.`;
  }

  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('429') || lower.includes('resource_exhausted')) {
    return `${provider.toUpperCase()} rate limit reached. Please wait a moment or check your account quota.`;
  }

  if (lower.includes('timed out') || lower.includes('abort') || lower.includes('timeout')) {
    return `${provider.toUpperCase()} request timed out after 15 seconds. Please try again.`;
  }

  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('connection refused')) {
    return `Network connection to ${provider.toUpperCase()} failed. Check your internet connection or local server.`;
  }

  return `${provider.toUpperCase()} couldn't process this request: ${rawError}`;
}
