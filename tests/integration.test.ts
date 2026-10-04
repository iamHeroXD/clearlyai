import { describe, it, expect, beforeEach } from 'vitest';
import { processExplanationRequest } from '../src/services/aiService';
import { ExtensionSettings, DEFAULT_SETTINGS } from '../src/types/settings';
import { cacheService } from '../src/services/cache';

describe('AI Service Integration & Auto-Detection', () => {
  let mockSettings: ExtensionSettings;

  beforeEach(() => {
    cacheService.clear();
    mockSettings = {
      ...DEFAULT_SETTINGS,
      activeProvider: 'mock',
      historyEnabled: false, // don't write to storage in unit test runner
      cacheEnabled: true,
    };
  });

  it('should process a standard explanation request using MockProvider', async () => {
    const result = await processExplanationRequest(
      {
        text: 'Quantum decoherence is the loss of quantum coherence.',
        mode: 'simple'
      },
      mockSettings
    );

    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it('should reject request when extension is disabled', async () => {
    mockSettings.enabled = false;

    await expect(
      processExplanationRequest(
        {
          text: 'Some random text',
          mode: 'simple'
        },
        mockSettings
      )
    ).rejects.toThrow('Clearly is currently paused');
  });

  it('should auto-detect code snippets and route to code lens', async () => {
    mockSettings.autoDetectCode = true;
    const codeSnippet = 'function calculateTotal(items: Item[]) { return items.reduce((a, b) => a + b.price, 0); }';

    const result = await processExplanationRequest(
      {
        text: codeSnippet,
        mode: 'explain' // generic mode that allows auto-detect
      },
      mockSettings
    );

    expect(result.mode).toBe('code');
    expect(result.codeBreakdown).toBeDefined();
    expect(result.codeBreakdown?.whatItDoes).toBeDefined();
  });

  it('should auto-detect single/double words and route to define lens', async () => {
    const singleWord = 'ephemeral';

    const result = await processExplanationRequest(
      {
        text: singleWord,
        mode: 'simple'
      },
      mockSettings
    );

    expect(result.mode).toBe('define');
  });

  it('should route to ELI5 lens when learningMode is enabled', async () => {
    mockSettings.learningMode = true;

    const result = await processExplanationRequest(
      {
        text: 'The Federal Reserve adjusts benchmark interest rates to manage inflation.',
        mode: 'simple'
      },
      mockSettings
    );

    expect(result.mode).toBe('eli5');
    expect(result.summary).toContain('explained simply');
  });

  it('should cache results and return identical object on repeat request', async () => {
    const req = {
      text: 'Mitochondria produce cellular adenosine triphosphate.',
      mode: 'simple' as const
    };

    const first = await processExplanationRequest(req, mockSettings);
    const second = await processExplanationRequest(req, mockSettings);

    expect(first.summary).toBe(second.summary);
    expect(second.cached).toBe(true);
  });

  it('should process grammar rephrase requests', async () => {
    const req = {
      text: 'they was going to the store yesterday',
      mode: 'grammar' as const
    };

    const result = await processExplanationRequest(req, mockSettings);
    expect(result.rewrittenText).toBeDefined();
  });

  it('should process legal contract analysis requests', async () => {
    const req = {
      text: 'All disputes shall be resolved through mandatory individual binding arbitration and class action waiver.',
      mode: 'legal' as const
    };

    const result = await processExplanationRequest(req, mockSettings);
    expect(result.legalFlags).toBeDefined();
    expect(result.legalFlags?.riskLevel).toBe('high');
  });

  it('should auto-detect math formulas and route to math lens', async () => {
    mockSettings.autoDetectMath = true;
    const mathText = '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}';

    const result = await processExplanationRequest(
      {
        text: mathText,
        mode: 'explain'
      },
      mockSettings
    );

    expect(result.mode).toBe('math');
  });

  it('should attach active provider and model metadata to response', async () => {
    const req = {
      text: 'Superconductivity occurs at critical temperatures.',
      mode: 'simple' as const
    };

    const result = await processExplanationRequest(req, mockSettings);
    expect(result.provider).toBe('mock');
    expect(result.model).toBe('mock-engine');
  });

  it('should handle long text cleanly without crashing', async () => {
    const longText = 'Artificial intelligence '.repeat(100);
    const req = {
      text: longText,
      mode: 'simple' as const
    };

    const result = await processExplanationRequest(req, mockSettings);
    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
  });
});
