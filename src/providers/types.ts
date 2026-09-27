import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';

export interface AIProvider {
  id: string;
  name: string;
  explain(
    request: ExplanationRequest,
    config: ProviderConfig,
    defaultLanguage: string,
    customSystemPrompt?: string
  ): Promise<StructuredExplanation>;
}

export function parseJsonOutput(rawResponse: string, fallbackMode: string): StructuredExplanation {
  try {
    // Strip markdown fences ```json ... ``` if present
    let text = rawResponse.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/i, '').replace(/\s*```$/, '');
    }
    
    // Find json substring if there's leading/trailing noise
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      text = text.slice(startIdx, endIdx + 1);
    }

    const parsedRaw = JSON.parse(text);
    if (!parsedRaw || typeof parsedRaw !== 'object' || Array.isArray(parsedRaw)) {
      throw new Error('AI output was not a JSON object');
    }
    const parsed = parsedRaw as Record<string, any>;

    // Intelligently extract rewritten text across variations in keys
    const rawMode = parsed.mode || fallbackMode;
    const mode = rawMode as any;
    const isWritingMode = ['grammar', 'professional', 'polish', 'rephrase', 'concise', 'expand'].includes(mode);
    
    let rewrittenText = typeof parsed.rewrittenText === 'string' ? parsed.rewrittenText :
      typeof parsed.rewritten_text === 'string' ? parsed.rewritten_text :
      typeof parsed.polishedText === 'string' ? parsed.polishedText :
      typeof parsed.rewrite === 'string' ? parsed.rewrite :
      typeof parsed.rewritten === 'string' ? parsed.rewritten : undefined;

    if (!rewrittenText && isWritingMode) {
      const candidate = parsed.summary || parsed.result || parsed.text || parsed.simplifiedText;
      if (typeof candidate === 'string') {
        rewrittenText = candidate;
      }
    }

    // Clean summary so it never displays raw JSON strings
    let summary: string = typeof parsed.summary === 'string' ? parsed.summary : '';
    if (!summary || (summary.trim().startsWith('{') && summary.trim().endsWith('}'))) {
      summary = rewrittenText ||
        (typeof parsed.simplifiedText === 'string' ? parsed.simplifiedText : '') ||
        (typeof parsed.translatedText === 'string' ? parsed.translatedText : '') ||
        (Array.isArray(parsed.tldrPoints) ? parsed.tldrPoints.filter((p: any) => typeof p === 'string').join(' • ') : '') ||
        'Processed text successfully.';
    }

    // Runtime type-validated fields
    const title = typeof parsed.title === 'string' ? parsed.title : undefined;
    const example = typeof parsed.example === 'string' ? parsed.example : undefined;
    const whyItMatters = typeof parsed.whyItMatters === 'string' ? parsed.whyItMatters : undefined;
    const simplifiedText = typeof parsed.simplifiedText === 'string' ? parsed.simplifiedText : undefined;
    const translatedText = typeof parsed.translatedText === 'string' ? parsed.translatedText : undefined;
    const phoneticSpelling = typeof parsed.phoneticSpelling === 'string' ? parsed.phoneticSpelling :
      typeof parsed.phonetic === 'string' ? parsed.phonetic : undefined;

    const tldrPoints = Array.isArray(parsed.tldrPoints)
      ? parsed.tldrPoints.filter((pt: any) => typeof pt === 'string')
      : Array.isArray(parsed.points)
      ? parsed.points.filter((pt: any) => typeof pt === 'string')
      : undefined;

    let legalFlags = undefined;
    if (parsed.legalFlags && typeof parsed.legalFlags === 'object') {
      legalFlags = {
        riskLevel: ['low', 'medium', 'high'].includes(parsed.legalFlags.riskLevel) ? parsed.legalFlags.riskLevel : 'medium',
        flags: Array.isArray(parsed.legalFlags.flags) ? parsed.legalFlags.flags.filter((f: any) => typeof f === 'string') : [],
        summary: typeof parsed.legalFlags.summary === 'string' ? parsed.legalFlags.summary : '',
      };
    } else if (parsed.riskLevel) {
      legalFlags = {
        riskLevel: ['low', 'medium', 'high'].includes(parsed.riskLevel) ? parsed.riskLevel : 'medium',
        flags: Array.isArray(parsed.flags) ? parsed.flags.filter((f: any) => typeof f === 'string') : [],
        summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      };
    }

    const codeBreakdown = (parsed.codeBreakdown && typeof parsed.codeBreakdown === 'object') ? {
      language: typeof parsed.codeBreakdown.language === 'string' ? parsed.codeBreakdown.language : undefined,
      whatItDoes: typeof parsed.codeBreakdown.whatItDoes === 'string' ? parsed.codeBreakdown.whatItDoes : 'Code execution breakdown.',
      keyParts: Array.isArray(parsed.codeBreakdown.keyParts) ? parsed.codeBreakdown.keyParts.filter((k: any) => typeof k === 'string') : [],
      potentialIssues: typeof parsed.codeBreakdown.potentialIssues === 'string' ? parsed.codeBreakdown.potentialIssues : undefined,
    } : undefined;

    const mathBreakdown = (parsed.mathBreakdown && typeof parsed.mathBreakdown === 'object') ? {
      concept: typeof parsed.mathBreakdown.concept === 'string' ? parsed.mathBreakdown.concept : 'Mathematical concept',
      whatItMeans: typeof parsed.mathBreakdown.whatItMeans === 'string' ? parsed.mathBreakdown.whatItMeans : '',
      steps: Array.isArray(parsed.mathBreakdown.steps) ? parsed.mathBreakdown.steps.filter((s: any) => typeof s === 'string') : [],
    } : undefined;

    const defineBreakdown = (parsed.defineBreakdown && typeof parsed.defineBreakdown === 'object') ? {
      word: typeof parsed.defineBreakdown.word === 'string' ? parsed.defineBreakdown.word : (title || ''),
      partOfSpeech: typeof parsed.defineBreakdown.partOfSpeech === 'string' ? parsed.defineBreakdown.partOfSpeech : undefined,
      definition: typeof parsed.defineBreakdown.definition === 'string' ? parsed.defineBreakdown.definition : summary,
      example: typeof parsed.defineBreakdown.example === 'string' ? parsed.defineBreakdown.example : (example || ''),
      phonetic: typeof parsed.defineBreakdown.phonetic === 'string' ? parsed.defineBreakdown.phonetic : phoneticSpelling,
      similarWords: Array.isArray(parsed.defineBreakdown.similarWords) ? parsed.defineBreakdown.similarWords.filter((w: any) => typeof w === 'string') : [],
    } : undefined;

    return {
      mode,
      title,
      summary,
      example,
      whyItMatters,
      simplifiedText,
      translatedText,
      rewrittenText,
      phoneticSpelling,
      tldrPoints,
      legalFlags,
      codeBreakdown,
      mathBreakdown,
      defineBreakdown,
      learningQuiz: parsed.learningQuiz,
      rawText: rawResponse,
    };
  } catch (err) {
    // If JSON parsing fails, provide a graceful structured fallback
    const isWritingMode = ['polish', 'rephrase', 'concise', 'expand'].includes(fallbackMode);
    let cleanFallback = rawResponse.replace(/^(here is the polished text|polished:|rewrite:|here is the rewrite:)\s*/i, '').trim();

    // Check if rawResponse is an escaped JSON string
    if (cleanFallback.startsWith('{') && cleanFallback.endsWith('}')) {
      try {
        const inner = JSON.parse(cleanFallback);
        if (inner.rewrittenText || inner.summary) {
          return parseJsonOutput(cleanFallback, fallbackMode);
        }
      } catch {}
    }

    return {
      mode: fallbackMode as any,
      summary: cleanFallback,
      rewrittenText: isWritingMode ? cleanFallback : undefined,
      rawText: rawResponse,
    };
  }
}
