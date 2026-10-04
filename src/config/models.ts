/**
 * Single Source of Truth for AI Models & Provider Configurations
 * Based strictly on current official provider API documentation.
 */

export type ModelStatus = 'active' | 'legacy' | 'retired';

export interface ModelMetadata {
  id: string;
  name: string;
  provider: 'gemini' | 'openai' | 'anthropic' | 'ollama';
  status: ModelStatus;
  description: string;
  contextWindow: number;
  recommended?: boolean;
  capabilities: string[];
  introducedAt?: string;
  retirementDate?: string;
  replacementModel?: string;
}

export interface ProviderMetadata {
  id: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'nano' | 'custom' | 'mock';
  name: string;
  type: 'cloud' | 'local';
  defaultModel: string;
  models: ModelMetadata[];
  endpoint: string;
  authHeader?: string;
  authPrefix?: string;
  docUrl: string;
}

export const AI_MODEL_CONFIG = {
  gemini: {
    id: 'gemini' as const,
    name: 'Google Gemini',
    type: 'cloud' as const,
    defaultModel: 'gemini-3.8-flash',
    models: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash',
        provider: 'gemini' as const,
        status: 'active' as const,
        description: 'Official flagship high-speed multimodal reasoning model recommended for production.',
        contextWindow: 1048576,
        recommended: true,
        capabilities: ['reasoning', 'multimodal', 'low-latency', 'fast-reading'],
        introducedAt: '2026-03-01',
      },
      {
        id: 'gemini-3.5-flash-lite',
        name: 'Gemini 3.5 Flash-Lite',
        provider: 'gemini' as const,
        status: 'active' as const,
        description: 'Ultra-fast, cost-efficient model for high-frequency text simplification.',
        contextWindow: 1048576,
        capabilities: ['high-frequency', 'cost-efficient', 'lightweight', 'fast-reading'],
        introducedAt: '2026-01-15',
      },
      {
        id: 'gemini-3.1-pro-preview',
        name: 'Gemini 3.1 Pro',
        provider: 'gemini' as const,
        status: 'active' as const,
        description: 'Frontier reasoning model for complex STEM proofs, academic papers, and dense text.',
        contextWindow: 2097152,
        capabilities: ['deep-reasoning', 'complex-code', 'stem', 'large-context', 'fast-reading'],
        introducedAt: '2026-02-01',
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash (Legacy)',
        provider: 'gemini' as const,
        status: 'legacy' as const,
        description: 'Prior generation model (access restricted by Google to grandfathered accounts).',
        contextWindow: 1048576,
        capabilities: ['multimodal', 'fast-reading'],
        introducedAt: '2025-06-01',
        replacementModel: 'gemini-3.8-flash',
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro (Legacy)',
        provider: 'gemini' as const,
        status: 'legacy' as const,
        description: 'Prior generation reasoning model (access restricted by Google to grandfathered accounts).',
        contextWindow: 2097152,
        capabilities: ['deep-reasoning', 'fast-reading'],
        introducedAt: '2025-06-01',
        replacementModel: 'gemini-3.1-pro-preview',
      },
      {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash-Lite (Legacy)',
        provider: 'gemini' as const,
        status: 'legacy' as const,
        description: 'Prior generation lightweight model.',
        contextWindow: 1048576,
        capabilities: ['cost-efficient', 'fast-reading'],
        introducedAt: '2025-08-01',
        replacementModel: 'gemini-3.5-flash-lite',
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash (Retired)',
        provider: 'gemini' as const,
        status: 'retired' as const,
        description: 'Retired model, replaced by Gemini 3.8 Flash.',
        contextWindow: 1048576,
        capabilities: ['multimodal'],
        retirementDate: '2026-06-01',
        replacementModel: 'gemini-3.8-flash',
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro (Retired)',
        provider: 'gemini' as const,
        status: 'retired' as const,
        description: 'Retired reasoning model, replaced by Gemini 3.1 Pro.',
        contextWindow: 2097152,
        capabilities: ['multimodal'],
        retirementDate: '2026-06-01',
        replacementModel: 'gemini-3.1-pro-preview',
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash (Retired)',
        provider: 'gemini' as const,
        status: 'retired' as const,
        description: 'Retired experimental model, replaced by Gemini 3.8 Flash.',
        contextWindow: 1048576,
        capabilities: ['multimodal'],
        retirementDate: '2026-01-01',
        replacementModel: 'gemini-3.8-flash',
      },
    ],
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    authHeader: 'x-goog-api-key',
    docUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini',
  },
  openai: {
    id: 'openai' as const,
    name: 'OpenAI',
    type: 'cloud' as const,
    defaultModel: 'gpt-4o-mini',
    models: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai' as const,
        status: 'active' as const,
        description: 'Fast, cost-efficient model for everyday reading, defining, and rewrites.',
        contextWindow: 128000,
        recommended: true,
        capabilities: ['fast', 'reading', 'cost-efficient', 'multimodal', 'fast-reading'],
        introducedAt: '2024-07-18',
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai' as const,
        status: 'active' as const,
        description: 'Flagship model for complex multimodal analysis and dense technical text.',
        contextWindow: 128000,
        capabilities: ['flagship', 'multimodal', 'complex-reasoning', 'fast-reading'],
        introducedAt: '2024-05-13',
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo (Retired)',
        provider: 'openai' as const,
        status: 'retired' as const,
        description: 'Retired model, replaced by GPT-4o Mini.',
        contextWindow: 16385,
        capabilities: ['text'],
        replacementModel: 'gpt-4o-mini',
      },
      {
        id: 'gpt-4',
        name: 'GPT-4 (Retired)',
        provider: 'openai' as const,
        status: 'retired' as const,
        description: 'Retired model, replaced by GPT-4o.',
        contextWindow: 8192,
        capabilities: ['text'],
        replacementModel: 'gpt-4o',
      },
    ],
    endpoint: 'https://api.openai.com/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    docUrl: 'https://platform.openai.com/docs/models',
  },
  anthropic: {
    id: 'anthropic' as const,
    name: 'Anthropic Claude',
    type: 'cloud' as const,
    defaultModel: 'claude-haiku-4-5-20251001',
    models: [
      {
        id: 'claude-haiku-4-5-20251001',
        name: 'Claude Haiku 4.5',
        provider: 'anthropic' as const,
        status: 'active' as const,
        description: 'Fastest Claude model with near-frontier intelligence for real-time reading assistance.',
        contextWindow: 200000,
        recommended: true,
        capabilities: ['fast', 'high-volume', 'real-time', 'reading-assistance', 'fast-reading'],
        introducedAt: '2025-10-01',
      },
      {
        id: 'claude-sonnet-5-5',
        name: 'Claude Sonnet 5.5',
        provider: 'anthropic' as const,
        status: 'active' as const,
        description: 'Frontier balance of speed and deep intelligence for complex synthesis.',
        contextWindow: 1000000,
        capabilities: ['deep-reasoning', 'coding', 'long-horizon', 'fast-reading'],
        introducedAt: '2026-03-01',
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku (Retired)',
        provider: 'anthropic' as const,
        status: 'retired' as const,
        description: 'Retired model, succeeded by Claude Haiku 4.5.',
        contextWindow: 200000,
        capabilities: ['fast'],
        retirementDate: '2026-02-19',
        replacementModel: 'claude-haiku-4-5-20251001',
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet (Retired)',
        provider: 'anthropic' as const,
        status: 'retired' as const,
        description: 'Retired model, succeeded by Claude Sonnet 5.5.',
        contextWindow: 200000,
        capabilities: ['reasoning'],
        retirementDate: '2025-10-28',
        replacementModel: 'claude-sonnet-5-5',
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku (Retired)',
        provider: 'anthropic' as const,
        status: 'retired' as const,
        description: 'Retired model, succeeded by Claude Haiku 4.5.',
        contextWindow: 200000,
        capabilities: ['fast'],
        retirementDate: '2025-08-01',
        replacementModel: 'claude-haiku-4-5-20251001',
      },
    ],
    endpoint: 'https://api.anthropic.com/v1/messages',
    authHeader: 'x-api-key',
    docUrl: 'https://docs.anthropic.com/en/docs/about-claude/models',
  },
  ollama: {
    id: 'ollama' as const,
    name: 'Ollama (Local)',
    type: 'local' as const,
    defaultModel: 'llama3.2',
    models: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2',
        provider: 'ollama' as const,
        status: 'active' as const,
        description: 'Private, on-device local inference via Ollama server.',
        contextWindow: 128000,
        recommended: true,
        capabilities: ['local', 'private', 'offline', 'on-device', 'fast-reading'],
      },
      {
        id: 'mistral',
        name: 'Mistral 7B',
        provider: 'ollama' as const,
        status: 'active' as const,
        description: 'General-purpose local open-weight model.',
        contextWindow: 32000,
        capabilities: ['local', 'private', 'fast-reading'],
      },
      {
        id: 'llama3.1',
        name: 'Llama 3.1',
        provider: 'ollama' as const,
        status: 'active' as const,
        description: 'High-capability local open-weight model.',
        contextWindow: 128000,
        capabilities: ['local', 'private', 'fast-reading'],
      },
      {
        id: 'phi3',
        name: 'Phi-3 Mini',
        provider: 'ollama' as const,
        status: 'active' as const,
        description: 'Lightweight local model suitable for low-spec machines.',
        contextWindow: 128000,
        capabilities: ['local', 'private', 'lightweight', 'fast-reading'],
      },
    ],
    endpoint: 'http://localhost:11434/api/generate',
    docUrl: 'https://ollama.com',
  },
} as const;

