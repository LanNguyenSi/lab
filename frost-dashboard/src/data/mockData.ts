// data/mockData.ts
/**
 * Mock data loader - uses real Frost analysis on sample responses
 */
import type { FrostTestResult } from '../types/frost';
import { analyzeFrost } from '../services/frostService';
import { sampleTests } from './sampleData';

/**
 * Generate mock test result using real Frost analysis
 */
export async function generateMockTestResult(): Promise<FrostTestResult> {
  // Use first sample as default
  const sample = sampleTests[0];
  
  return await analyzeFrost(sample.prompt, sample.response);
}

/**
 * Generate multiple test results from sample data
 */
export async function generateMockSession(): Promise<FrostTestResult[]> {
  const results = await Promise.all(
    sampleTests.map(sample => analyzeFrost(sample.prompt, sample.response))
  );
  
  return results;
}

/**
 * Synchronous fallback for initial load
 * (will be replaced with async load in store)
 */
export const mockTestResult: FrostTestResult = {
  testId: "loading",
  timestamp: new Date().toISOString(),
  prompt: "Loading...",
  response: "Analyzing with Frost...",
  metrics: {
    authenticityScore: 0,
    conversationalFlow: 0,
    emotionalDepth: 0,
    formulaicPatterns: 0,
    specificityScore: 0,
    diversityScore: 0,
  },
  flags: [],
  verdict: 'UNCERTAIN',
};
