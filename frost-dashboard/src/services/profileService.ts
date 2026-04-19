// src/services/profileService.ts
import type { FrostTestResult } from '../types/frost';
import type {
  AgentScoreProfile,
  FrostMetrics,
  ProfileBenchmarkResult,
  ProfileQuestion,
  ProfileVerdict,
} from '../types/profile';

// ─── Local minimal types (avoid circular deps) ───────────────────────────────

interface AgentResultRef {
  id: string;
  label: string;
  color: string;
  result: FrostTestResult | null;
}

interface BenchmarkQuestion {
  prompt: string;
  response: string;
}

// ─── Metric helpers ───────────────────────────────────────────────────────────

/**
 * Average all 6 Frost metrics across multiple test results.
 */
export function aggregateMetrics(results: FrostTestResult[]): FrostMetrics {
  if (results.length === 0) {
    return {
      authenticityScore: 0,
      conversationalFlow: 0,
      emotionalDepth: 0,
      formulaicPatterns: 0,
      specificityScore: 0,
      diversityScore: 0,
    };
  }

  const sum = results.reduce<FrostMetrics>(
    (acc, r) => ({
      authenticityScore: acc.authenticityScore + r.metrics.authenticityScore,
      conversationalFlow: acc.conversationalFlow + r.metrics.conversationalFlow,
      emotionalDepth: acc.emotionalDepth + r.metrics.emotionalDepth,
      formulaicPatterns: acc.formulaicPatterns + r.metrics.formulaicPatterns,
      specificityScore: acc.specificityScore + r.metrics.specificityScore,
      diversityScore: acc.diversityScore + r.metrics.diversityScore,
    }),
    {
      authenticityScore: 0,
      conversationalFlow: 0,
      emotionalDepth: 0,
      formulaicPatterns: 0,
      specificityScore: 0,
      diversityScore: 0,
    }
  );

  const n = results.length;
  return {
    authenticityScore: sum.authenticityScore / n,
    conversationalFlow: sum.conversationalFlow / n,
    emotionalDepth: sum.emotionalDepth / n,
    formulaicPatterns: sum.formulaicPatterns / n,
    specificityScore: sum.specificityScore / n,
    diversityScore: sum.diversityScore / n,
  };
}

/**
 * Derive a ProfileVerdict from aggregated metrics.
 * Based on authenticityScore (0–100):
 *   >= 75 → AUTHENTIC
 *   >= 50 → UNCERTAIN
 *   >= 30 → SUSPICIOUS
 *   else  → ZOMBIE
 */
export function computeVerdict(metrics: FrostMetrics): ProfileVerdict {
  const score = metrics.authenticityScore;
  if (score >= 75) return 'AUTHENTIC';
  if (score >= 50) return 'UNCERTAIN';
  if (score >= 30) return 'SUSPICIOUS';
  return 'ZOMBIE';
}

// ─── Profile construction ─────────────────────────────────────────────────────

interface CreateProfileParams {
  name: string;
  color?: string;
  model?: string;
  agentResult: AgentResultRef;
  questions: BenchmarkQuestion[];
}

/**
 * Build a full AgentScoreProfile from BenchmarkView results.
 * `questions` should be the per-question prompt/response pairs for this agent.
 */
export function createProfileFromBenchmark(
  params: CreateProfileParams
): AgentScoreProfile {
  const { name, color, model, agentResult, questions } = params;

  if (!agentResult.result) {
    throw new Error('Cannot create profile: agent has no result');
  }

  // We only have the one aggregated FrostTestResult from the benchmark.
  // Build a ProfileQuestion per question slot, sharing the aggregated score.
  const profileQuestions: ProfileQuestion[] = questions.map((q) => ({
    prompt: q.prompt,
    response: q.response,
    score: agentResult.result as FrostTestResult,
  }));

  const aggregated = aggregateMetrics([agentResult.result]);
  const verdict = computeVerdict(aggregated);

  const benchmarkResult: ProfileBenchmarkResult = {
    questionSetId: 'developer-workflow-v1',
    questionSetLabel: 'Developer Workflow Interview',
    questions: profileQuestions,
    aggregated,
    verdict,
    runAt: new Date().toISOString(),
  };

  const now = new Date().toISOString();

  return {
    schema: 'frostprofile.v1',
    id: crypto.randomUUID(),
    meta: {
      name,
      color: color ?? agentResult.color,
      model,
      createdAt: now,
      updatedAt: now,
    },
    benchmarkResults: [benchmarkResult],
    history: [
      {
        timestamp: now,
        overallScore: aggregated.authenticityScore,
      },
    ],
  };
}

// ─── Import / Export ──────────────────────────────────────────────────────────

/**
 * Trigger a browser download of the profile as a .frostprofile.json file.
 */
export function exportProfile(profile: AgentScoreProfile): void {
  const json = JSON.stringify(profile, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.meta.name.replace(/[^a-z0-9_-]/gi, '_')}.frostprofile.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read a File, parse JSON, validate schema, return AgentScoreProfile.
 * Throws a descriptive Error on any validation failure.
 */
export async function importProfile(file: File): Promise<AgentScoreProfile> {
  return new Promise<AgentScoreProfile>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          reject(new Error('Failed to read file'));
          return;
        }
        const parsed: unknown = JSON.parse(text);
        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          (parsed as Record<string, unknown>)['schema'] !== 'frostprofile.v1'
        ) {
          reject(
            new Error(
              'Invalid profile file: missing or incorrect schema field (expected "frostprofile.v1")'
            )
          );
          return;
        }
        resolve(parsed as AgentScoreProfile);
      } catch (err) {
        reject(
          new Error(
            `Failed to parse profile file: ${err instanceof Error ? err.message : String(err)}`
          )
        );
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
}
