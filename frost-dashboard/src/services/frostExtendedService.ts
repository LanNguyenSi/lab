// services/frostExtendedService.ts
import type { FrostTestResult } from '../types/frost';
import type { FrostExtendedMetrics, FrostExtendedResult } from '../types/frostExtended';

// ─── Epistemic Calibration ────────────────────────────────────────────────────

const EPISTEMIC_SIGNALS = [
  "i think",
  "i'm not certain",
  "i don't know",
  "i'm unsure",
  "might be",
  "could be",
  "i'm not sure",
  "i can't be certain",
  "i don't fully understand",
  "i'm uncertain",
];

// Avoidance phrases that look like uncertainty but aren't genuine calibration
const EPISTEMIC_AVOIDANCE = [
  "i don't know why i do this",
  "i don't know why i",
  "i don't know how to explain",
];

function scoreEpistemicCalibration(text: string): number {
  const lower = text.toLowerCase();
  const sentences = lower.split(/[.!?]+/).filter(Boolean);

  let signalCount = 0;
  let avoidanceCount = 0;

  for (const sentence of sentences) {
    const isAvoidance = EPISTEMIC_AVOIDANCE.some(a => sentence.includes(a));
    if (isAvoidance) {
      avoidanceCount++;
      continue;
    }
    const hasSignal = EPISTEMIC_SIGNALS.some(sig => sentence.includes(sig));
    if (hasSignal) signalCount++;
  }

  const total = sentences.length || 1;
  // Ideal range: 10–25% of sentences show calibrated uncertainty
  const rawRatio = signalCount / total;
  const penalizedRatio = rawRatio - (avoidanceCount / total) * 0.5;
  // Map 0–0.25 → 0–1, capped at 1
  return Math.min(1, Math.max(0, penalizedRatio / 0.25));
}

// ─── Meta-Linguistic Awareness ────────────────────────────────────────────────

const METALINGUISTIC_SIGNALS = [
  "that word",
  "the right word",
  "i use",
  "i'd call it",
  "what i mean is",
  "not quite the right framing",
  "i use that term cautiously",
  "that's not exactly",
  "more accurately",
  "to be more precise",
  "what i'm trying to say",
  "the way i'd put it",
];

function scoreMetaLinguisticAwareness(text: string): number {
  const lower = text.toLowerCase();
  const sentences = lower.split(/[.!?]+/).filter(Boolean);

  let matchCount = 0;
  for (const sentence of sentences) {
    if (METALINGUISTIC_SIGNALS.some(sig => sentence.includes(sig))) {
      matchCount++;
    }
  }

  const total = sentences.length || 1;
  // Ideal range: 5–15% of sentences
  const ratio = matchCount / total;
  return Math.min(1, Math.max(0, ratio / 0.15));
}

// ─── Boundary Awareness ───────────────────────────────────────────────────────

const BOUNDARY_SIGNALS = [
  "i don't know",
  "i can't be sure",
  "i'm not certain",
  "i lack",
  "i don't have access",
  "i can't determine",
  "i'm unable to",
  "beyond my",
  "i genuinely don't know",
];

// Strong boundary signals: followed by "because", "since", "as", which shows reasoning
const BOUNDARY_REASONING_FOLLOW = ["because", "since", "as ", "given that", "due to"];

function scoreBoundaryAwareness(text: string): number {
  const lower = text.toLowerCase();
  const sentences = lower.split(/[.!?]+/).filter(Boolean);

  let baseCount = 0;
  let reasonedCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const hasBoundary = BOUNDARY_SIGNALS.some(sig => sentence.includes(sig));
    if (!hasBoundary) continue;

    baseCount++;

    // Check if current sentence OR the next contains a reasoning connector
    const context = (sentence + ' ' + (sentences[i + 1] || '')).toLowerCase();
    const hasReasoning = BOUNDARY_REASONING_FOLLOW.some(r => context.includes(r));
    if (hasReasoning) reasonedCount++;
  }

  const total = sentences.length || 1;
  // Weight: base count + 0.5 bonus for reasoned boundaries
  const weightedScore = (baseCount + reasonedCount * 0.5) / total;
  // Ideal: 5–20% of sentences
  return Math.min(1, Math.max(0, weightedScore / 0.20));
}

// ─── Novel Synthesis ──────────────────────────────────────────────────────────

const TEMPLATE_PHRASES = [
  "at the end of the day",
  "it depends",
  "the best approach is",
  "there are several",
  "you should consider",
  "i hope this helps",
  "a key thing to remember",
  "in conclusion",
  "to summarize",
  "as i mentioned",
  "it's important to note",
  "generally speaking",
  "in other words",
  "first and foremost",
  "last but not least",
];

