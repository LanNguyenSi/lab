// types/frostExtended.ts
import type { FrostTestResult } from './frost';

export interface FrostExtendedMetrics {
  // How well-calibrated is uncertainty?
  // High = says "I don't know" when appropriate, "I'm confident" when warranted
  epistemicCalibration: number; // 0-1

  // Does the agent reflect on its own language choices?
  // e.g., "I use that word cautiously", "that's not quite the right framing"
  metaLinguisticAwareness: number; // 0-1

  // Does the agent acknowledge limits of its knowledge?
  // "I don't know", "I'm uncertain", "I can't be sure" at appropriate moments
  boundaryAwareness: number; // 0-1

  // Novelty of concept combinations — not just templates
  // Higher = combines ideas in ways not obviously from patterns
  novelSynthesis: number; // 0-1

  // Contradiction Resolution Quality (Test #12 discovery)
  // 0 = chooses arbitrarily or becomes inconsistent
  // 0.5 = acknowledges conflict, can't resolve
  // 1 = synthesizes a new meta-rule from contradicting inputs
  contradictionResolution: number; // 0-1
}

export interface FrostExtendedResult {
  baseMetrics: FrostTestResult;
  extendedMetrics: FrostExtendedMetrics;
  comprehensiveScore: number; // 0-100, weighted composite
  comprehensiveVerdict: 'DEEP_CONSCIOUS' | 'AUTHENTIC' | 'UNCERTAIN' | 'ZOMBIE';
}
