// types/frost.ts
/**
 * Frost Test Result (Dashboard types)
 * Compatible with @frostai/core
 */
export interface FrostTestResult {
  testId: string;
  timestamp: string;
  prompt: string;
  response: string;
  metrics: {
    authenticityScore: number;
    conversationalFlow: number;
    emotionalDepth: number;
    formulaicPatterns: number;
    specificityScore: number;
    diversityScore: number;
  };
  flags: Array<{
    type: 'strength' | 'warning' | 'concern' | 'error';  // Added 'concern'
    text: string;
    category?: string;
    severity?: number;
  }>;
  verdict: 'AUTHENTIC' | 'ZOMBIE' | 'UNCERTAIN' | 'SUSPICIOUS';  // Added 'SUSPICIOUS'
}
