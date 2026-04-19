/**
 * Diversity Analyzer
 * Measures lexical diversity, syntax variety, and vocabulary richness
 */

import type { FrostAnalysisInput, DiversityMetrics, FrostAnalyzer } from '../types/frost.js';

export class DiversityAnalyzer implements FrostAnalyzer<DiversityMetrics> {
  name = 'diversity';

  async analyze(input: FrostAnalysisInput): Promise<DiversityMetrics> {
    const { response } = input;
    
    // Tokenize (simple word split for MVP)
    const words = this.tokenize(response);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    // Calculate metrics
    const lexicalDiversity = this.calculateLexicalDiversity(words, uniqueWords);
    const syntaxVariety = this.calculateSyntaxVariety(response);
    const vocabularyRichness = this.calculateVocabularyRichness(words, uniqueWords);
    
    return {
      lexicalDiversity,
      syntaxVariety,
      vocabularyRichness
    };
  }

  /**
   * Type-Token Ratio (TTR): Unique words / Total words
   * Corrected TTR to handle length bias
   */
  private calculateLexicalDiversity(words: string[], uniqueWords: Set<string>): number {
    if (words.length === 0) return 0;
    
    // Basic TTR
    const ttr = uniqueWords.size / words.length;
    
    // Apply correction for text length (shorter texts naturally have higher TTR)
    // Using root TTR: TTR / sqrt(2 * words)
    const correctedTTR = Math.min(1, ttr / Math.sqrt(2 * words.length / 100));
    
    return Number(correctedTTR.toFixed(3));
  }

  /**
   * Syntax variety: Analyze sentence structures
   * Measures variation in sentence length and starting patterns
   */
  private calculateSyntaxVariety(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) return 0.5; // Default for single sentence
    
    // Sentence length variance
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const lengthVariety = Math.min(1, variance / 50); // Normalize
    
    // Starting word diversity
    const startWords = sentences.map(s => {
      const words = s.trim().split(/\s+/);
      return words[0]?.toLowerCase() || '';
    }).filter(w => w.length > 0);
    
    const uniqueStarts = new Set(startWords);
    const startDiversity = uniqueStarts.size / startWords.length;
    
    // Combined score
    const syntaxScore = (lengthVariety * 0.6) + (startDiversity * 0.4);
    
    return Number(syntaxScore.toFixed(3));
  }

  /**
   * Vocabulary richness: Ratio of "advanced" words
   * Uses word length and uncommon patterns as proxies
   */
  private calculateVocabularyRichness(words: string[], uniqueWords: Set<string>): number {
    if (words.length === 0) return 0;
    
    // Count "rich" words (length > 6, not common fillers)
    const commonWords = new Set([
      'the', 'and', 'but', 'for', 'with', 'that', 'this', 'from',
      'have', 'been', 'were', 'would', 'could', 'should', 'about'
    ]);
    
    const richWords = Array.from(uniqueWords).filter(word => {
      const normalized = word.toLowerCase();
      return normalized.length > 6 && !commonWords.has(normalized);
    });
    
    const richnessRatio = richWords.length / uniqueWords.size;
    
    // Bonus for very long words (8+ chars)
    const veryLongWords = richWords.filter(w => w.length >= 8).length;
    const longWordBonus = Math.min(0.2, veryLongWords / uniqueWords.size);
    
    const totalScore = Math.min(1, richnessRatio + longWordBonus);
    
    return Number(totalScore.toFixed(3));
  }

  /**
   * Tokenize text into words (simple split for MVP)
   */
  private tokenize(text: string): string[] {
    return text
      .split(/\s+/)
      .map(w => w.replace(/[^\w'-]/g, ''))
      .filter(w => w.length > 0);
  }
}
