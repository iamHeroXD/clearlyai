import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';

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

    const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
    const model = config.model || 'gpt-4o-mini';

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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = err?.error?.message || `OpenAI API error: ${response.status}`;
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API Key. Check settings.');
      } else if (response.status === 429) {
        throw new Error('OpenAI rate limit or quota exceeded. Please try again soon.');
      }
      throw new Error(message);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response received from OpenAI.');
    }

    return parseJsonOutput(content, request.mode);
  }
}
