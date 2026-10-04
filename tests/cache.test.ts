import { describe, it, expect } from 'vitest';
import { generateCacheKey, cacheService } from '../src/services/cache';
import { ExplanationRequest, StructuredExplanation } from '../src/types';

describe('cacheService', () => {
  it('should generate consistent cache keys for same content', () => {
    const req1: ExplanationRequest = { text: 'Quantum computing', mode: 'explain' };
    const req2: ExplanationRequest = { text: '  quantum computing  ', mode: 'explain' };

    const key1 = generateCacheKey(req1, 'gemini', 'gemini-2.5-flash');
    const key2 = generateCacheKey(req2, 'gemini', 'gemini-2.5-flash');

    expect(key1).toBe(key2);
  });

  it('should store and retrieve cached explanations', () => {
    const key = 'test_key_123';
    const sampleData: StructuredExplanation = {
      mode: 'explain',
      summary: 'Quantum computing uses quantum bits or qubits.',
      example: 'Think of flipping a coin in mid-air.',
    };

    cacheService.set(key, sampleData);
    const retrieved = cacheService.get(key);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.summary).toBe(sampleData.summary);
    expect(retrieved?.cached).toBe(true);
  });
});
