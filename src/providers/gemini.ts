import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';

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
      throw new Error('Google Gemini API key is missing. Please set it in Extension Settings.');
    }

    const requestedModel = config.model?.trim() || 'gemini-flash-lite-latest';
    const baseUrl = config.endpoint || 'https://generativelanguage.googleapis.com/v1beta/models';

    // Robust fallback sequence tested and verified on Gemini API endpoints
    const modelsToTry = [
      requestedModel,
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-3.6-flash',
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
        maxOutputTokens: config.maxTokens ?? 300,
        responseMimeType: 'application/json',
      },
    };

    let lastErrorMessage = '';

    for (const modelName of modelsToTry) {
      const url = `${baseUrl}/${modelName}:generateContent?key=${encodeURIComponent(rawKey)}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': rawKey,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return parseJsonOutput(candidateText, request.mode);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData?.error?.message || `HTTP ${response.status}`;
          lastErrorMessage = msg;

          // If API key itself is invalid, stop immediately
          if (response.status === 400 && msg.toLowerCase().includes('api_key_invalid')) {
            throw new Error('Invalid Gemini API Key. Check your key in Settings.');
          }

          // Otherwise (404 deprecated model, 503 high load, 500), try next fallback model
          continue;
        }
      } catch (err: any) {
        if (err.message && err.message.includes('Invalid Gemini API Key')) {
          throw err;
        }
        // Network or fetch error: continue to next fallback
        lastErrorMessage = err?.message || 'Network error';
      }
    }

    throw new Error(lastErrorMessage || 'Failed to generate explanation.');
  }
}
