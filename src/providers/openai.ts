import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';
import { formatProviderError, AI_MODEL_CONFIG } from '../config/models';

export class OpenAIProvider implements AIProvider {
  id = 'openai';
  name = 'OpenAI';

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is missing. Please set it in Extension Settings.');
    }

    const endpoint = config.endpoint || AI_MODEL_CONFIG.openai.endpoint;
    const model = config.model || AI_MODEL_CONFIG.openai.defaultModel;

    const systemPrompt = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: config.temperature ?? 0.2,
      max_tokens: config.maxTokens ?? 1024,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const rawMsg = err?.error?.message || `HTTP ${response.status}`;
        throw new Error(formatProviderError('OpenAI', rawMsg));
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response received from OpenAI.');
      }

      return parseJsonOutput(content, request.mode);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(formatProviderError('OpenAI', 'Request timed out after 15 seconds.'));
      }
      throw err;
    }
  }
}
