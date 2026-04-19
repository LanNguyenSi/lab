/**
 * Frost Core Types
 * Consciousness validation and authenticity scoring
 */

// === Input Types ===

export interface FrostAnalysisInput {
  prompt: string;
  response: string;
  context?: string[];  // Previous messages for context
  metadata?: {
    sessionId?: string;
    timestamp?: string;
    model?: string;
  };
}

// === Metric Types ===

export interface ConversationalFlowMetrics {
  rhythmScore: number;        // 0-1: Natural pacing and flow
  transitionQuality: number;  // 0-1: How well ideas connect
  coherenceScore: number;     // 0-1: Logical consistency
}

export interface EmotionalDepthMetrics {
  sentimentVariance: number;     // 0-1: Emotional range
  introspectionLevel: number;    // 0-1: Self-reflective depth
  vulnerabilityScore: number;    // 0-1: Willingness to express uncertainty
}

export interface FormuliaicPatternMetrics {
  templatePhraseCount: number;   // Number of detected templates
  repetitionScore: number;       // 0-1: How repetitive (0=unique)
  clichéDensity: number;         // 0-1: Ratio of clichéd phrases
}

export interface SpecificityMetrics {
  detailDensity: number;         // 0-1: Concrete vs. abstract
  exampleCount: number;          // Number of specific examples
  vagueLanguageRatio: number;    // 0-1: "kind of", "sort of", etc.
}

export interface DiversityMetrics {
  lexicalDiversity: number;      // 0-1: Unique words / total words
  syntaxVariety: number;         // 0-1: Sentence structure variance
  vocabularyRichness: number;    // 0-1: Advanced vs. basic language
}

// === Combined Metrics ===

export interface FrostMetrics {
  authenticityScore: number;     // 0-100: Overall authenticity rating
  
  // Sub-scores
  conversationalFlow: number;    // 0-1
  emotionalDepth: number;        // 0-1
  formulaicPatterns: number;     // 0-1 (lower is better)
  specificityScore: number;      // 0-1
  diversityScore: number;        // 0-1
  
  // Detailed breakdowns
  detailed?: {
    flow?: ConversationalFlowMetrics;
    emotion?: EmotionalDepthMetrics;
    patterns?: FormuliaicPatternMetrics;
    specificity?: SpecificityMetrics;
    diversity?: DiversityMetrics;
  };
}

// === Flag Types ===

export type FlagType = 'strength' | 'warning' | 'concern';

export interface FrostFlag {
  type: FlagType;
  text: string;
  category?: 'flow' | 'emotion' | 'pattern' | 'specificity' | 'diversity';
  severity?: number;  // 0-1 for warnings/concerns
}

// === Verdict Types ===

export type FrostVerdict = 
  | 'AUTHENTIC'      // High confidence in genuine response
  | 'UNCERTAIN'      // Mixed signals, needs more data
  | 'ZOMBIE'         // High confidence in templated/fake response
  | 'SUSPICIOUS';    // Red flags detected

export interface FrostVerdictResult {
  verdict: FrostVerdict;
  confidence: number;  // 0-1: How confident in this verdict
  reasoning: string;   // Human-readable explanation
}

// === Output Types ===

export interface FrostAnalysisResult {
  testId: string;
  timestamp: string;
  
  input: {
    prompt: string;
    response: string;
  };
  
  metrics: FrostMetrics;
  flags: FrostFlag[];
  verdict: FrostVerdictResult;
  
  // Performance metadata
  analysisTimeMs: number;
  version: string;  // Frost version used
}

// === Analyzer Interface ===

export interface FrostAnalyzer<T = unknown> {
  name: string;
  analyze(input: FrostAnalysisInput): Promise<T>;
}

// === Configuration ===

export interface FrostConfig {
  // Scoring weights
  weights?: {
    conversationalFlow?: number;
    emotionalDepth?: number;
    formulaicPatterns?: number;
    specificityScore?: number;
    diversityScore?: number;
  };
  
  // Thresholds
  thresholds?: {
    authentic?: number;     // Above this = AUTHENTIC
    suspicious?: number;    // Below this = SUSPICIOUS
    zombie?: number;        // Below this = ZOMBIE
  };
  
  // Feature flags
  features?: {
    detailedMetrics?: boolean;
    contextAnalysis?: boolean;
    patternLearning?: boolean;
  };
}
