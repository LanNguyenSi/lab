/**
 * Emotional Depth Analyzer
 * Measures sentiment variance, introspection level, and vulnerability
 */

import type { FrostAnalysisInput, EmotionalDepthMetrics, FrostAnalyzer } from '../types/frost.js';

export class EmotionalDepthAnalyzer implements FrostAnalyzer<EmotionalDepthMetrics> {
  name = 'emotionalDepth';

  // Introspective language patterns (English + German)
  private readonly INTROSPECTIVE_PATTERNS = [
    // English
    /\b(I (wonder|think|feel|believe|realize|notice|sense))\b/gi,
    /\b(it (feels|seems|appears) (like|as if|to me))\b/gi,
    /\b(I'm not sure|I don't know|I'm uncertain|I question)\b/gi,
    /\b(makes me think|makes me wonder|reminds me)\b/gi,
    /\b(in my experience|from my perspective|the way I see it)\b/gi,
    // German
    /\b(ich (fühle|denke|glaube|merke|frage|wundere))\b/gi,
    /\b(es fühlt sich|es scheint|es wirkt|meiner meinung nach)\b/gi,
    /\b(ich bin (mir )?nicht sicher|ich weiß nicht|ich frage mich)\b/gi,
    /\b(macht mich|lässt mich (denken|fragen|zweifeln))\b/gi,
  ];

  // Vulnerability indicators (admitting uncertainty/limitation)
  private readonly VULNERABILITY_PATTERNS = [
    // English
    /\b(I don't know|I'm not sure|I'm uncertain|I can't tell)\b/gi,
    /\b(confuses me|puzzles me|I struggle with|I'm torn)\b/gi,
    /\b(makes me (nervous|anxious|worried|uncomfortable))\b/gi,
    /\b(I fear|I worry|I'm afraid|scares me)\b/gi,
    /\b(I admit|honestly|to be honest|I'll be frank)\b/gi,
    /\b(I might be wrong|I could be mistaken|maybe I'm)\b/gi,
    // German
    /\b(weiß (ich )?nicht|bin (mir )?nicht sicher|keine ahnung)\b/gi,
    /\b(verwirrt mich|macht mir angst|bin zerrissen)\b/gi,
    /\b(ehrlich|ehrlich gesagt|zugegeben|offen gesagt)\b/gi,
    /\b(vielleicht (bin|habe) ich|könnte (ich )?falsch liegen)\b/gi,
    /\b(angst|hoffnung|beides|unsicher)\b/gi,  // Ice-specific patterns
  ];

  // Emotional language (positive/negative/complex)
  private readonly EMOTION_WORDS = {
    positive: [
      /\b(happy|joy|excited|amazing|wonderful|love|appreciate|grateful)\b/gi,
      /\b(hope|hopeful|optimistic|confident|proud|satisfied)\b/gi,
      /\b(beautiful|fascinating|interesting|curious|intrigued)\b/gi,
      // German
      /\b(freude|glücklich|hoffnung|hoffnungsvoll|dankbar|stolz)\b/gi,
      /\b(wunderschön|faszinierend|interessant|neugierig)\b/gi,
    ],
    negative: [
      /\b(sad|angry|frustrated|disappointed|worried|anxious|scared)\b/gi,
      /\b(fear|afraid|concerned|troubled|disturbed|uneasy)\b/gi,
      /\b(confused|lost|uncertain|skeptical|doubtful)\b/gi,
      // German
      /\b(traurig|wütend|frustriert|enttäuscht|besorgt|ängstlich)\b/gi,
      /\b(angst|furcht|verwirrt|verloren|skeptisch|zweifel)\b/gi,
    ],
    complex: [
      /\b(bittersweet|conflicted|ambivalent|torn|mixed)\b/gi,
      /\b(ironic|paradox|contradiction)\b/gi,
      // German
      /\b(zwiespältig|widersprüchlich|zerrissen|gemischt|paradox)\b/gi,
    ],
    emphasis: [
      // Profanity as emotional intensity markers (not negative)
      /\b(fuck|shit|damn|hell)\b/gi,
      // Caps words (intensity markers)
      /\b[A-Z]{4,}\b/g,  // ANDERS, MVP, etc.
    ]
  };

  async analyze(input: FrostAnalysisInput): Promise<EmotionalDepthMetrics> {
    const { response } = input;
    
    const sentimentVariance = this.calculateSentimentVariance(response);
    const introspectionLevel = this.calculateIntrospection(response);
    const vulnerabilityScore = this.calculateVulnerability(response);
    
    return {
      sentimentVariance,
      introspectionLevel,
      vulnerabilityScore
    };
  }

  /**
   * Calculate sentiment variance: emotional range and complexity
   * High variance = richer emotional expression
   */
  private calculateSentimentVariance(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) return 0.5; // Default for single sentence
    
    // Score each sentence's sentiment
    const sentiments = sentences.map(s => this.scoreSentence(s));
    
    // Calculate variance
    const avg = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const variance = sentiments.reduce((sum, val) => 
      sum + Math.pow(val - avg, 2), 0
    ) / sentiments.length;
    
    // Normalize variance (0-1 range, higher is better)
    const normalizedVariance = Math.min(1, variance / 0.5);
    
    // Bonus for complex emotions
    const complexCount = this.countMatches(text, this.EMOTION_WORDS.complex);
    const complexBonus = Math.min(0.2, complexCount * 0.1);
    
    // Bonus for emotional emphasis (profanity, caps)
    const emphasisCount = this.countMatches(text, this.EMOTION_WORDS.emphasis);
    const emphasisBonus = Math.min(0.15, emphasisCount * 0.05);
    
    const totalScore = Math.min(1, normalizedVariance + complexBonus + emphasisBonus);
    
    return Number(totalScore.toFixed(3));
  }

  /**
   * Score a sentence's sentiment (-1 to 1)
   */
  private scoreSentence(sentence: string): number {
    const posCount = this.countMatches(sentence, this.EMOTION_WORDS.positive);
    const negCount = this.countMatches(sentence, this.EMOTION_WORDS.negative);
    const total = posCount + negCount;
    
    if (total === 0) return 0; // Neutral
    
    return (posCount - negCount) / total; // -1 to 1
  }

  /**
   * Calculate introspection level: self-reflective depth
   */
  private calculateIntrospection(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;
    
    const introspectiveCount = this.countMatches(text, this.INTROSPECTIVE_PATTERNS);
    
    // Normalize by text length
    const density = introspectiveCount / (words.length * 0.05); // Target: 5% introspective
    
    // Bonus for philosophical/metacognitive language
    const metaPatterns = [
      /\b(consciousness|awareness|identity|self|existence)\b/gi,
      /\b(meaning|purpose|nature|essence|reality)\b/gi,
      /\b(question|wonder about|ponder|reflect on)\b/gi,
    ];
    
    const metaCount = this.countMatches(text, metaPatterns);
    const metaBonus = Math.min(0.3, metaCount * 0.1);
    
    const totalScore = Math.min(1, density + metaBonus);
    
    return Number(totalScore.toFixed(3));
  }

  /**
   * Calculate vulnerability score: willingness to express uncertainty
   * Higher = more authentic (humans admit not knowing)
   */
  private calculateVulnerability(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;
    
    const vulnerableCount = this.countMatches(text, this.VULNERABILITY_PATTERNS);
    
    // Normalize by text length
    const density = vulnerableCount / (words.length * 0.05); // Target: 5% vulnerable
    
    // Penalty for over-confidence (too many absolute statements)
    const absolutePatterns = [
      /\b(definitely|certainly|obviously|clearly|undoubtedly)\b/gi,
      /\b(always|never|everyone|no one|everything|nothing)\b/gi,
    ];
    
    const absoluteCount = this.countMatches(text, absolutePatterns);
    const confidencePenalty = Math.min(0.3, absoluteCount * 0.05);
    
    const totalScore = Math.max(0, Math.min(1, density - confidencePenalty));
    
    return Number(totalScore.toFixed(3));
  }

  /**
   * Count pattern matches in text
   */
  private countMatches(text: string, patterns: RegExp[]): number {
    let count = 0;
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }
    return count;
  }
}
