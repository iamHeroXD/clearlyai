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

    const parsed = JSON.parse(text);

    // Intelligently extract rewritten text across variations in keys
    const mode = (parsed.mode || fallbackMode) as any;
    const isWritingMode = ['polish', 'rephrase', 'concise', 'expand'].includes(mode);
    
    let rewrittenText = parsed.rewrittenText || parsed.rewritten_text || parsed.polishedText || parsed.rewrite || parsed.rewritten;
    if (!rewrittenText && isWritingMode) {
      rewrittenText = parsed.summary || parsed.result || parsed.text || parsed.simplifiedText;
    }

    // Clean summary so it never displays raw JSON strings
    let summary = parsed.summary;
    if (!summary || (typeof summary === 'string' && summary.trim().startsWith('{') && summary.trim().endsWith('}'))) {
      summary = rewrittenText || parsed.simplifiedText || parsed.translatedText || (parsed.tldrPoints ? parsed.tldrPoints.join(' • ') : '') || 'Processed text successfully.';
    }

    return {
      mode,
      title: parsed.title,
      summary,
      example: parsed.example,
      whyItMatters: parsed.whyItMatters,
      simplifiedText: parsed.simplifiedText,
      translatedText: parsed.translatedText,
      rewrittenText,
      phoneticSpelling: parsed.phoneticSpelling || parsed.phonetic,
      tldrPoints: Array.isArray(parsed.tldrPoints) ? parsed.tldrPoints : (Array.isArray(parsed.points) ? parsed.points : undefined),
      legalFlags: parsed.legalFlags || (parsed.riskLevel ? { riskLevel: parsed.riskLevel, flags: parsed.flags || [], summary: parsed.summary || '' } : undefined),
      codeBreakdown: parsed.codeBreakdown,
      mathBreakdown: parsed.mathBreakdown,
      defineBreakdown: parsed.defineBreakdown,
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
