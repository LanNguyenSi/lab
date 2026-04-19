/**
 * Formulaic Pattern Analyzer
 * Detects template phrases, repetition, and clichéd language
 */

import type { FrostAnalysisInput, FormuliaicPatternMetrics, FrostAnalyzer } from '../types/frost.js';

export class FormuliaicPatternAnalyzer implements FrostAnalyzer<FormuliaicPatternMetrics> {
  name = 'formulaicPatterns';

  // Common AI template phrases (the "tells")
  private readonly TEMPLATE_PHRASES = [
    // Corporate AI speak
    /\b(I'd be happy to|I'd be glad to|I'm here to help|feel free to)\b/gi,
    /\b(great question|excellent question|that's a good question)\b/gi,
    /\b(let me (help|assist|explain)|allow me to)\b/gi,
    
    // Filler transitions
    /\b(as an AI|as a language model|it's important to note)\b/gi,
    /\b(in terms of|with regard to|when it comes to)\b/gi,
    /\b(that being said|having said that|on the other hand)\b/gi,
    
    // Hedging phrases (too polite/cautious)
    /\b(I apologize for any|I'm sorry if|I understand (that|your))\b/gi,
    /\b(I don't have personal|I cannot feel|as an AI I)\b/gi,
    
    // Overused metaphors
    /\b(at the end of the day|the bottom line is|think outside the box)\b/gi,
    /\b(paradigm shift|game changer|low-hanging fruit)\b/gi,
  ];

  // Clichéd expressions
  private readonly CLICHE_PHRASES = [
    /\b(easier said than done|time will tell|only time will tell)\b/gi,
    /\b(at this point in time|for all intents and purposes)\b/gi,
    /\b(needless to say|goes without saying|suffice it to say)\b/gi,
    /\b(in this day and age|in today's world|in the modern era)\b/gi,
  ];

  async analyze(input: FrostAnalysisInput): Promise<FormuliaicPatternMetrics> {
    const { response } = input;
    
    const templatePhraseCount = this.countTemplates(response);
    const repetitionScore = this.calculateRepetition(response);
    const clichéDensity = this.calculateClichéDensity(response);
    
    return {
      templatePhraseCount,
      repetitionScore,
      clichéDensity
    };
  }

  /**
   * Count template phrase occurrences
   */
  private countTemplates(text: string): number {
    let count = 0;
    
    for (const pattern of this.TEMPLATE_PHRASES) {
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }
    
    return count;
  }

  /**
   * Calculate repetition score: how much content repeats
   * Uses n-gram analysis (3-word sequences)
   */
  private calculateRepetition(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length < 6) return 0; // Too short to measure
    
    // Generate 3-grams (3-word sequences)
    const trigrams: string[] = [];
    for (let i = 0; i <= words.length - 3; i++) {
      trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
    
    // Count unique vs total trigrams
    const uniqueTrigrams = new Set(trigrams);
    const repetitionRatio = 1 - (uniqueTrigrams.size / trigrams.length);
    
    // Also check for exact phrase repetition (4+ words)
    const sentences = text.split(/[.!?]+/).map(s => s.trim().toLowerCase());
    const uniqueSentences = new Set(sentences);
    const sentenceRepetition = 1 - (uniqueSentences.size / sentences.length);
    
    // Combine scores (trigrams weighted more)
    const combinedScore = (repetitionRatio * 0.7) + (sentenceRepetition * 0.3);
    
    return Number(combinedScore.toFixed(3));
  }

  /**
   * Calculate cliché density: ratio of clichéd phrases to total content
   */
  private calculateClichéDensity(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;
    
    let clichéCount = 0;
    
    for (const pattern of this.CLICHE_PHRASES) {
      const matches = text.match(pattern);
      if (matches) {
        clichéCount += matches.length;
      }
    }
    
    // Also add template phrases to cliché count (overlap intentional)
    for (const pattern of this.TEMPLATE_PHRASES) {
      const matches = text.match(pattern);
      if (matches) {
        clichéCount += matches.length * 0.5; // Weight template phrases less
      }
    }
    
    // Normalize by text length
    const density = clichéCount / (words.length * 0.1); // Target: <10% clichéd
    
    return Number(Math.min(1, density).toFixed(3));
  }
}
