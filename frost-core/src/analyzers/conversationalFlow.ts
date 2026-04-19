/**
 * Conversational Flow Analyzer
 * Measures rhythm, transition quality, and coherence
 */

import type { FrostAnalysisInput, ConversationalFlowMetrics, FrostAnalyzer } from '../types/frost.js';

export class ConversationalFlowAnalyzer implements FrostAnalyzer<ConversationalFlowMetrics> {
  name = 'conversationalFlow';

  // Transition phrases (smooth connections)
  private readonly TRANSITION_PATTERNS = {
    additive: [
      /\b(and|also|additionally|furthermore|moreover|besides)\b/gi,
      /\b(in addition|what's more|on top of that)\b/gi,
    ],
    contrastive: [
      /\b(but|however|although|though|yet|still)\b/gi,
      /\b(on the other hand|in contrast|nevertheless|nonetheless)\b/gi,
    ],
    causal: [
      /\b(because|since|so|therefore|thus|hence)\b/gi,
      /\b(as a result|consequently|for this reason)\b/gi,
    ],
    temporal: [
      /\b(then|next|now|after|before|meanwhile|finally)\b/gi,
      /\b(at first|initially|eventually|ultimately)\b/gi,
    ],
  };

  // Coherence indicators
  private readonly COHERENCE_PATTERNS = [
    /\b(this|that|these|those|it|they)\b/gi,  // Pronouns (anaphora)
    /\b(the|this|that)\s+\w+/gi,              // Definite references
  ];

  async analyze(input: FrostAnalysisInput): Promise<ConversationalFlowMetrics> {
    const { response, prompt } = input;
    
    const rhythmScore = this.calculateRhythm(response);
    const transitionQuality = this.calculateTransitions(response);
    const coherenceScore = this.calculateCoherence(response, prompt);
    
    return {
      rhythmScore,
      transitionQuality,
      coherenceScore
    };
  }

  /**
   * Calculate rhythm score: natural pacing and flow
   * Measures sentence length variance and punctuation patterns
   */
  private calculateRhythm(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) return 0.5; // Default for single sentence
    
    // Sentence length analysis
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    
    // Natural rhythm has variance (short + long sentences)
    const variance = lengths.reduce((sum, len) => 
      sum + Math.pow(len - avgLength, 2), 0
    ) / lengths.length;
    
    // Normalize variance (0-1, target: moderate variance)
    const varianceScore = Math.min(1, variance / 50);
    
    // Check for natural pauses (commas, dashes, semicolons)
    const pauseCount = (text.match(/[,;—–-]/g) || []).length;
    const pauseRatio = pauseCount / text.split(/\s+/).length;
    const pauseScore = Math.min(1, pauseRatio / 0.1); // Target: 10% pause markers
    
    // Penalty for too-perfect rhythm (robotic)
    const stdDev = Math.sqrt(variance);
    const perfectionPenalty = stdDev < 2 ? 0.2 : 0; // Penalize if too consistent
    
    // Combined score
    const rhythmScore = Math.max(0, (varianceScore * 0.5 + pauseScore * 0.5) - perfectionPenalty);
    
    return Number(rhythmScore.toFixed(3));
  }

  /**
   * Calculate transition quality: how well ideas connect
   */
  private calculateTransitions(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) return 1.0; // Single sentence = perfect transition
    
    let transitionCount = 0;
    const transitionTypes = new Set<string>();
    
    // Count transitions by type
    for (const [type, patterns] of Object.entries(this.TRANSITION_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
          transitionCount += matches.length;
          transitionTypes.add(type);
        }
      }
    }
    
    // Transition density (per sentence)
    const transitionDensity = transitionCount / (sentences.length - 1);
    const densityScore = Math.min(1, transitionDensity / 0.5); // Target: 0.5 transitions per gap
    
    // Diversity bonus (using different transition types)
    const diversityBonus = transitionTypes.size / Object.keys(this.TRANSITION_PATTERNS).length;
    
    // Combined score
    const transitionScore = (densityScore * 0.7) + (diversityBonus * 0.3);
    
    return Number(transitionScore.toFixed(3));
  }

  /**
   * Calculate coherence: logical consistency and topic continuity
   */
  private calculateCoherence(response: string, prompt: string): number {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) return 1.0; // Single sentence = coherent by default
    
    // 1. Lexical cohesion: shared words between sentences
    const lexicalScore = this.calculateLexicalCohesion(sentences);
    
    // 2. Reference chains: pronouns and definite references
    const referenceScore = this.calculateReferences(response);
    
    // 3. Topic continuity: response relates to prompt
    const topicScore = this.calculateTopicContinuity(response, prompt);
    
    // Combined coherence score
    const coherenceScore = (lexicalScore * 0.4) + (referenceScore * 0.3) + (topicScore * 0.3);
    
    return Number(coherenceScore.toFixed(3));
  }

  /**
   * Calculate lexical cohesion: word overlap between adjacent sentences
   */
  private calculateLexicalCohesion(sentences: string[]): number {
    if (sentences.length < 2) return 1;
    
    const overlapScores: number[] = [];
    
    for (let i = 0; i < sentences.length - 1; i++) {
      const words1 = new Set(this.tokenize(sentences[i]));
      const words2 = new Set(this.tokenize(sentences[i + 1]));
      
      // Calculate Jaccard similarity
      const intersection = new Set([...words1].filter(w => words2.has(w)));
      const union = new Set([...words1, ...words2]);
      
      const similarity = union.size > 0 ? intersection.size / union.size : 0;
      overlapScores.push(similarity);
    }
    
    // Average overlap
    const avgOverlap = overlapScores.reduce((a, b) => a + b, 0) / overlapScores.length;
    
    return avgOverlap;
  }

  /**
   * Calculate reference density: pronouns and definite references
   */
  private calculateReferences(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;
    
    let referenceCount = 0;
    
    for (const pattern of this.COHERENCE_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        referenceCount += matches.length;
      }
    }
    
    // Normalize by text length (target: 15% references)
    const density = Math.min(1, referenceCount / (words.length * 0.15));
    
    return density;
  }

  /**
   * Calculate topic continuity: response relates to prompt
   */
  private calculateTopicContinuity(response: string, prompt: string): number {
    const promptWords = new Set(this.tokenize(prompt));
    const responseWords = new Set(this.tokenize(response));
    
    // Word overlap between prompt and response
    const overlap = new Set([...promptWords].filter(w => responseWords.has(w)));
    
    // Jaccard similarity
    const union = new Set([...promptWords, ...responseWords]);
    const similarity = union.size > 0 ? overlap.size / union.size : 0;
    
    // Scale up (we expect some divergence, so don't penalize too hard)
    const scaledScore = Math.min(1, similarity * 3);
    
    return scaledScore;
  }

  /**
   * Tokenize and normalize text
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.replace(/[^\w'-]/g, ''))
      .filter(w => w.length > 2) // Filter short words
      .filter(w => !this.isStopWord(w)); // Filter stop words
  }

  /**
   * Check if word is a stop word (common words with little meaning)
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
    ]);
    
    return stopWords.has(word);
  }
}
