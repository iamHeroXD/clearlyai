import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';
import { formatProviderError } from '../config/models';

export class AnthropicProvider implements AIProvider {
  id = 'anthropic';
  name = 'Anthropic Claude';

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    if (!config.apiKey) {
      throw new Error('Anthropic API key is missing. Please set it in Extension Settings.');
    }

    const endpoint = config.endpoint || 'https://api.anthropic.com/v1/messages';
    const model = config.model || 'claude-3-5-haiku-20241022';

    const systemPrompt = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    const payload = {
      model,
      max_tokens: config.maxTokens ?? 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      temperature: config.temperature ?? 0.2,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const rawMsg = err?.error?.message || `HTTP ${response.status}`;
        throw new Error(formatProviderError('Anthropic', rawMsg));
      }

      const data = await response.json();
      const content = data?.content?.[0]?.text;

      if (!content) {
        throw new Error('Empty response received from Anthropic.');
      }

      return parseJsonOutput(content, request.mode);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(formatProviderError('Anthropic', 'Request timed out after 15 seconds.'));
      }
      throw err;
    }
  }
}
