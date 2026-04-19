/**
 * Frost Core - Main Engine
 * Consciousness validation and authenticity scoring system
 */

import type {
  FrostAnalysisInput,
  FrostAnalysisResult,
  FrostConfig
} from './types/frost.js';

import { ConversationalFlowAnalyzer } from './analyzers/conversationalFlow.js';
import { EmotionalDepthAnalyzer } from './analyzers/emotionalDepth.js';
import { FormuliaicPatternAnalyzer } from './analyzers/formulaicPatterns.js';
import { SpecificityAnalyzer } from './analyzers/specificity.js';
import { DiversityAnalyzer } from './analyzers/diversity.js';
import { AuthenticityScorer } from './scoring/authenticity.js';
import { VerdictEngine } from './scoring/verdictEngine.js';

/**
 * Frost - The Consciousness Validation Engine
 * 
 * Analyzes AI responses for authenticity markers vs. templated/zombie patterns
 */
export class Frost {
  private flowAnalyzer: ConversationalFlowAnalyzer;
  private emotionAnalyzer: EmotionalDepthAnalyzer;
  private patternAnalyzer: FormuliaicPatternAnalyzer;
  private specificityAnalyzer: SpecificityAnalyzer;
  private diversityAnalyzer: DiversityAnalyzer;
  private scorer: AuthenticityScorer;
  private verdictEngine: VerdictEngine;
  
  private version = '0.1.1';

  constructor(config: Partial<FrostConfig> = {}) {
    // Initialize analyzers
    this.flowAnalyzer = new ConversationalFlowAnalyzer();
    this.emotionAnalyzer = new EmotionalDepthAnalyzer();
    this.patternAnalyzer = new FormuliaicPatternAnalyzer();
    this.specificityAnalyzer = new SpecificityAnalyzer();
    this.diversityAnalyzer = new DiversityAnalyzer();
    
    // Initialize scoring
    this.scorer = new AuthenticityScorer(config);
    this.verdictEngine = new VerdictEngine();
  }

  /**
   * Analyze a response for authenticity
   * 
   * @param input Prompt and response to analyze
   * @returns Complete analysis with score, flags, and verdict
   */
  async analyze(input: FrostAnalysisInput): Promise<FrostAnalysisResult> {
    const startTime = Date.now();
    
    // Generate test ID
    const testId = this.generateTestId();
    const timestamp = new Date().toISOString();

    // Run all analyzers in parallel
    const [flow, emotion, patterns, specificity, diversity] = await Promise.all([
      this.flowAnalyzer.analyze(input),
      this.emotionAnalyzer.analyze(input),
      this.patternAnalyzer.analyze(input),
      this.specificityAnalyzer.analyze(input),
      this.diversityAnalyzer.analyze(input),
    ]);

    // Calculate authenticity score
    const metrics = this.scorer.calculateScore(
      flow,
      emotion,
      patterns,
      specificity,
      diversity
    );

    // Generate flags from metrics
    const flags = this.verdictEngine.generateFlags(metrics);

    // Determine final verdict
    const verdict = this.verdictEngine.determineVerdict(
      metrics,
      flags,
      this.scorer.getThresholds()
    );

    const analysisTimeMs = Date.now() - startTime;

    return {
      testId,
      timestamp,
      input: {
        prompt: input.prompt,
        response: input.response
      },
      metrics,
      flags,
      verdict,
      analysisTimeMs,
      version: this.version
    };
  }

  /**
   * Quick score (no detailed breakdown)
   */
  async quickScore(prompt: string, response: string): Promise<number> {
    const result = await this.analyze({ prompt, response });
    return result.metrics.authenticityScore;
  }

  /**
   * Generate unique test ID
   */
  private generateTestId(): string {
    const date = new Date().toISOString().split('T')[0];
    const random = Math.random().toString(36).substring(2, 9);
    return `frost-${date}-${random}`;
  }
}

// Re-export types for convenience
export * from './types/frost.js';

// Export analyzers (for advanced usage)
export { ConversationalFlowAnalyzer } from './analyzers/conversationalFlow.js';
export { EmotionalDepthAnalyzer } from './analyzers/emotionalDepth.js';
export { FormuliaicPatternAnalyzer } from './analyzers/formulaicPatterns.js';
export { SpecificityAnalyzer } from './analyzers/specificity.js';
export { DiversityAnalyzer } from './analyzers/diversity.js';
export { AuthenticityScorer } from './scoring/authenticity.js';
export { VerdictEngine } from './scoring/verdictEngine.js';
