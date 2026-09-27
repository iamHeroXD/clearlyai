import { describe, it, expect } from 'vitest';
import { detectMath } from '../src/utils/mathDetector';

describe('detectMath', () => {
  it('should detect LaTeX formulas and equations', () => {
    const latex = `\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`;
    const res = detectMath(latex);
    expect(res.isMath).toBe(true);
    expect(res.type).toBe('latex');
  });

  it('should detect standard algebraic equations', () => {
    const eq = `E = mc^2`;
    const res = detectMath(eq);
    expect(res.isMath).toBe(true);
  });

  it('should detect mathematical function expressions', () => {
    const trig = `sin(x) + cos(2 * x) = 1`;
    const res = detectMath(trig);
    expect(res.isMath).toBe(true);
  });

  it('should not detect plain sentences', () => {
    const sentence = `The quick brown fox jumps over the lazy dog.`;
    const res = detectMath(sentence);
    expect(res.isMath).toBe(false);
  });
});
