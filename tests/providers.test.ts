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
});
