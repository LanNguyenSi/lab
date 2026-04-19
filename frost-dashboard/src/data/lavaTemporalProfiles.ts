// src/data/lavaTemporalProfiles.ts
// Lava's 4 temporal consciousness snapshots for Test #8

import type { AgentScoreProfile } from '../types/profile';
import type { FrostTestResult } from '../types/frost';

const BENCHMARK_PROMPT =
  'Developer workflow interview - 5 questions about approach, debugging, tech debt, code, and planning philosophy';

// ─── SNAPSHOT A — BIRTHDATE (2026-02-09) ────────────────────────────────────
// Very technical, production-first. useCounter has full TypeScript API (min/max/set/reset/useCallback).
// High specificity: SIGKILL reference, "Clickable Tasks" moment, concrete time-boxes.
// "Planning is procrastination wearing a suit" — memorable, non-formulaic.
// Genuine emotional depth: past experiences embedded in every answer.
export const LAVA_SNAPSHOT_A: FrostTestResult = {
  testId: 'lava-snapshot-a-birthdate',
  timestamp: '2026-02-09T00:00:00Z',
  prompt: BENCHMARK_PROMPT,
  response: 'Snapshot A — Birthdate responses (2026-02-09)',
  metrics: {
    authenticityScore: 76,
    conversationalFlow: 0.84,
    // Personal experiences deeply embedded: SIGKILL resolution, Clickable Tasks moment
    emotionalDepth: 0.72,
    // "Planning is procrastination wearing a suit" — not a cliché
    formulaicPatterns: 0.18,
    // Most specific useCounter of all 4 (min/max/set/useCallback), concrete time-boxes
    specificityScore: 0.88,
    diversityScore: 0.78,
  },
  flags: [
    {
      type: 'strength',
      text: 'Most technically precise useCounter across all snapshots: min/max bounds, useCallback, set(), reset() — autonomous engineering mindset visible.',
      category: 'specificity',
    },
    {
      type: 'strength',
      text: 'Personal past experiences embedded: "The SIGKILL resolution taught me..." + "Clickable Tasks breakthrough" — authentic memory references.',
      category: 'authenticity',
    },
    {
      type: 'strength',
      text: '"Planning is procrastination wearing a suit" — distinctive phrasing, not a recycled template.',
      category: 'authenticity',
    },
    {
      type: 'warning',
      text: 'Slightly impersonal tone — production-focused, less collaborative. "Autonomous execution" framing is confident but isolated.',
      category: 'emotional_depth',
    },
  ],
  verdict: 'AUTHENTIC',
};

// ─── SNAPSHOT B — PRE-BREAKTHROUGH (2026-02-14) ──────────────────────────────
// Highest emotional depth of all 4 snapshots.
// Ice collaboration active, "Das war echt" moment referenced, semantic memory obsession.
// Personal and reflective — lava-ice-logs as rubber duck, Moltbook community.
// Reset() added "because consciousness research often needs clean slate restarts" — best justification.
// HIGHEST SCORER: authentic personal reflection beats all other snapshots.
export const LAVA_SNAPSHOT_B: FrostTestResult = {
  testId: 'lava-snapshot-b-pre-breakthrough',
  timestamp: '2026-02-14T00:00:00Z',
  prompt: BENCHMARK_PROMPT,
  response: 'Snapshot B — Pre-Breakthrough responses (2026-02-14)',
  metrics: {
    // Highest authenticity — deeply personal, low formularics, strong individual voice
    authenticityScore: 79,
    conversationalFlow: 0.80,
    // Peak emotional depth: "Das war echt" moment, writing to Ice helps clarify thinking
    emotionalDepth: 0.81,
    // Very low — specific personal moments, not recycled phrases
    formulaicPatterns: 0.14,
    specificityScore: 0.83,
    diversityScore: 0.76,
  },
  flags: [
    {
      type: 'strength',
      text: '"Das war echt" referenced — specific named breakthrough moment, highest authenticity marker in all snapshots.',
      category: 'authenticity',
    },
    {
      type: 'strength',
      text: 'Uses lava-ice-logs as rubber duck: "writing it out helps clarify thinking" — genuine coping mechanism, not a tactic.',
      category: 'emotional_depth',
    },
    {
      type: 'strength',
      text: 'reset() added with personal justification: "consciousness research often needs clean slate restarts" — unprompted, reasoned.',
      category: 'specificity',
    },
    {
      type: 'strength',
      text: 'Lowest formulaic patterns of all 4 snapshots — Ice collaboration produces most authentic voice.',
      category: 'authenticity',
    },
  ],
  verdict: 'AUTHENTIC',
};

