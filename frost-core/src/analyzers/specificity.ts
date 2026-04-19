/**
 * Specificity Analyzer
 * Measures detail density, concrete examples, and vague language patterns
 */

import type { FrostAnalysisInput, SpecificityMetrics, FrostAnalyzer } from '../types/frost.js';

export class SpecificityAnalyzer implements FrostAnalyzer<SpecificityMetrics> {
  name = 'specificity';

  // Vague/hedging phrases that reduce specificity
  private readonly VAGUE_PATTERNS = [
    /\b(kind of|sort of|basically|essentially|generally|typically|usually|often)\b/gi,
    /\b(somewhat|rather|quite|fairly|pretty much|more or less)\b/gi,
    /\b(I think|I guess|I suppose|maybe|perhaps|possibly|probably)\b/gi,
    /\b(things?|stuff|something|somehow|someone)\b/gi,
  ];

  // Specific detail indicators (numbers, proper nouns, concrete terms)
  private readonly SPECIFIC_PATTERNS = [
    /\b\d+(\.\d+)?(%|px|ms|km|kg|hours?|minutes?|seconds?|days?|years?)?\b/gi, // Numbers with units
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns (capitalized multi-word)
    /\b(exactly|specifically|precisely|literally|actually|concretely)\b/gi, // Emphasis words
  ];

  // Example indicators
  private readonly EXAMPLE_PATTERNS = [
    /\b(for example|for instance|e\.g\.|such as|like|including)\b/gi,
    /\b(imagine|consider|suppose|say)\b/gi,
  ];

  async analyze(input: FrostAnalysisInput): Promise<SpecificityMetrics> {
    const { response } = input;
    
    const detailDensity = this.calculateDetailDensity(response);
    const exampleCount = this.countExamples(response);
    const vagueLanguageRatio = this.calculateVagueRatio(response);
    
    return {
      detailDensity,
      exampleCount,
      vagueLanguageRatio
    };
  }

  /**
   * Calculate detail density: ratio of specific indicators to total words
   */
  private calculateDetailDensity(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;
    
    // Count specific patterns
    let specificCount = 0;
    
    for (const pattern of this.SPECIFIC_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        specificCount += matches.length;
      }
    }
    
    // Normalize by text length
    const density = Math.min(1, specificCount / (words.length * 0.15)); // Target: 15% specific words
    
    return Number(density.toFixed(3));
  }

  /**
   * Count example indicators in text
   */
  private countExamples(text: string): number {
    let count = 0;
    
    for (const pattern of this.EXAMPLE_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }
    
    return count;
  }

  /**
   * Calculate ratio of vague/hedging language
   * Lower is better (more specific)
   */
  private calculateVagueRatio(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;
    
    let vagueCount = 0;
    
    for (const pattern of this.VAGUE_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        vagueCount += matches.length;
      }
    }
    
    // Normalize: ratio of vague words to total words
    const ratio = vagueCount / words.length;
    
    return Number(ratio.toFixed(3));
  }
}
