import { AIProvider, parseJsonOutput } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { buildSystemPrompt, buildUserPrompt } from '../utils/systemPrompt';

export class GeminiNanoProvider implements AIProvider {
  id = 'nano';
  name = 'Chrome Built-in AI (Gemini Nano)';

  async isAvailable(): Promise<boolean> {
    try {
      const aiObj = (typeof window !== 'undefined' ? (window as any).ai : (globalThis as any).ai);
      if (!aiObj?.languageModel?.capabilities) return false;
      const capabilities = await aiObj.languageModel.capabilities();
      return capabilities?.available === 'readily';
    } catch {
      return false;
    }
  }

  async explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    const aiObj = (typeof window !== 'undefined' ? (window as any).ai : (globalThis as any).ai);

    if (!aiObj?.languageModel?.create) {
      throw new Error(
        'Chrome Built-in AI (Gemini Nano) is not enabled on this browser. Enable it in chrome://flags or switch to Google Gemini in Settings.'
      );
    }

    const systemInstruction = customSystemPrompt || buildSystemPrompt(request, defaultLanguage);
    const userPrompt = buildUserPrompt(request);

    try {
      const session = await aiObj.languageModel.create({
        systemPrompt: systemInstruction,
        temperature: config.temperature ?? 0.2,
        topK: 3,
      });

      const fullPrompt = `${systemInstruction}\n\nUser Request: ${userPrompt}\n\nRespond ONLY with valid JSON.`;
      const responseText = await session.prompt(fullPrompt);
      session.destroy?.();

      if (responseText) {
        return parseJsonOutput(responseText, request.mode);
      }
      throw new Error('Empty response from local AI model.');
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to generate explanation using on-device Gemini Nano.');
    }
  }
}