/**
 * Returns strictly active models for a given provider
 */
export function getActiveModels(provider: string): ModelMetadata[] {
  const config = (AI_MODEL_CONFIG as Record<string, any>)[provider];
  if (!config?.models) return [];
  return config.models.filter((m: ModelMetadata) => m.status === 'active');
}

/**
 * Checks if a model ID is currently active and supported by the provider
 */
export function isModelSupported(provider: string, modelId: string | undefined): boolean {
  if (!modelId || !provider) return false;
  const config = (AI_MODEL_CONFIG as Record<string, any>)[provider];
  if (!config?.models) return false;
  return config.models.some((m: ModelMetadata) => m.id === modelId && m.status === 'active');
}

/**
 * Returns deterministic fallback models for automatic error recovery.
 * ARCHITECTURAL RULE: Fallback candidates MUST NEVER include retired or legacy models.
 * Only models with status === 'active' are returned.
 */
export function getDeterministicFallbackModels(
  provider: string,
  primaryModelId: string,
  requiredCapability?: string
): string[] {
  const activeModels = getActiveModels(provider);
  return activeModels
    .filter((m) => {
      // Fallback candidate must NOT be the primary model itself
      if (m.id === primaryModelId) return false;
      // Fallback candidate must be strictly active
      if (m.status !== 'active') return false;
      // Filter by required capability if provided
      if (requiredCapability && !m.capabilities.includes(requiredCapability)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Deterministic priority: recommended models first, then alphabetical
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      return a.id.localeCompare(b.id);
    })
    .map((m) => m.id);
}

/**
 * Validates a model ID before dispatching any API request.
 * If the model is retired, legacy, or unknown, safely migrates to an active supported model.
 */
export function validateAndResolveModel(
  provider: string,
  requestedModel: string | undefined
): { resolvedModel: string; wasMigrated: boolean; reason?: string } {
  const providerConf = (AI_MODEL_CONFIG as Record<string, any>)[provider];

  // For non-registry providers (e.g. 'mock', 'custom', 'nano'), preserve model safely
  if (!providerConf) {
    const fallback = requestedModel?.trim() || (provider === 'mock' ? 'mock-engine' : (provider === 'nano' ? 'gemini-nano' : ''));
    return {
      resolvedModel: fallback,
      wasMigrated: false,
    };
  }

  const defaultModel = providerConf?.defaultModel || '';

  if (!requestedModel || typeof requestedModel !== 'string' || !requestedModel.trim()) {
    return {
      resolvedModel: defaultModel,
      wasMigrated: true,
      reason: 'No model specified; defaulted to provider active standard',
    };
  }

  const trimmed = requestedModel.trim();
  const models = providerConf?.models as ModelMetadata[] | undefined;
  const match = models?.find((m) => m.id === trimmed);

  if (match) {
    if (match.status === 'active') {
      return { resolvedModel: trimmed, wasMigrated: false };
    }
    const replacement = match.replacementModel || defaultModel;
    return {
      resolvedModel: replacement,
      wasMigrated: true,
      reason: `Model "${trimmed}" is ${match.status}; automatically migrated to active replacement "${replacement}"`,
    };
  }

  // Not directly in registry - run through legacy mapping and active verification
  const migrated = migrateModelId(provider, trimmed);
  return {
    resolvedModel: migrated,
    wasMigrated: migrated !== trimmed,
    reason: migrated !== trimmed ? `Model "${trimmed}" resolved to active model "${migrated}"` : undefined,
  };
}

/**
 * Returns human-friendly provider failure instructions
 */
export function formatProviderError(provider: string, rawError: string): string {
  const lower = rawError.toLowerCase();
  const provUpper = provider.toUpperCase();

  if (lower.includes('api_key_invalid') || lower.includes('invalid api key') || lower.includes('unauthorized') || lower.includes('401')) {
    return `${provUpper} couldn't process this request: API key is invalid or expired. Please check your key in Settings.`;
  }

  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('429') || lower.includes('resource_exhausted')) {
    return `${provUpper} rate limit reached. Please wait a moment or check your account quota.`;
  }

  if (lower.includes('timed out') || lower.includes('abort') || lower.includes('timeout')) {
    return `${provUpper} request timed out after 15 seconds. Please try again.`;
  }

  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('connection refused') || lower.includes('unable to connect')) {
    if (provider === 'ollama') {
      return `Local Ollama is not reachable on localhost:11434. Make sure the Ollama application is running with OLLAMA_ORIGINS="*".`;
    }
    return `Network connection to ${provUpper} failed. Check your internet connection or local server.`;
  }

  if (lower.includes('model not found') || lower.includes('404')) {
    return `${provUpper} model is unavailable or has been deprecated. Please verify model settings.`;
  }

  return `${provUpper} couldn't process this request: ${rawError}`;
}

