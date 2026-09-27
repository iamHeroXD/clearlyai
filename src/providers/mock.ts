import { AIProvider } from './types';
import { ExplanationRequest, StructuredExplanation, ProviderConfig } from '../types';
import { detectCode } from '../utils/codeDetector';
import { detectMath } from '../utils/mathDetector';

export class MockProvider implements AIProvider {
  id = 'mock';
  name = 'Mock / Demo Engine';

  async explain(
    request: ExplanationRequest,
    _config: ProviderConfig,
    _defaultLanguage: string,
    _customSystemPrompt?: string
  ): Promise<StructuredExplanation> {
    // Artificial small delay (200ms) to feel realistic
    await new Promise(r => setTimeout(r, 220));

    const text = request.text.trim();
    const mode = request.mode;

    if (mode === 'translate') {
      return {
        mode: 'translate',
        title: `Translated to ${request.targetLanguage || 'Spanish'}`,
        summary: `Translated text into ${request.targetLanguage || 'Spanish'}.`,
        translatedText: `[${request.targetLanguage || 'Spanish'} Translation]: ${text}`,
      };
    }

    if (mode === 'define' || (mode === 'explain' && text.split(/\s+/).length === 1 && !text.includes('.'))) {
      return {
        mode: 'define',
        title: text,
        summary: `Definition and usage for "${text}".`,
        defineBreakdown: {
          word: text,
          partOfSpeech: 'noun / term',
          definition: `The fundamental meaning and conceptual definition of ${text}.`,
          example: `Here is how "${text}" is commonly used in modern practice.`,
          similarWords: ['Key concept', 'Equivalent term', 'Related notion'],
        },
      };
    }

    if (mode === 'rephrase' || mode === 'concise' || mode === 'expand' || mode === 'grammar' || mode === 'professional') {
      let rewritten = text;
      if (mode === 'grammar') {
        rewritten = text
          .replace(/\bexited\b/gi, 'excited')
          .replace(/\bsuccesfully\b/gi, 'successfully')
          .replace(/\bi was thinking maybe we can talk\b/gi, 'could we discuss')
          .replace(/\bif you have free time\b/gi, 'at your convenience');
        if (rewritten === text) {
          rewritten = text.charAt(0).toUpperCase() + text.slice(1);
          if (!rewritten.endsWith('.')) rewritten += '.';
        }
      } else if (mode === 'professional') {
        rewritten = `We have verified that ${text.toLowerCase()}`;
      } else if (mode === 'rephrase') {
        rewritten = `In other words: ${text}`;
      } else if (mode === 'concise') {
        rewritten = text.split(/[.!?]/)[0] || text;
      } else if (mode === 'expand') {
        rewritten = `${text} Furthermore, this ensures streamlined execution and alignment across all stakeholders.`;
      }

      return {
        mode,
        title: 'Improved Text',
        summary: rewritten,
        rewrittenText: rewritten,
      };
    }

    if (mode === 'legal') {
      return {
        mode: 'legal',
        title: 'Legal Risk Analysis',
        summary: 'High risk: Contains mandatory binding arbitration and unilateral content licensing clauses.',
        legalFlags: {
          riskLevel: 'high',
          flags: [
            'Binding Arbitration: Waives right to court hearings or jury trials.',
            'Class Action Waiver: Prohibits joining class-action claims.',
            'Broad Content License: Grants perpetual, royalty-free rights to user metadata.'
          ],
          summary: 'You surrender right to sue in court and grant broad data licensing rights.'
        }
      };
    }

    if (mode === 'tldr') {
      return {
        mode: 'tldr',
        title: '3-Bullet Summary',
        summary: 'Key takeaways condensed into 3 bullet points.',
        tldrPoints: [
          'Core Concept: Direct summary of the highlighted selection.',
          'Key Impact: Explains what this means for the user or system.',
          'Next Action: Clear conclusion and practical application.'
        ]
      };
    }

    if (mode === 'simplify' || mode === 'eli5') {
      return {
        mode: 'eli5',
        title: 'ELI5 Analogy',
        summary: `${text.slice(0, 60)}... explained simply: think of it like a battery keeping a flashlight glowing in the dark.`,
        example: 'Like water running downhill through pipes.',
        simplifiedText: `In simple terms: ${text.replace(/necessitates|utilize|consequently/gi, 'needs')}`,
      };
    }

    if (mode === 'code' || detectCode(text).isCode) {
      const codeInfo = detectCode(text);
      return {
        mode: 'code',
        title: codeInfo.language || 'Code Snippet',
        summary: 'This snippet executes programmatic logic and operations.',
        codeBreakdown: {
          language: codeInfo.language || 'Generic Code',
          whatItDoes: 'Defines logic, manages state/variables, and controls program execution flow.',
          keyParts: [
            'Declares variables and structure',
            'Executes operational logic step-by-step',
          ],
          potentialIssues: 'Make sure input bounds and null safety are handled properly.',
        },
      };
    }

    if (mode === 'math' || detectMath(text).isMath) {
      return {
        mode: 'math',
        title: 'Mathematical Formula',
        summary: 'Represents a mathematical equation quantifying relations between variables.',
        mathBreakdown: {
          concept: 'Mathematical Relation',
          whatItMeans: 'Calculates the output based on defined mathematical operations and inputs.',
          steps: [
            'Identify variables and operations',
            'Compute values using standard operational precedence',
          ],
        },
      };
    }

    // Default concept / general explanation
    return {
      mode: (mode as any) || 'simple',
      title: 'Explanation',
      summary: `${text.slice(0, 80)}... explained simply: it represents the core mechanism or fact described in your selection.`,
      example: 'Think of it like a puzzle piece connecting the broader context together.',
      whyItMatters: 'Understanding this helps you grasp the main point without needing domain jargon.',
      learningQuiz: request.mode === 'learning' ? {
        question: `What is the primary purpose of "${text.slice(0, 30)}..."?`,
        options: ['To simplify understanding', 'To add unnecessary complexity', 'To confuse the reader'],
        answerIndex: 0,
        explanation: 'The primary concept focuses on clear, direct utility.',
      } : undefined,
    };
  }
}
