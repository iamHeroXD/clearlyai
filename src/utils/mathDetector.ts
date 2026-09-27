export interface MathDetectionResult {
  isMath: boolean;
  type?: 'equation' | 'formula' | 'arithmetic' | 'latex';
  confidence: number;
}

export function detectMath(text: string): MathDetectionResult {
  if (!text || text.trim().length < 2) {
    return { isMath: false, confidence: 0 };
  }

  const trimmed = text.trim();

  // Check LaTeX notation: \frac, \sum, \int, \sqrt, \alpha, \beta, etc.
  if (/\\[a-zA-Z]+|\$[^$]+\$|\\[(\[][\s\S]*?\\[)\]]/.test(trimmed)) {
    return { isMath: true, type: 'latex', confidence: 0.95 };
  }

  // Check common mathematical equations: e = mc^2, a^2 + b^2 = c^2, f(x) = ..., y = mx + b
  const equationPattern = /^[a-zA-Z0-9_\s\(\)]+\s*=\s*[a-zA-Z0-9_\s\+\-\*\/\^\(\)\.√∑∫π]+$/;
  if (equationPattern.test(trimmed) && /[+\-*/\^=√∑∫π]/.test(trimmed)) {
    return { isMath: true, type: 'equation', confidence: 0.85 };
  }

  // Check formulas / arithmetic expressions: (12 * 45) + 3.14, sin(x) + cos(y)
  const functionSymbols = /\b(sin|cos|tan|log|ln|lim|exp|det|sqrt|sum|integral)\s*\(/i;
  
  if (functionSymbols.test(trimmed)) {
    return { isMath: true, type: 'formula', confidence: 0.85 };
  }

  // Count mathematical symbols vs letters
  const symbolMatches = trimmed.match(/[+\-*/=^√≤≥≠≈±÷×]/g) || [];
  const digitMatches = trimmed.match(/\d+/g) || [];
  
  if (symbolMatches.length >= 2 && digitMatches.length >= 2) {
    return { isMath: true, type: 'arithmetic', confidence: 0.75 };
  }

  return { isMath: false, confidence: 0 };
}
