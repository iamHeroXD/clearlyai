import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';
import { AI_MODEL_CONFIG, formatProviderError } from '../config/models';

export class GeminiProvider implements AIProvider {
  id = 'gemini';
  name = 'Google Gemini';

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    const rawKey = config.apiKey?.trim();
    if (!rawKey) {
      throw new Error("Google Gemini API key is missing. Please configure your key in Extension Settings.");
    }

    const requestedModel = config.model?.trim() || AI_MODEL_CONFIG.gemini.defaultModel;
    const baseUrl = config.endpoint?.trim() || AI_MODEL_CONFIG.gemini.endpoint;

    // Production-supported models from AI_MODEL_CONFIG
    const productionModels = AI_MODEL_CONFIG.gemini.models.map((m) => m.id);
    const modelsToTry = [
      requestedModel,
      ...productionModels,
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    const systemInstruction = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: config.temperature ?? 0.1,
        maxOutputTokens: config.maxTokens ?? 350,
        responseMimeType: 'application/json',
      },
    };

    let lastErrorMessage = '';

    for (const modelName of modelsToTry) {
      // Secure transport: transmit key strictly via x-goog-api-key HTTP header
      const url = `${baseUrl}/${encodeURIComponent(modelName)}:generateContent`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': rawKey,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return parseJsonOutput(candidateText, request.mode);
          }
          throw new Error('Received empty response from Gemini.');
        } else {
          const errorData = await response.json().catch(() => ({}));
          const rawMsg = errorData?.error?.message || `HTTP ${response.status}`;
          lastErrorMessage = rawMsg;

          // If API key is rejected, fail fast with actionable guidance
          if (response.status === 400 && rawMsg.toLowerCase().includes('api_key_invalid')) {
            throw new Error(formatProviderError('Gemini', 'API key is invalid. Please verify your key at aistudio.google.com.'));
          }

          if (response.status === 401 || response.status === 403) {
            throw new Error(formatProviderError('Gemini', 'API key is unauthorized. Check your permissions or billing in Google Cloud.'));
          }

          if (response.status === 429) {
            throw new Error(formatProviderError('Gemini', 'Rate limit exceeded. Please wait a few moments before trying again.'));
          }

          // For 404 (model not found) or 503 (transient overload), try next fallback model
          continue;
        }
      } catch (err: any) {
        clearTimeout(timeoutId);

        if (err.name === 'AbortError') {
          throw new Error(formatProviderError('Gemini', 'Request timed out after 15 seconds. Please try again.'));
        }

        if (err.message && err.message.includes('API key is')) {
          throw err;
        }

        lastErrorMessage = err?.message || 'Network connection failed.';
      }
    }

    throw new Error(formatProviderError('Gemini', lastErrorMessage || 'Failed to generate explanation.'));
  }
}
