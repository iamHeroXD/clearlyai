import { AIProvider } from './types';
import { GeminiProvider } from './gemini';
import { GeminiNanoProvider } from './nano';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { OllamaProvider } from './ollama';
import { CustomProvider } from './custom';
import { MockProvider } from './mock';
import { AIProviderType } from '../types';

export * from './types';
export * from './gemini';
export * from './nano';
export * from './openai';
export * from './anthropic';
export * from './ollama';
export * from './custom';
export * from './mock';

const providers: Record<AIProviderType, AIProvider> = {
  gemini: new GeminiProvider(),
  nano: new GeminiNanoProvider(),
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  ollama: new OllamaProvider(),
  custom: new CustomProvider(),
  mock: new MockProvider(),
};

export function getAIProvider(type: AIProviderType): AIProvider {
  return providers[type] || providers.gemini;
}
