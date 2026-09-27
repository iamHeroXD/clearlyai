/**
 * Canonical Lens Definitions for Clearly
 * Single source of truth across Extension, Desktop, Website, Prompts, and Tests.
 */

export type CanonicalLensId =
  | 'simple'
  | 'eli5'
  | 'define'
  | 'grammar'
  | 'professional'
  | 'code'
  | 'math'
  | 'legal'
  | 'tldr'
  | 'translate';

export type ExplanationMode =
  | CanonicalLensId
  | 'explain'     // alias -> simple
  | 'simplify'    // alias -> eli5
  | 'rephrase'    // alias -> professional
  | 'concise'     // alias -> professional
  | 'expand'      // alias -> professional
  | 'learning'    // alias -> eli5
  | 'summarize'   // alias -> tldr
  | 'roast';

export interface LensDefinition {
  id: CanonicalLensId;
  label: string;
  badge: string;
  icon: string;
  tagline: string;
  description: string;
  systemDirective: string;
  outputKey: 'summary' | 'simplifiedText' | 'rewrittenText' | 'translatedText' | 'tldrPoints' | 'defineBreakdown' | 'codeBreakdown' | 'mathBreakdown' | 'legalFlags';
  isWritingMode?: boolean;
}

export const CANONICAL_LENSES: Record<CanonicalLensId, LensDefinition> = {
  simple: {
    id: 'simple',
    label: 'Simple Terms',
    badge: '1-2 Sentences',
    icon: '✨',
    tagline: 'Get straight to the core point in 1-2 sharp sentences.',
    description: 'Strips away verbosity and jargon so you can digest dense information immediately.',
    systemDirective: 'Provide the simplest 1-2 sentence core explanation in plain human language, followed by a concise real-world example.',
    outputKey: 'summary',
  },
  eli5: {
    id: 'eli5',
    label: 'ELI5 Analogy',
    badge: 'Intuitive Metaphor',
    icon: '🐣',
    tagline: 'Intuitive analogies that make abstract concepts stick instantly.',
    description: 'Translates high-dimensional math, quantum mechanics, and complex topics into everyday metaphors.',
    systemDirective: 'Explain this concept as if explaining to a 5-year-old using a vivid everyday analogy or story. No prerequisites required.',
    outputKey: 'summary',
  },
  define: {
    id: 'define',
    label: 'Definition',
    badge: 'Dictionary & IPA',
    icon: '📖',
    tagline: 'Precise lexical definition, phonetic pronunciation, and usage.',
    description: 'Break down words or terms with phonetic IPA guide, part of speech, concise definition, natural usage, and synonyms.',
    systemDirective: 'Provide precise dictionary breakdown with phonetic spelling, part of speech, clear definition, and natural example.',
    outputKey: 'defineBreakdown',
  },
  grammar: {
    id: 'grammar',
    label: 'Grammar & Tone',
    badge: 'Flawless Writing',
    icon: '✍️',
    tagline: 'Fix typos, punctuation, and awkward phrasing in 1 click.',
    description: 'Cleans up grammar and spelling while preserving original intent and natural voice.',
    systemDirective: 'Fix grammatical errors, spelling typos, punctuation, and awkward phrasing. Return the corrected text ready for in-place replacement.',
    outputKey: 'rewrittenText',
    isWritingMode: true,
  },
  professional: {
    id: 'professional',
    label: 'Professional',
    badge: 'Executive Polish',
    icon: '💼',
    tagline: 'Polished, punchy active voice for emails, PRs, and briefs.',
    description: 'Rewrites text with active voice, concise impact, and executive clarity.',
    systemDirective: 'Rewrite the text into professional, crisp, active-voice prose. Eliminate unnecessary passive voice and wordiness.',
    outputKey: 'rewrittenText',
    isWritingMode: true,
  },
  code: {
    id: 'code',
    label: 'Code Analysis',
    badge: 'Developer Logic',
    icon: '💻',
    tagline: 'Inspect code logic, algorithmic complexity, and edge cases.',
    description: 'Detects programming language, explains what the code achieves, pinpoints key mechanisms, and highlights pitfalls.',
    systemDirective: 'Analyze the programming code: detect language, explain what it does concisely, list key parts, and mention potential issues.',
    outputKey: 'codeBreakdown',
  },
  math: {
    id: 'math',
    label: 'Mathematics',
    badge: 'Step-by-Step',
    icon: '📐',
    tagline: 'Decodes equations, notations, and proofs intuitively.',
    description: 'Explains mathematical concepts, notation symbols, and problem-solving steps.',
    systemDirective: 'Explain the mathematical formula, concept, or theorem with step-by-step intuition and clear notation decoding.',
    outputKey: 'mathBreakdown',
  },
  legal: {
    id: 'legal',
    label: 'Contract Risk',
    badge: 'Gotchas & Traps',
    icon: '⚖️',
    tagline: 'Exposes arbitration, data selling, and auto-renewal traps.',
    description: 'Identifies hidden legal liability, mandatory arbitration, class action waivers, and data sharing clauses.',
    systemDirective: 'Scan the legal or terms text for risks: mandatory arbitration, liability waivers, data monetization, unilateral changes. Assess risk level (low/medium/high). Note: informational plain-language summary only, not legal advice.',
    outputKey: 'legalFlags',
  },
  tldr: {
    id: 'tldr',
    label: 'TL;DR Bullets',
    badge: '3 Takeaways',
    icon: '⚡',
    tagline: 'Exactly 3 dense, high-signal takeaway bullet points.',
    description: 'Compresses articles, reports, or threads into 3 structured points: Premise, Evidence/Impact, and Takeaway.',
    systemDirective: 'Provide exactly 3 dense, high-signal bullet points summarizing the text: 1. Core Premise, 2. Supporting Evidence/Data, 3. Direct Implication/Takeaway.',
    outputKey: 'tldrPoints',
  },
  translate: {
    id: 'translate',
    label: 'Translate',
    badge: 'Multilingual',
    icon: '🌐',
    tagline: 'Fluent, culturally accurate translation preserving tone.',
    description: 'Translates into target language without mechanical word-by-word awkwardness.',
    systemDirective: 'Translate the selected text into the target language with natural fluency, cultural nuance, and professional tone.',
    outputKey: 'translatedText',
  },
};

export const CANONICAL_LENS_LIST = Object.values(CANONICAL_LENSES);

export function normalizeLensId(mode: string | undefined): CanonicalLensId {
  if (!mode) return 'simple';
  const clean = mode.toLowerCase().trim();
  switch (clean) {
    case 'explain':
      return 'simple';
    case 'simplify':
    case 'learning':
      return 'eli5';
    case 'rephrase':
    case 'concise':
    case 'expand':
    case 'polish':
      return 'professional';
    case 'summarize':
    case 'keypoints':
      return 'tldr';
    case 'grammar':
      return 'grammar';
    case 'define':
      return 'define';
    case 'code':
      return 'code';
    case 'math':
      return 'math';
    case 'legal':
      return 'legal';
    case 'translate':
      return 'translate';
    default:
      if (clean in CANONICAL_LENSES) {
        return clean as CanonicalLensId;
      }
      return 'simple';
  }
}
