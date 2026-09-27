export interface CodeDetectionResult {
  isCode: boolean;
  language?: string;
  confidence: number;
}

interface LanguageDef {
  lang: string;
  keywords: string[];
  syntaxPatterns: RegExp[];
}

const LANGUAGE_DEFINITIONS: LanguageDef[] = [
  {
    lang: 'Python',
    keywords: ['def', 'class', 'elif', 'print', 'self', 'None', 'True', 'False', 'lambda', 'async def', '__init__', 'yield'],
    syntaxPatterns: [
      /:\s*$/m,
      /\bdef\s+[a-zA-Z0-9_]+\s*\(/,
      /\bif\s+__name__\s*==\s*['"]__main__['"]/,
      /f"[^"]*\{[^}]+\}[^"]*"/,
    ],
  },
  {
    lang: 'SQL',
    keywords: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'GROUP BY', 'ORDER BY', 'CREATE TABLE', 'HAVING'],
    syntaxPatterns: [
      /\bSELECT\b[\s\S]+\bFROM\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bUPDATE\b[\s\S]+\bSET\b/i,
    ],
  },
  {
    lang: 'JavaScript / TypeScript',
    keywords: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'import', 'export', 'interface', 'type', 'console'],
    syntaxPatterns: [
      /=>/,
      /console\.(log|error|warn)/,
      /\bfunction\s+[a-zA-Z0-9_]*\s*\(/,
      /document\.(getElementById|querySelector)/,
    ],
  },
  {
    lang: 'HTML / JSX',
    keywords: ['div', 'span', 'className', 'DOCTYPE', 'html', 'head', 'body'],
    syntaxPatterns: [
      /<[a-zA-Z0-9]+(\s+[a-zA-Z0-9-]+(=['"][^'"]*['"])?)*\s*\/?>/,
      /<\/[a-zA-Z0-9]+>/,
      /<!DOCTYPE\s+html>/i,
    ],
  },
  {
    lang: 'CSS / SCSS',
    keywords: ['display', 'margin', 'padding', 'background', 'color', 'flex', 'grid', 'font-size'],
    syntaxPatterns: [
      /[.#][a-zA-Z0-9_-]+\s*\{[^}]*\}/,
      /@media\s*\(/,
    ],
  },
  {
    lang: 'Bash / Shell',
    keywords: ['npm', 'pnpm', 'yarn', 'git', 'docker', 'kubectl', 'curl', 'wget', 'sudo', 'chmod', 'mkdir', 'grep'],
    syntaxPatterns: [
      /^\s*(npm|pnpm|yarn|git|cd|ls|mkdir|rm|chmod|chown|docker|kubectl|curl|wget|grep|cat|echo)\s+/m,
      /#!/,
    ],
  },
  {
    lang: 'C / C++',
    keywords: ['#include', 'int', 'void', 'char', 'double', 'float', 'struct', 'std::cout', 'std::vector', 'printf', 'malloc'],
    syntaxPatterns: [
      /#include\s*<[^>]+>/,
      /std::[a-zA-Z0-9_]+/,
    ],
  },
  {
    lang: 'JSON',
    keywords: [],
    syntaxPatterns: [
      /^\s*\{[\s\S]*"[a-zA-Z0-9_-]+"\s*:\s*[\s\S]*\}\s*$/,
      /^\s*\[[\s\S]*\{[\s\S]*\}[\s\S]*\]\s*$/,
    ],
  },
];

export function detectCode(text: string): CodeDetectionResult {
  if (!text || text.trim().length < 5) {
    return { isCode: false, confidence: 0 };
  }

  const trimmed = text.trim();

  // General code syntax markers
  let generalScore = 0;
  if (/[{}();=]/.test(trimmed)) generalScore += 0.3;
  if (/(\n\s{2,}|\t)/.test(trimmed)) generalScore += 0.2;
  if (/^[a-zA-Z0-9_]+\([^)]*\)/m.test(trimmed)) generalScore += 0.2;
  if (/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*)/.test(trimmed)) generalScore += 0.2;

  let bestLang: string | undefined = undefined;
  let highestLangScore = 0;

  for (const def of LANGUAGE_DEFINITIONS) {
    let langScore = 0;

    // Check keyword presence
    for (const kw of def.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, def.lang === 'SQL' ? 'i' : '');
      if (regex.test(trimmed)) {
        langScore += 1;
      }
    }

    // Check syntax pattern matches
    for (const pattern of def.syntaxPatterns) {
      if (pattern.test(trimmed)) {
        langScore += 2;
      }
    }

    if (langScore > highestLangScore) {
      highestLangScore = langScore;
      bestLang = def.lang;
    }
  }

  if (highestLangScore >= 2) {
    generalScore += 0.4;
  } else if (highestLangScore === 1) {
    generalScore += 0.2;
  }

  // If text is predominantly SQL keywords or has SQL patterns, mark as SQL code
  if (bestLang === 'SQL' && highestLangScore >= 2) {
    generalScore = Math.max(generalScore, 0.7);
  }

  const isCode = generalScore >= 0.5 || highestLangScore >= 3;

  return {
    isCode,
    language: isCode ? bestLang : undefined,
    confidence: Math.min(1, Math.max(0, generalScore)),
  };
}
