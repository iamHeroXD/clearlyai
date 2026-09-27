import { ExplanationRequest, StructuredExplanation, ExtensionSettings } from '../types';
import { getStoredSettings } from './storage';
import { getAIProvider } from '../providers';
import { cacheService, generateCacheKey } from './cache';
import { addHistoryItem } from './history';
import { detectCode } from '../utils/codeDetector';
import { detectMath } from '../utils/mathDetector';

export async function processExplanationRequest(
  request: ExplanationRequest,
  overrideSettings?: ExtensionSettings
): Promise<StructuredExplanation> {
  const settings = overrideSettings || (await getStoredSettings());

  if (!settings.enabled) {
    throw new Error('Clearly is currently paused. Enable it from the extension popup.');
  }

  // Auto-detect mode if not explicitly chosen or if general 'explain' / 'simple' mode
  let effectiveMode = request.mode;
  if (effectiveMode === 'explain' || effectiveMode === 'simple') {
    if (settings.learningMode) {
      effectiveMode = 'eli5';
    } else if (settings.autoDetectCode && detectCode(request.text).isCode) {
      effectiveMode = 'code';
    } else if (settings.autoDetectMath && detectMath(request.text).isMath) {
      effectiveMode = 'math';
    } else if (request.text.trim().split(/\s+/).length <= 2 && !request.text.includes('.')) {
      effectiveMode = 'define';
    } else {
      effectiveMode = 'simple';
    }
  }

  const enrichedRequest: ExplanationRequest = {
    ...request,
    mode: effectiveMode,
  };

  const activeProviderKey = settings.activeProvider;
  const providerConfig = settings.providers[activeProviderKey] || {};
  const providerInstance = getAIProvider(activeProviderKey);

  // Check cache first (only for non-followup requests)
  let cacheKey: string | null = null;
  if (settings.cacheEnabled && !enrichedRequest.followUpQuery) {
    cacheKey = generateCacheKey(enrichedRequest, activeProviderKey, providerConfig.model);
    const cachedResponse = cacheService.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    const response = await providerInstance.explain(
      enrichedRequest,
      providerConfig,
      settings.defaultLanguage,
      settings.customSystemPrompt
    );

    // Cache the response
    if (cacheKey && settings.cacheEnabled) {
      cacheService.set(cacheKey, response);
    }

    // Add to history (if history is enabled)
    if (settings.historyEnabled) {
      addHistoryItem(enrichedRequest, response).catch(() => {});
    }

    return response;
  } catch (err: any) {
    const errorMessage = err?.message || 'Failed to explain selected text. Please try again.';
    throw new Error(errorMessage);
  }
}