/**
 * Migrates legacy, deprecated, or retired model IDs to current production recommendations
 */
export function migrateModelId(provider: string, currentModel: string | undefined): string {
  const providerConf = (AI_MODEL_CONFIG as Record<string, any>)[provider];

  if (!providerConf) {
    return currentModel?.trim() || (provider === 'mock' ? 'mock-engine' : (provider === 'nano' ? 'gemini-nano' : ''));
  }

  const defaultModel = providerConf?.defaultModel || '';

  if (!currentModel || typeof currentModel !== 'string' || !currentModel.trim()) {
    return defaultModel;
  }

  const trimmed = currentModel.trim();

  // Known legacy and retired models mapping directly to modern active replacements
  const legacyMap: Record<string, string> = {
    // Google Gemini -> gemini-3.8-flash (or 3.1 pro)
    'gemini-1.5-flash': 'gemini-3.8-flash',
    'gemini-1.5-pro': 'gemini-3.1-pro-preview',
    'gemini-1.5-flash-latest': 'gemini-3.8-flash',
    'gemini-1.5-pro-latest': 'gemini-3.1-pro-preview',
    'gemini-2.0-flash': 'gemini-3.8-flash',
    'gemini-2.0-flash-exp': 'gemini-3.8-flash',
    'gemini-pro': 'gemini-3.8-flash',
    'gemini-1.0-pro': 'gemini-3.8-flash',
    'gemini-2.5-flash': 'gemini-3.8-flash', // Restricted legacy tier migrated to unrestricted 3.8
    'gemini-2.5-pro': 'gemini-3.1-pro-preview',
    'gemini-2.5-flash-lite': 'gemini-3.5-flash-lite',

    // OpenAI -> gpt-4o-mini / gpt-4o
    'gpt-3.5-turbo': 'gpt-4o-mini',
    'gpt-3.5-turbo-0125': 'gpt-4o-mini',
    'gpt-3.5-turbo-16k': 'gpt-4o-mini',
    'gpt-4': 'gpt-4o',
    'gpt-4-turbo': 'gpt-4o',
    'text-davinci-003': 'gpt-4o-mini',

    // Anthropic -> claude-haiku-4-5-20251001 / claude-sonnet-5-5
    'claude-3-5-haiku-20241022': 'claude-haiku-4-5-20251001',
    'claude-3-5-sonnet-20241022': 'claude-sonnet-5-5',
    'claude-3-7-sonnet-20250219': 'claude-sonnet-5-5',
    'claude-sonnet-5.5': 'claude-sonnet-5-5', // Normalize dot alias to exact API ID
    'claude-3-haiku-20240307': 'claude-haiku-4-5-20251001',
    'claude-3-haiku': 'claude-haiku-4-5-20251001',
    'claude-2': 'claude-haiku-4-5-20251001',
    'claude-2.1': 'claude-haiku-4-5-20251001',
    'claude-instant-1.2': 'claude-haiku-4-5-20251001',
  };

  if (legacyMap[trimmed]) {
    return legacyMap[trimmed];
  }

  // If already an active supported model, retain it
  if (isModelSupported(provider, trimmed)) {
    return trimmed;
  }

  // If unknown/corrupted, migrate safely to the provider's recommended active default model
  return defaultModel;
}
