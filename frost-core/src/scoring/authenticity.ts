/**
 * Authenticity Scorer
 * Combines all analyzer metrics into a single 0-100 authenticity score
 */

import type {
  FrostMetrics,
  ConversationalFlowMetrics,
  EmotionalDepthMetrics,
  FormuliaicPatternMetrics,
  SpecificityMetrics,
  DiversityMetrics,
  FrostConfig
} from '../types/frost.js';

interface InternalConfig {
  weights: Required<NonNullable<FrostConfig['weights']>>;
  thresholds: Required<NonNullable<FrostConfig['thresholds']>>;
  features: Required<NonNullable<FrostConfig['features']>>;
}

export class AuthenticityScorer {
  private config: InternalConfig;

  constructor(config: Partial<FrostConfig> = {}) {
    // Default weights (can be tuned)
    this.config = {
      weights: {
        conversationalFlow: 0.20,      // 20% - Natural rhythm matters
        emotionalDepth: 0.25,          // 25% - Emotions are key to authenticity
        formulaicPatterns: 0.25,       // 25% - Biggest zombie tell (inverted)
        specificityScore: 0.15,        // 15% - Details matter
        diversityScore: 0.15,          // 15% - Lexical variety
        ...config.weights
      },
      thresholds: {
        authentic: 70,      // >= 70 = AUTHENTIC
        suspicious: 50,     // < 50 = SUSPICIOUS
        zombie: 30,         // < 30 = ZOMBIE
        ...config.thresholds
      },
      features: {
        detailedMetrics: true,
        contextAnalysis: false,
        patternLearning: false,
        ...config.features
      }
    };
  }

  /**
   * Calculate overall authenticity score from all sub-metrics
   */
  calculateScore(
    flow: ConversationalFlowMetrics,
    emotion: EmotionalDepthMetrics,
    patterns: FormuliaicPatternMetrics,
    specificity: SpecificityMetrics,
    diversity: DiversityMetrics
  ): FrostMetrics {
    const weights = this.config.weights;

    // Aggregate sub-scores (0-1 range)
    const flowScore = this.aggregateFlow(flow);
    const emotionScore = this.aggregateEmotion(emotion);
    const patternScore = this.aggregatePatterns(patterns); // Lower is better, inverted
    const specificityScore = this.aggregateSpecificity(specificity);
    const diversityScore = this.aggregateDiversity(diversity);

    // Weighted authenticity score (0-1)
    const weightedScore =
      (flowScore * weights.conversationalFlow!) +
      (emotionScore * weights.emotionalDepth!) +
      (patternScore * weights.formulaicPatterns!) +
      (specificityScore * weights.specificityScore!) +
      (diversityScore * weights.diversityScore!);

    // Scale to 0-100
    const authenticityScore = Math.round(weightedScore * 100);

    return {
      authenticityScore,
      conversationalFlow: flowScore,
      emotionalDepth: emotionScore,
      formulaicPatterns: 1 - patternScore, // Report the raw (higher = more patterns)
      specificityScore,
      diversityScore,
      detailed: this.config.features.detailedMetrics ? {
        flow,
        emotion,
        patterns,
        specificity,
        diversity
      } : undefined
    };
  }

  /**
   * Aggregate conversational flow sub-metrics
   */
  private aggregateFlow(metrics: ConversationalFlowMetrics): number {
    const { rhythmScore, transitionQuality, coherenceScore } = metrics;
    
    // All equally important for flow
    return (rhythmScore + transitionQuality + coherenceScore) / 3;
  }

  /**
   * Aggregate emotional depth sub-metrics
   */
  private aggregateEmotion(metrics: EmotionalDepthMetrics): number {
    const { sentimentVariance, introspectionLevel, vulnerabilityScore } = metrics;
    
    // Weight vulnerability higher (authenticity marker)
    return (
      sentimentVariance * 0.3 +
      introspectionLevel * 0.3 +
      vulnerabilityScore * 0.4
    );
  }

  /**
   * Aggregate formulaic pattern metrics
   * INVERTED: Lower patterns = higher score (better)
   */
  private aggregatePatterns(metrics: FormuliaicPatternMetrics): number {
    const { templatePhraseCount, repetitionScore, clichéDensity } = metrics;
    
    // Normalize template count (0-1, assuming 5+ is very bad)
    const templateScore = Math.max(0, 1 - (templatePhraseCount / 5));
    
    // Combine (all are "badness" metrics, so we invert)
    const badnessScore = (
      templateScore * 0.4 +
      (1 - repetitionScore) * 0.3 +
      (1 - clichéDensity) * 0.3
    );
    
    return badnessScore; // Higher = less formulaic = better
  }

  /**
   * Aggregate specificity metrics
   */
  private aggregateSpecificity(metrics: SpecificityMetrics): number {
    const { detailDensity, exampleCount, vagueLanguageRatio } = metrics;
    
    // Normalize example count (0-1, assuming 3+ is excellent)
    const exampleScore = Math.min(1, exampleCount / 3);
    
    // Combine (vague language is bad, so invert it)
    return (
      detailDensity * 0.4 +
      exampleScore * 0.3 +
      (1 - vagueLanguageRatio) * 0.3
    );
  }

  /**
   * Aggregate diversity metrics
   */
  private aggregateDiversity(metrics: DiversityMetrics): number {
    const { lexicalDiversity, syntaxVariety, vocabularyRichness } = metrics;
    
    // All equally important
    return (lexicalDiversity + syntaxVariety + vocabularyRichness) / 3;
  }

  /**
   * Get thresholds for verdict engine
   */
  getThresholds(): { authentic: number; suspicious: number; zombie: number } {
    return this.config.thresholds;
  }
}
