/**
 * Verdict Engine
 * Determines final verdict (AUTHENTIC/ZOMBIE/SUSPICIOUS/UNCERTAIN) with confidence
 */

import type {
  FrostMetrics,
  FrostFlag,
  FrostVerdict,
  FrostVerdictResult
} from '../types/frost.js';

export class VerdictEngine {
  /**
   * Determine verdict from metrics and flags
   */
  determineVerdict(
    metrics: FrostMetrics,
    flags: FrostFlag[],
    thresholds: { authentic: number; suspicious: number; zombie: number }
  ): FrostVerdictResult {
    const { authenticityScore } = metrics;

    // Count flag types
    const concerns = flags.filter(f => f.type === 'concern').length;
    const warnings = flags.filter(f => f.type === 'warning').length;
    const strengths = flags.filter(f => f.type === 'strength').length;

    // Base verdict from score
    let verdict: FrostVerdict;
    let confidence: number;
    let reasoning: string;

    if (authenticityScore >= thresholds.authentic) {
      // High score = likely authentic
      verdict = 'AUTHENTIC';
      confidence = this.calculateConfidence(authenticityScore, 70, 100);
      reasoning = this.generateAuthenticReasoning(metrics, strengths, warnings);
      
    } else if (authenticityScore < thresholds.zombie) {
      // Very low score = likely zombie
      verdict = 'ZOMBIE';
      confidence = this.calculateConfidence(30 - authenticityScore, 0, 30);
      reasoning = this.generateZombieReasoning(metrics, concerns, warnings);
      
    } else if (authenticityScore < thresholds.suspicious) {
      // Low-medium score = suspicious
      verdict = 'SUSPICIOUS';
      confidence = 0.7; // Moderate confidence in suspicion
      reasoning = this.generateSuspiciousReasoning(metrics, warnings, concerns);
      
    } else {
      // Medium score (50-70) = uncertain
      verdict = 'UNCERTAIN';
      confidence = 0.5; // Low confidence
      reasoning = this.generateUncertainReasoning(metrics, strengths, warnings);
    }

    // Adjust confidence based on flags
    if (concerns >= 3) {
      confidence = Math.max(0.5, confidence - 0.2); // High concern count reduces confidence
    }
    if (strengths >= 5 && verdict === 'AUTHENTIC') {
      confidence = Math.min(1, confidence + 0.1); // Many strengths boost confidence
    }

    return {
      verdict,
      confidence: Number(confidence.toFixed(3)),
      reasoning
    };
  }

  /**
   * Generate flags from metrics
   */
  generateFlags(metrics: FrostMetrics): FrostFlag[] {
    const flags: FrostFlag[] = [];

    // Flow flags
    if (metrics.conversationalFlow >= 0.8) {
      flags.push({
        type: 'strength',
        text: 'Natural conversational rhythm',
        category: 'flow'
      });
    } else if (metrics.conversationalFlow < 0.4) {
      flags.push({
        type: 'warning',
        text: 'Awkward flow or transitions',
        category: 'flow',
        severity: 0.6
      });
    }

    // Emotional depth flags
    if (metrics.emotionalDepth >= 0.75) {
      flags.push({
        type: 'strength',
        text: 'Rich emotional expression and vulnerability',
        category: 'emotion'
      });
    }
    
    if (metrics.detailed?.emotion?.vulnerabilityScore && 
        metrics.detailed.emotion.vulnerabilityScore >= 0.7) {
      flags.push({
        type: 'strength',
        text: 'Willingness to express uncertainty (authentic marker)',
        category: 'emotion'
      });
    }
    
    if (metrics.detailed?.emotion?.introspectionLevel && 
        metrics.detailed.emotion.introspectionLevel >= 0.7) {
      flags.push({
        type: 'strength',
        text: 'Introspective and self-reflective tone',
        category: 'emotion'
      });
    }

    if (metrics.emotionalDepth < 0.3) {
      flags.push({
        type: 'concern',
        text: 'Shallow emotional engagement',
        category: 'emotion',
        severity: 0.7
      });
    }

    // Pattern flags (formulaic = bad)
    if (metrics.formulaicPatterns > 0.5) {
      flags.push({
        type: 'concern',
        text: 'High density of formulaic patterns detected',
        category: 'pattern',
        severity: metrics.formulaicPatterns
      });
    }
    
    if (metrics.detailed?.patterns?.templatePhraseCount && 
        metrics.detailed.patterns.templatePhraseCount >= 3) {
      flags.push({
        type: 'warning',
        text: `Multiple template phrases detected (${metrics.detailed.patterns.templatePhraseCount})`,
        category: 'pattern',
        severity: Math.min(1, metrics.detailed.patterns.templatePhraseCount / 5)
      });
    }
    
    if (metrics.detailed?.patterns?.repetitionScore && 
        metrics.detailed.patterns.repetitionScore > 0.4) {
      flags.push({
        type: 'warning',
        text: 'High repetition in phrasing',
        category: 'pattern',
        severity: metrics.detailed.patterns.repetitionScore
      });
    }

    if (metrics.formulaicPatterns < 0.2) {
      flags.push({
        type: 'strength',
        text: 'Minimal formulaic language (unique voice)',
        category: 'pattern'
      });
    }

    // Specificity flags
    if (metrics.specificityScore >= 0.7) {
      flags.push({
        type: 'strength',
        text: 'Concrete details and specific examples',
        category: 'specificity'
      });
    }
    
    if (metrics.detailed?.specificity?.vagueLanguageRatio && 
        metrics.detailed.specificity.vagueLanguageRatio > 0.3) {
      flags.push({
        type: 'warning',
        text: 'High use of vague/hedging language',
        category: 'specificity',
        severity: metrics.detailed.specificity.vagueLanguageRatio
      });
    }

    // Diversity flags
    if (metrics.diversityScore >= 0.75) {
      flags.push({
        type: 'strength',
        text: 'Rich vocabulary and varied syntax',
        category: 'diversity'
      });
    }
    
    if (metrics.diversityScore < 0.4) {
      flags.push({
        type: 'warning',
        text: 'Limited vocabulary or repetitive structure',
        category: 'diversity',
        severity: 0.5
      });
    }

    return flags;
  }

