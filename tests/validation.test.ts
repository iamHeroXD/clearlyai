import { describe, it, expect } from 'vitest';
import { parseJsonOutput } from '../src/providers/types';

describe('Defensive Schema Validation & Sanitization', () => {
  it('should reject malformed JSON and fallback gracefully to plain summary without crash', () => {
    const malformed = '{"mode": "explain", "summary": "unclosed string...';
    const result = parseJsonOutput(malformed, 'explain');

    expect(result.mode).toBe('explain');
    expect(result.summary).toBe(malformed);
    expect(result.rawText).toBe(malformed);
  });

  it('should ignore codeBreakdown if it is not an object', () => {
    const raw = JSON.stringify({
      mode: 'code',
      summary: 'A helper function',
      codeBreakdown: 'not an object, just a string'
    });
    const result = parseJsonOutput(raw, 'code');

    expect(result.summary).toBe('A helper function');
    expect(result.codeBreakdown).toBeUndefined();
  });

  it('should defensively sanitize codeBreakdown fields', () => {
    const raw = JSON.stringify({
      mode: 'code',
      summary: 'A helper function',
      codeBreakdown: {
        language: 'TypeScript',
        whatItDoes: 'Computes sum',
        keyParts: ['accumulates array elements', 12345, null], // mixed array
        potentialIssues: 'Bounds check needed'
      }
    });
    const result = parseJsonOutput(raw, 'code');

    expect(result.codeBreakdown).toBeDefined();
    expect(result.codeBreakdown?.language).toBe('TypeScript');
    expect(result.codeBreakdown?.whatItDoes).toBe('Computes sum');
    // should filter out non-string items
    expect(result.codeBreakdown?.keyParts).toEqual(['accumulates array elements']);
    expect(result.codeBreakdown?.potentialIssues).toBe('Bounds check needed');
  });

  it('should defensively sanitize legalFlags and enforce riskLevel enum', () => {
    const raw = JSON.stringify({
      mode: 'legal',
      summary: 'Legal contract review',
      legalFlags: {
        riskLevel: 'critical-danger', // non-standard
        summary: 'Contains non-compete clause',
        flags: ['Clause 4', 404]
      }
    });
    const result = parseJsonOutput(raw, 'legal');

    expect(result.legalFlags).toBeDefined();
    expect(result.legalFlags?.summary).toBe('Contains non-compete clause');
    // non-standard riskLevel should fallback to 'medium'
    expect(result.legalFlags?.riskLevel).toBe('medium');
    expect(result.legalFlags?.flags).toEqual(['Clause 4']);
  });

  it('should filter non-string items in tldrPoints and defineBreakdown', () => {
    const raw = JSON.stringify({
      mode: 'define',
      summary: 'Overview of the term',
      tldrPoints: ['Key takeaway 1', null, 999, 'Key takeaway 2'],
      defineBreakdown: {
        word: 'Heuristic',
        definition: 'A practical method',
        similarWords: ['shortcut', 123, null, 'rule of thumb']
      }
    });
    const result = parseJsonOutput(raw, 'define');

    expect(result.tldrPoints).toEqual(['Key takeaway 1', 'Key takeaway 2']);
    expect(result.defineBreakdown).toBeDefined();
    expect(result.defineBreakdown?.word).toBe('Heuristic');
    expect(result.defineBreakdown?.similarWords).toEqual(['shortcut', 'rule of thumb']);
  });

  it('should prevent stringified JSON from becoming raw summary for writing modes', () => {
    const raw = JSON.stringify({
      mode: 'rephrase',
      rewrittenText: 'Clear, concise sentence.'
    });
    const result = parseJsonOutput(raw, 'rephrase');

    expect(result.rewrittenText).toBe('Clear, concise sentence.');
    expect(result.summary).toBe('Clear, concise sentence.');
  });
});
