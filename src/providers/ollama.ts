import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';
import { formatProviderError, AI_MODEL_CONFIG, validateAndResolveModel } from '../config/models';

export class OllamaProvider implements AIProvider {
  id = 'ollama';
  name = 'Ollama (Local)';

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    const endpoint = config.endpoint || AI_MODEL_CONFIG.ollama.endpoint;
    const { resolvedModel } = validateAndResolveModel('ollama', config.model);

    const systemPrompt = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    const payload = {
      model: resolvedModel,
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      stream: false,
      format: 'json',
      options: {
        temperature: config.temperature ?? 0.2,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch((fetchErr) => {
        if (fetchErr.name === 'AbortError') throw fetchErr;
        throw new Error('Unable to connect to local Ollama. Ensure Ollama is running on localhost:11434 with OLLAMA_ORIGINS="*"');
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(formatProviderError('Ollama', `HTTP ${response.status}: ${response.statusText}`));
      }

      const data = await response.json();
      const content = data?.response;

      if (!content) {
        throw new Error('Empty response from Ollama.');
      }

      return parseJsonOutput(content, request.mode);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(formatProviderError('Ollama', 'Request timed out after 15 seconds.'));
      }
      throw err;
    }
  }
}
