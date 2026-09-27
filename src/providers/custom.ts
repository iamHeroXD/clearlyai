import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';

export class CustomProvider implements AIProvider {
  id = 'custom';
  name = 'Custom / OpenAI-Compatible';

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    if (!config.endpoint) {
      throw new Error('Custom API endpoint is missing. Please set it in Extension Settings.');
    }

    const systemPrompt = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
    }

    const payload = {
      model: config.model || 'default',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: config.temperature ?? 0.2,
      max_tokens: config.maxTokens ?? 1024,
    };

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = err?.error?.message || `Custom API error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || data?.response;

    if (!content) {
      throw new Error('Empty response received from custom provider.');
    }

    return parseJsonOutput(content, request.mode);
  }
}
