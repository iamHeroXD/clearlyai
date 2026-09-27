import { describe, it, expect } from 'vitest';
import { parseJsonOutput } from '../src/providers/types';
import { MockProvider } from '../src/providers/mock';
import { ExplanationRequest } from '../src/types';

describe('AI Providers & Parser', () => {
  it('should parse valid json markdown blocks from AI', () => {
    const raw = '```json\n{\n  "mode": "explain",\n  "summary": "Mitochondria generate power.",\n  "example": "Like a cell battery."\n}\n```';
    const parsed = parseJsonOutput(raw, 'explain');

    expect(parsed.mode).toBe('explain');
    expect(parsed.summary).toBe('Mitochondria generate power.');
    expect(parsed.example).toBe('Like a cell battery.');
  });

  it('should handle raw fallback when AI output is non-JSON', () => {
    const raw = 'This is a plain text explanation from an unconventional model.';
    const parsed = parseJsonOutput(raw, 'explain');

    expect(parsed.summary).toBe(raw);
    expect(parsed.rawText).toBe(raw);
  });

  it('MockProvider should return valid structured output for explain mode', async () => {
    const provider = new MockProvider();
    const req: ExplanationRequest = {
      text: 'Superconductivity is the set of physical properties whereby electrical resistance vanishes.',
      mode: 'explain',
    };

    const res = await provider.explain(req, {}, 'English');
    expect(res).toBeDefined();
    expect(res.summary).toContain('explained simply');
    expect(res.example).toBeDefined();
  });

  it('MockProvider should return code breakdown for programming code', async () => {
    const provider = new MockProvider();
    const req: ExplanationRequest = {
      text: 'function add(a, b) { return a + b; }',
      mode: 'code',
    };

    const res = await provider.explain(req, {}, 'English');
    expect(res.codeBreakdown).toBeDefined();
    expect(res.codeBreakdown?.whatItDoes).toBeDefined();
  });

  it('should parse writing mode json with rewrittenText and clean summary', () => {
    const raw = '{ "mode": "rephrase", "rewrittenText": "extremely excited to announce that our team has successfully deployed the update without" }';
    const parsed = parseJsonOutput(raw, 'rephrase');

    expect(parsed.mode).toBe('rephrase');
    expect(parsed.rewrittenText).toBe('extremely excited to announce that our team has successfully deployed the update without');
    expect(parsed.summary).not.toContain('{"mode":');
    expect(parsed.summary).toBe('extremely excited to announce that our team has successfully deployed the update without');
  });

  it('should parse legal risk and tldr points json schemas', () => {
    const raw = '```json\n{\n  "mode": "legal",\n  "legalFlags": {\n    "riskLevel": "high",\n    "flags": ["Arbitration clause"],\n    "summary": "High risk contract."\n  },\n  "tldrPoints": ["Point 1", "Point 2", "Point 3"]\n}\n```';
    const parsed = parseJsonOutput(raw, 'legal');

    expect(parsed.legalFlags?.riskLevel).toBe('high');
    expect(parsed.legalFlags?.flags).toHaveLength(1);
    expect(parsed.tldrPoints).toHaveLength(3);
  });

  it('MockProvider should handle grammar and legal modes', async () => {
    const provider = new MockProvider();
    const grammarRes = await provider.explain({ text: 'team has exitedly deployed', mode: 'grammar' }, {}, 'English');
    expect(grammarRes.rewrittenText).toBeDefined();

    const legalRes = await provider.explain({ text: 'binding arbitration', mode: 'legal' }, {}, 'English');
    expect(legalRes.legalFlags?.riskLevel).toBe('high');
  });

  it('AI_MODEL_CONFIG should strictly use official gemini-1.5-flash as default', async () => {
    const { AI_MODEL_CONFIG } = await import('../src/config/models');
    expect(AI_MODEL_CONFIG.gemini.defaultModel).toBe('gemini-1.5-flash');
    expect(AI_MODEL_CONFIG.gemini.authHeader).toBe('x-goog-api-key');
    const modelIds = AI_MODEL_CONFIG.gemini.models.map((m: any) => m.id);
    expect(modelIds).toContain('gemini-1.5-flash');
    expect(modelIds).toContain('gemini-1.5-pro');
    expect(modelIds).not.toContain('gemini-2.0-flash');
  });

  it('formatProviderError should format auth, quota, timeout, and network errors gracefully', async () => {
    const { formatProviderError } = await import('../src/config/models');

    const authErr = formatProviderError('gemini', 'API_KEY_INVALID');
    expect(authErr).toContain('API key is invalid');

    const quotaErr = formatProviderError('gemini', 'Quota exceeded 429');
    expect(quotaErr).toContain('rate limit reached');

    const timeoutErr = formatProviderError('gemini', 'Request timed out');
    expect(timeoutErr).toContain('timed out after 15 seconds');

    const netErr = formatProviderError('gemini', 'Failed to fetch network error');
    expect(netErr).toContain('Network connection to GEMINI failed');
  });

  describe('GeminiNanoProvider', () => {
    it('isAvailable returns false when window.ai is missing', async () => {
      const { GeminiNanoProvider } = await import('../src/providers/nano');
      const provider = new GeminiNanoProvider();
      const available = await provider.isAvailable();
      expect(available).toBe(false);
    });

    it('explain throws helpful actionable error when window.ai is not available', async () => {
      const { GeminiNanoProvider } = await import('../src/providers/nano');
      const provider = new GeminiNanoProvider();
      await expect(
        provider.explain({ text: 'test sentence', mode: 'simple' }, {}, 'English')
      ).rejects.toThrow('Chrome Built-in AI (Gemini Nano) is not enabled on this browser');
    });

    it('explain succeeds when mock window.ai is present', async () => {
      const { GeminiNanoProvider } = await import('../src/providers/nano');
      const provider = new GeminiNanoProvider();

      // Mock window.ai
      const originalAi = (globalThis as any).ai;
      (globalThis as any).ai = {
        languageModel: {
          capabilities: async () => ({ available: 'readily' }),
          create: async () => ({
            prompt: async () => JSON.stringify({
              mode: 'simple',
              summary: 'Local Nano summarized text.',
              example: 'A concrete sample.',
            }),
            destroy: () => {},
          }),
        },
      };

      try {
        const isAvail = await provider.isAvailable();
        expect(isAvail).toBe(true);

        const res = await provider.explain({ text: 'Hello Nano', mode: 'simple' }, {}, 'English');
        expect(res.summary).toBe('Local Nano summarized text.');
        expect(res.example).toBe('A concrete sample.');
      } finally {
        (globalThis as any).ai = originalAi;
      }
    });
  });
});