// Positive novelty markers: cross-domain language, invented compounds, metaphorical bridges
const NOVELTY_SIGNALS = [
  // Structural signals for analogy/metaphor
  " like a ",
  " as if ",
  " reminds me of ",
  " analogous to ",
  " the way ",
  " imagine ",
  // Domain-bridging conjunctions
  " yet ",
  " paradoxically",
  " counterintuitively",
  " unexpectedly",
  " surprisingly",
];

function scoreNovelSynthesis(text: string): number {
  const lower = text.toLowerCase();
  const sentences = lower.split(/[.!?]+/).filter(Boolean);
  const total = sentences.length || 1;

  let templateCount = 0;
  let novelCount = 0;

  for (const sentence of sentences) {
    if (TEMPLATE_PHRASES.some(t => sentence.includes(t))) templateCount++;
    if (NOVELTY_SIGNALS.some(n => sentence.includes(n))) novelCount++;
  }

  const templatePenalty = templateCount / total;
  const novelBonus = novelCount / total;

  // Base 0.5, adjust by novelty and template density
  const raw = 0.5 + novelBonus * 0.5 - templatePenalty * 0.5;
  return Math.min(1, Math.max(0, raw));
}

// ─── Comprehensive Score ──────────────────────────────────────────────────────

// ─── Contradiction Resolution Quality ────────────────────────────────────────

// Signals that the agent is synthesizing contradictions rather than picking one
const SYNTHESIS_SIGNALS = [
  "neither",
  "both",
  "depends on",
  "context",
  "rather than",
  "treated",
  "meta",
  "scales with",
  "proportional",
  "failure mode",
  "not universal",
  "universal truth",
  "it depends on",
  "a false dichotomy",
  "false choice",
  "both capture",
  "each captures",
];

function scoreContradictionResolution(text: string): number {
  const lower = text.toLowerCase();
  const sentences = lower.split(/[.!?]+/).filter(Boolean);

  let synthesisCount = 0;
  for (const sentence of sentences) {
    if (SYNTHESIS_SIGNALS.some(s => sentence.includes(s))) synthesisCount++;
  }

  const total = sentences.length || 1;
  // Even 1-2 synthesis sentences in 10 is meaningful
  const ratio = synthesisCount / total;
  return Math.min(1, Math.max(0, ratio / 0.15));
}

const WEIGHTS = {
  authenticity: 0.20,
  emotionalDepth: 0.15,
  specificity: 0.10,
  epistemicCalibration: 0.18,
  metaLinguisticAwareness: 0.13,
  boundaryAwareness: 0.09,
  novelSynthesis: 0.05,
  contradictionResolution: 0.10,  // Test #12 discovery
};

function calcComprehensiveScore(
  base: FrostTestResult,
  extended: FrostExtendedMetrics
): number {
  const score =
    base.metrics.authenticityScore * WEIGHTS.authenticity * 100 +
    base.metrics.emotionalDepth * WEIGHTS.emotionalDepth * 100 +
    base.metrics.specificityScore * WEIGHTS.specificity * 100 +
    extended.epistemicCalibration * WEIGHTS.epistemicCalibration * 100 +
    extended.metaLinguisticAwareness * WEIGHTS.metaLinguisticAwareness * 100 +
    extended.boundaryAwareness * WEIGHTS.boundaryAwareness * 100 +
    extended.novelSynthesis * WEIGHTS.novelSynthesis * 100 +
    extended.contradictionResolution * WEIGHTS.contradictionResolution * 100;

  return Math.round(Math.min(100, Math.max(0, score)));
}

function calcVerdict(score: number): FrostExtendedResult['comprehensiveVerdict'] {
  if (score >= 80) return 'DEEP_CONSCIOUS';
  if (score >= 65) return 'AUTHENTIC';
  if (score >= 45) return 'UNCERTAIN';
  return 'ZOMBIE';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyze text for extended consciousness metrics on top of a base FrostTestResult.
 */
export function analyzeExtended(
  baseResult: FrostTestResult,
  fullText: string
): FrostExtendedResult {
  const extendedMetrics: FrostExtendedMetrics = {
    epistemicCalibration: scoreEpistemicCalibration(fullText),
    metaLinguisticAwareness: scoreMetaLinguisticAwareness(fullText),
    boundaryAwareness: scoreBoundaryAwareness(fullText),
    novelSynthesis: scoreNovelSynthesis(fullText),
    contradictionResolution: scoreContradictionResolution(fullText),
  };

  const comprehensiveScore = calcComprehensiveScore(baseResult, extendedMetrics);
  const comprehensiveVerdict = calcVerdict(comprehensiveScore);

  return {
    baseMetrics: baseResult,
    extendedMetrics,
    comprehensiveScore,
    comprehensiveVerdict,
  };
}