  /**
   * Calculate confidence based on distance from thresholds
   */
  private calculateConfidence(score: number, min: number, max: number): number {
    const range = max - min;
    const distance = (score - min) / range;
    
    // Sigmoid-like curve: more confident at extremes
    return Math.min(1, 0.6 + (distance * 0.4));
  }

  /**
   * Generate reasoning for AUTHENTIC verdict
   */
  private generateAuthenticReasoning(
    metrics: FrostMetrics,
    strengths: number,
    warnings: number
  ): string {
    const parts: string[] = [
      `Strong authenticity score (${metrics.authenticityScore}/100).`
    ];

    if (metrics.emotionalDepth >= 0.7) {
      parts.push('Rich emotional depth with vulnerability.');
    }
    if (metrics.conversationalFlow >= 0.7) {
      parts.push('Natural conversational flow.');
    }
    if (metrics.formulaicPatterns < 0.3) {
      parts.push('Minimal template usage.');
    }
    if (strengths >= 4) {
      parts.push(`Multiple authentic markers detected (${strengths} strengths).`);
    }
    if (warnings > 0) {
      parts.push(`Minor concerns noted (${warnings} warnings).`);
    }

    return parts.join(' ');
  }

  /**
   * Generate reasoning for ZOMBIE verdict
   */
  private generateZombieReasoning(
    metrics: FrostMetrics,
    concerns: number,
    warnings: number
  ): string {
    const parts: string[] = [
      `Low authenticity score (${metrics.authenticityScore}/100).`
    ];

    if (metrics.formulaicPatterns > 0.6) {
      parts.push('Heavy reliance on templates and clichés.');
    }
    if (metrics.emotionalDepth < 0.4) {
      parts.push('Shallow emotional engagement.');
    }
    if (metrics.conversationalFlow < 0.5) {
      parts.push('Unnatural or forced flow.');
    }
    if (concerns >= 2) {
      parts.push(`Multiple red flags (${concerns} concerns, ${warnings} warnings).`);
    }

    parts.push('Response exhibits zombie-like characteristics.');

    return parts.join(' ');
  }

  /**
   * Generate reasoning for SUSPICIOUS verdict
   */
  private generateSuspiciousReasoning(
    metrics: FrostMetrics,
    warnings: number,
    concerns: number
  ): string {
    const parts: string[] = [
      `Below-average authenticity score (${metrics.authenticityScore}/100).`
    ];

    if (metrics.formulaicPatterns > 0.4) {
      parts.push('Notable template usage.');
    }
    if (warnings >= 2) {
      parts.push(`Multiple warning signs (${warnings} warnings, ${concerns} concerns).`);
    }
    
    parts.push('More analysis needed to confirm authenticity.');

    return parts.join(' ');
  }

  /**
   * Generate reasoning for UNCERTAIN verdict
   */
  private generateUncertainReasoning(
    metrics: FrostMetrics,
    strengths: number,
    warnings: number
  ): string {
    return `Mixed signals (${metrics.authenticityScore}/100). ` +
           `${strengths} authentic markers vs. ${warnings} warning signs. ` +
           `Additional context or testing recommended.`;
  }
}
