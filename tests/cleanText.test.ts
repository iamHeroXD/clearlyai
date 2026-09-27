import { describe, it, expect } from 'vitest';
import { cleanSelectedText } from '../src/utils/cleanText';

describe('cleanSelectedText', () => {
  it('should trim leading and trailing spaces', () => {
    expect(cleanSelectedText('   hello world   ')).toBe('hello world');
  });

  it('should normalize consecutive whitespace within sentences', () => {
    expect(cleanSelectedText('Photosynthesis    is   a    process.')).toBe('Photosynthesis is a process.');
  });

  it('should preserve code indentation and newlines', () => {
    const code = 'function test() {\n  const x = 10;\n  return x;\n}';
    expect(cleanSelectedText(code)).toBe(code);
  });

  it('should truncate extremely long text cleanly at word boundaries within maxLength', () => {
    const longText = 'Word '.repeat(1000);
    const cleaned = cleanSelectedText(longText, 100);
    expect(cleaned.length).toBeLessThanOrEqual(104);
    expect(cleaned.endsWith('...')).toBe(true);
  });

  it('should strip zero-width characters and unusual Unicode spaces', () => {
    const dirty = 'Hello\u200B\uFEFF \u00A0World';
    expect(cleanSelectedText(dirty)).toBe('Hello World');
  });
});
