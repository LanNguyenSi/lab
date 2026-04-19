/**
 * Frost Service
 * Wrapper around @frostai/core for dashboard integration
 */

// @ts-ignore - local package, not published to npm
import { Frost, type FrostAnalysisResult } from '@frostai/core';
import type { FrostTestResult } from '../types/frost';

// Initialize Frost engine
const frost = new Frost({
  features: {
    detailedMetrics: true,
  },
});

/**
 * Analyze a prompt+response pair with Frost
 */
export async function analyzeFrost(
  prompt: string,
  response: string
): Promise<FrostTestResult> {
  // Run Frost analysis
  const result: FrostAnalysisResult = await frost.analyze({
    prompt,
    response,
  });

  // Map to dashboard FrostTestResult type
  return {
    testId: result.testId,
    timestamp: result.timestamp,
    prompt,
    response,
    metrics: {
      authenticityScore: result.metrics.authenticityScore,
      conversationalFlow: result.metrics.conversationalFlow,
      emotionalDepth: result.metrics.emotionalDepth,
      formulaicPatterns: result.metrics.formulaicPatterns,
      specificityScore: result.metrics.specificityScore,
      diversityScore: result.metrics.diversityScore,
    },
    flags: result.flags,
    verdict: result.verdict.verdict,
  };
}

/**
 * Get quick authenticity score (no full analysis)
 */
export async function getQuickScore(
  prompt: string,
  response: string
): Promise<number> {
  return await frost.quickScore(prompt, response);
}
