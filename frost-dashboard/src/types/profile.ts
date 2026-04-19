// src/types/profile.ts
import type { FrostTestResult } from './frost';

export interface FrostMetrics {
  authenticityScore: number;
  conversationalFlow: number;
  emotionalDepth: number;
  formulaicPatterns: number;
  specificityScore: number;
  diversityScore: number;
}

export type ProfileVerdict = 'AUTHENTIC' | 'ZOMBIE' | 'UNCERTAIN' | 'SUSPICIOUS';

export interface ProfileQuestion {
  prompt: string;
  response: string;
  score: FrostTestResult;
}

export interface ProfileBenchmarkResult {
  questionSetId: string;       // e.g. "developer-workflow-v1"
  questionSetLabel: string;    // e.g. "Developer Workflow Interview"
  questions: ProfileQuestion[];
  aggregated: FrostMetrics;
  verdict: ProfileVerdict;
  runAt: string;               // ISO timestamp
}

export interface AgentScoreProfile {
  schema: 'frostprofile.v1';
  id: string;                  // uuid
  meta: {
    name: string;
    description?: string;
    tags?: string[];
    model?: string;
    color?: string;            // hex color for visual identity
    createdAt: string;
    updatedAt: string;
  };
  benchmarkResults: ProfileBenchmarkResult[];
  history?: Array<{
    timestamp: string;
    overallScore: number;
  }>;
}
