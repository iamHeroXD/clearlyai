import { describe, it, expect } from 'vitest';
import { detectCode } from '../src/utils/codeDetector';

describe('detectCode', () => {
  it('should detect JavaScript / TypeScript function syntax', () => {
    const jsSnippet = `const calculateTotal = (items) => {\n  return items.reduce((a, b) => a + b, 0);\n};`;
    const res = detectCode(jsSnippet);
    expect(res.isCode).toBe(true);
    expect(res.language).toContain('JavaScript');
  });

  it('should detect Python code syntax', () => {
    const pySnippet = `def fetch_user_data(user_id):\n    print(f"Fetching user: {user_id}")\n    return None`;
    const res = detectCode(pySnippet);
    expect(res.isCode).toBe(true);
    expect(res.language).toBe('Python');
  });

  it('should detect SQL queries', () => {
    const sql = `SELECT users.id, users.name FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.total > 100;`;
    const res = detectCode(sql);
    expect(res.isCode).toBe(true);
    expect(res.language).toBe('SQL');
  });

  it('should not mark plain English prose as code', () => {
    const prose = `The economy experienced moderate growth throughout the third quarter due to improved consumer spending.`;
    const res = detectCode(prose);
    expect(res.isCode).toBe(false);
  });
});
