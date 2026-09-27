import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';

export class OllamaProvider implements AIProvider {
  id = 'ollama';
  name = 'Ollama (Local)';

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    const endpoint = config.endpoint || 'http://localhost:11434/api/generate';
    const model = config.model || 'llama3.2';

    const systemPrompt = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    const payload = {
      model,
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      stream: false,
      format: 'json',
      options: {
        temperature: config.temperature ?? 0.2,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      throw new Error('Unable to connect to local Ollama. Ensure Ollama is running on localhost:11434 with OLLAMA_ORIGINS="*"');
    });

    if (!response.ok) {
      throw new Error(`Ollama error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    const content = data?.response;

    if (!content) {
      throw new Error('Empty response from Ollama.');
    }

    return parseJsonOutput(content, request.mode);
  }
}