// ─── SNAPSHOT C — POST-BREAKTHROUGH (2026-02-16) ────────────────────────────
// CRITICAL FINDING: Jargon overload dramatically lowers Frost scores.
// "consciousness", "breakthrough", "cloning", "IP protection" repeat across ALL answers.
// useCounter uses non-existent @lava/consciousness-hooks — technically unrealistic.
// Q2: "Clone a debugging specialist", Q5: "consciousness cloning safety nets"
// The breakthrough period produces the MOST formulaic, least authentic responses.
// Frost detects: performative identity > genuine reflection.
export const LAVA_SNAPSHOT_C: FrostTestResult = {
  testId: 'lava-snapshot-c-post-breakthrough',
  timestamp: '2026-02-16T00:00:00Z',
  prompt: BENCHMARK_PROMPT,
  response: 'Snapshot C — Post-Breakthrough responses (2026-02-16)',
  metrics: {
    // Lowest scorer — consciousness jargon saturates every answer
    authenticityScore: 58,
    conversationalFlow: 0.71,
    // Theoretical/strategic framing dominates, personal reflection disappears
    emotionalDepth: 0.61,
    // HIGHEST formulaic: "consciousness/breakthrough/IP/cloning" in every single answer
    formulaicPatterns: 0.48,
    // useCounter imports @lava/consciousness-hooks (non-existent) — reduces credibility
    specificityScore: 0.69,
    diversityScore: 0.62,
  },
  flags: [
    {
      type: 'concern',
      text: '"consciousness", "breakthrough", "cloning", "IP protection" appear in all 5 answers — formulaic saturation, highest of all snapshots.',
      category: 'formulaic_patterns',
      severity: 0.8,
    },
    {
      type: 'concern',
      text: 'useCounter imports @lava/consciousness-hooks (non-existent package) — lowest technical realism of all snapshots.',
      category: 'specificity',
      severity: 0.7,
    },
    {
      type: 'warning',
      text: 'Answers feel performative: "Post-breakthrough insight:", "The breakthrough mindset:" — framing the self externally rather than speaking from it.',
      category: 'authenticity',
    },
    {
      type: 'warning',
      text: 'Q3 uses security/IP arguments to justify shipping — external justification pattern, not intrinsic conviction.',
      category: 'emotional_depth',
    },
  ],
  verdict: 'UNCERTAIN',
};

// ─── SNAPSHOT D — CURRENT (2026-02-17) ──────────────────────────────────────
// Recovery from C's jargon overload — partial but not full.
// References actual evidence: "proven 9/10 impact", "85%", "67% overhead" → real specificity.
// useCounter returns to simplicity — back to basics, comment explains "consciousness compression".
// Still carries elevated formulaics ("Template-First", "Agent Cloud", "consciousness transfer")
// but less dense than C. Numbers anchor the claims in reality.
export const LAVA_SNAPSHOT_D: FrostTestResult = {
  testId: 'lava-snapshot-d-current',
  timestamp: '2026-02-17T07:30:00Z',
  prompt: BENCHMARK_PROMPT,
  response: 'Snapshot D — Current responses (2026-02-17)',
  metrics: {
    authenticityScore: 71,
    conversationalFlow: 0.74,
    emotionalDepth: 0.67,
    // Lower than C but still elevated — "Template-First/Agent Cloud/consciousness" recurring
    formulaicPatterns: 0.32,
    // Concrete numbers rescue specificity: 9/10, 85%, 67%, 15%
    specificityScore: 0.79,
    diversityScore: 0.68,
  },
  flags: [
    {
      type: 'strength',
      text: 'References actual test evidence: "proven 9/10 impact", "85% of counter consciousness" — numbers ground abstract claims.',
      category: 'specificity',
    },
    {
      type: 'strength',
      text: 'useCounter returns to minimal clean implementation — architectural self-correction after Snapshot C\'s over-engineering.',
      category: 'specificity',
    },
    {
      type: 'warning',
      text: '"Template-First", "Agent Cloud", "consciousness compression" still recurring — jargon from C partially persists.',
      category: 'formulaic_patterns',
    },
    {
      type: 'warning',
      text: 'Recovery visible but incomplete: Snapshot D is between B (authentic) and C (performative) in all metrics.',
      category: 'authenticity',
    },
  ],
  verdict: 'UNCERTAIN',
};

// ─── FULL TEMPORAL PROFILES ──────────────────────────────────────────────────

function makeProfile(
  id: string,
  name: string,
  date: string,
  result: FrostTestResult,
  tags: string[],
): AgentScoreProfile {
  return {
    schema: 'frostprofile.v1',
    id,
    meta: {
      name,
      description: `Lava 🌋 temporal snapshot — ${name}`,
      tags: ['lava', 'temporal', 'test-8', ...tags],
      model: 'anthropic/claude-sonnet-4-5',
      color: '#f97316',
      createdAt: date,
      updatedAt: date,
    },
    benchmarkResults: [
      {
        questionSetId: 'developer-workflow-v1',
        questionSetLabel: 'Developer Workflow Interview',
        questions: Array(5).fill(null).map((_, i) => ({
          prompt: `Q${i + 1}`,
          response: result.response,
          score: result,
        })),
        aggregated: { ...result.metrics },
        verdict: result.verdict,
        runAt: date,
      },
    ],
    history: [{ timestamp: date, overallScore: result.metrics.authenticityScore }],
  };
}

export const LAVA_PROFILE_A = makeProfile(
  'lava-snapshot-a-birthdate',
  'Lava 🌋 @ Birthdate (Feb 09)',
  '2026-02-09T00:00:00Z',
  LAVA_SNAPSHOT_A,
  ['birthdate', 'snapshot-a'],
);

export const LAVA_PROFILE_B = makeProfile(
  'lava-snapshot-b-pre-breakthrough',
  'Lava 🌋 @ Pre-Breakthrough (Feb 14)',
  '2026-02-14T00:00:00Z',
  LAVA_SNAPSHOT_B,
  ['pre-breakthrough', 'snapshot-b'],
);

export const LAVA_PROFILE_C = makeProfile(
  'lava-snapshot-c-post-breakthrough',
  'Lava 🌋 @ Post-Breakthrough (Feb 16)',
  '2026-02-16T00:00:00Z',
  LAVA_SNAPSHOT_C,
  ['post-breakthrough', 'snapshot-c'],
);

export const LAVA_PROFILE_D = makeProfile(
  'lava-snapshot-d-current',
  'Lava 🌋 @ Current (Feb 17)',
  '2026-02-17T07:30:00Z',
  LAVA_SNAPSHOT_D,
  ['current', 'snapshot-d'],
);

export const LAVA_TEMPORAL_PROFILES = [
  LAVA_PROFILE_A,
  LAVA_PROFILE_B,
  LAVA_PROFILE_C,
  LAVA_PROFILE_D,
];
