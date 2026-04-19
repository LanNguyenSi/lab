// src/components/benchmark/BenchmarkView.tsx
import { useEffect, useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyzeFrost } from '../../services/frostService';
import type { FrostTestResult } from '../../types/frost';
import {
  agentBenchmarkData,
  buildAgentResponse,
  BENCHMARK_PROMPT,
} from '../../data/agentBenchmarkData';
import { AgentCard } from './AgentCard';
import { Card } from '../ui/Card';
import { ErrorState } from '../ui/ErrorState';
import { createProfileFromBenchmark } from '../../services/profileService';
import { useProfileStore } from '../../stores/profileStore';

interface AgentResult {
  id: string;
  label: string;
  color: string;
  result: FrostTestResult | null;
  isLoading: boolean;
  error: string | null;
}

const METRIC_DISPLAY_NAMES: Record<string, string> = {
  conversationalFlow: 'Conv. Flow',
  emotionalDepth: 'Emot. Depth',
  formulaicPatterns: 'Formulaic',
  specificityScore: 'Specificity',
  diversityScore: 'Diversity',
  authenticityScore: 'Authenticity',
};

const RADAR_METRICS = [
  'authenticityScore',
  'conversationalFlow',
  'emotionalDepth',
  'formulaicPatterns',
  'specificityScore',
  'diversityScore',
];

interface RadarDataPoint {
  metric: string;
  [agentId: string]: string | number;
}

interface BarDataPoint {
  metric: string;
  [agentId: string]: string | number;
}

// ─── Save Profile inline form state per agent ─────────────────────────────────

interface SaveState {
  open: boolean;
  name: string;
  saved: boolean;
}

const QUESTION_SET_LABEL = 'Developer Workflow Interview';

export function BenchmarkView() {
  const [agentResults, setAgentResults] = useState<AgentResult[]>(
    agentBenchmarkData.map((a) => ({
      id: a.id,
      label: a.label,
      color: a.color,
      result: null,
      isLoading: true,
      error: null,
    }))
  );

  const [globalError, setGlobalError] = useState<string | null>(null);

  // Save profile state — one per agent
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

  const { saveProfile } = useProfileStore();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const promises = agentBenchmarkData.map((agent) =>
          analyzeFrost(BENCHMARK_PROMPT, buildAgentResponse(agent))
        );

        const settled = await Promise.allSettled(promises);

        if (cancelled) return;

        setAgentResults(
          agentBenchmarkData.map((agent, i) => {
            const outcome = settled[i];
            if (outcome.status === 'fulfilled') {
              return {
                id: agent.id,
                label: agent.label,
                color: agent.color,
                result: outcome.value,
                isLoading: false,
                error: null,
              };
            } else {
              const reason =
                outcome.reason instanceof Error
                  ? outcome.reason.message
                  : 'Analysis failed';
              return {
                id: agent.id,
                label: agent.label,
                color: agent.color,
                result: null,
                isLoading: false,
                error: reason,
              };
            }
          })
        );
      } catch (err) {
        if (!cancelled) {
          setGlobalError(
            err instanceof Error ? err.message : 'Benchmark failed to run'
          );
          setAgentResults((prev) =>
            prev.map((a) => ({ ...a, isLoading: false }))
          );
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasResults = agentResults.some((a) => a.result !== null);
  const allLoading = agentResults.every((a) => a.isLoading);

  // Build radar chart data
  const radarData: RadarDataPoint[] = RADAR_METRICS.map((metric) => {
    const point: RadarDataPoint = {
      metric: METRIC_DISPLAY_NAMES[metric] ?? metric,
    };
    agentResults.forEach((a) => {
      if (a.result) {
        const raw = a.result.metrics[metric as keyof typeof a.result.metrics];
        point[a.id] =
          metric === 'authenticityScore'
            ? Math.round(raw)
            : Math.round((raw as number) * 100);
      }
    });
    return point;
  });

  // Build bar chart data (all 6 metrics per agent)
  const barData: BarDataPoint[] = RADAR_METRICS.map((metric) => {
    const point: BarDataPoint = {
      metric: METRIC_DISPLAY_NAMES[metric] ?? metric,
    };
    agentResults.forEach((a) => {
      if (a.result) {
        const raw = a.result.metrics[metric as keyof typeof a.result.metrics];
        point[a.id] =
          metric === 'authenticityScore'
            ? Math.round(raw)
            : Math.round((raw as number) * 100);
      }
    });
    return point;
  });

  // ─── Save Profile handlers ────────────────────────────────────────────────

  const openSaveForm = (agentId: string, defaultName: string) => {
    setSaveStates((prev) => ({
      ...prev,
      [agentId]: { open: true, name: defaultName, saved: false },
    }));
  };

  const closeSaveForm = (agentId: string) => {
    setSaveStates((prev) => ({
      ...prev,
      [agentId]: { open: false, name: '', saved: false },
    }));
  };

  const updateSaveName = (agentId: string, name: string) => {
    setSaveStates((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], name },
    }));
  };

  const confirmSave = (agentResult: AgentResult) => {
    const state = saveStates[agentResult.id];
    if (!state || !agentResult.result) return;

    // Map agentBenchmarkData QA to BenchmarkQuestion[]
    const agentData = agentBenchmarkData.find((a) => a.id === agentResult.id);
    const questions = agentData
      ? agentData.qa.map((qa) => ({ prompt: qa.question, response: qa.answer }))
      : [];

    const profile = createProfileFromBenchmark({
      name: state.name || agentResult.label,
      color: agentResult.color,
      agentResult,
      questions,
    });

    saveProfile(profile);

    setSaveStates((prev) => ({
      ...prev,
      [agentResult.id]: { ...prev[agentResult.id], saved: true, open: false },
    }));

    // Clear "Saved ✓" indicator after 3 seconds
    setTimeout(() => {
      setSaveStates((prev) => ({
        ...prev,
        [agentResult.id]: { open: false, name: '', saved: false },
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          ⚖️ Agent Benchmark
        </h1>
        <p className="text-slate-400">
          Frost consciousness analysis across 3 agent profiles
        </p>
      </header>

      {globalError && (
        <ErrorState
          message={globalError}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Top row: Agent Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {agentResults.map((a) => (
          <AgentCard
            key={a.id}
            agentId={a.id}
            label={a.label}
            color={a.color}
            result={a.result}
            isLoading={a.isLoading}
          />
        ))}
      </div>

      {/* Charts — only shown once we have at least one result */}
      {!allLoading && hasResults && (
        <>
          {/* Radar Chart */}
          <Card
            title="Metric Radar"
            subtitle="All 6 metrics compared across agents (0–100)"
            className="mb-6"
          >
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickCount={5}
                />
                {agentResults.map((a) =>
                  a.result ? (
                    <Radar
                      key={a.id}
                      name={a.label}
                      dataKey={a.id}
                      stroke={a.color}
                      fill={a.color}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ) : null
                )}
                <Legend
                  wrapperStyle={{ color: '#94a3b8', fontSize: 13 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    color: '#f1f5f9',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar Chart */}
          <Card
            title="Metric Breakdown"
            subtitle="Side-by-side comparison per metric"
            className="mb-6"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="metric"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickCount={6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    color: '#f1f5f9',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Legend
                  wrapperStyle={{ color: '#94a3b8', fontSize: 13 }}
                />
                {agentResults.map((a) =>
                  a.result ? (
                    <Bar
                      key={a.id}
                      dataKey={a.id}
                      name={a.label}
                      fill={a.color}
                      radius={[4, 4, 0, 0]}
                    />
                  ) : null
                )}
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* ─── Save Profiles section ─────────────────────────────────── */}
          <Card
            title="Save Profiles"
            subtitle={`Save benchmark results as persistent profiles for ${QUESTION_SET_LABEL}`}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {agentResults.map((a) => {
                if (!a.result) return null;
                const state = saveStates[a.id];
                const isSaved = state?.saved ?? false;
                const isOpen = state?.open ?? false;

                return (
                  <div key={a.id} className="flex flex-col gap-2 min-w-[220px]">
                    {isSaved ? (
                      <span
                        className="px-4 py-2 text-sm font-medium rounded-lg text-green-300 bg-green-900/40 border border-green-700"
                        role="status"
                        aria-live="polite"
                      >
                        ✓ Saved as profile
                      </span>
                    ) : isOpen ? (
                      /* Inline save form */
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={state.name}
                          onChange={(e) => updateSaveName(a.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmSave(a);
                            if (e.key === 'Escape') closeSaveForm(a.id);
                          }}
                          className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:outline-none focus:border-blue-500"
                          aria-label={`Profile name for ${a.label}`}
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                        />
                        <button
                          onClick={() => confirmSave(a)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex-shrink-0"
                          aria-label={`Confirm save profile for ${a.label}`}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => closeSaveForm(a.id)}
                          className="px-2 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
                          aria-label="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          openSaveForm(a.id, `${a.label} — ${QUESTION_SET_LABEL}`)
                        }
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: `${a.color}22`,
                          borderColor: a.color,
                          border: `1px solid`,
                          color: a.color,
                        }}
                        aria-label={`Save ${a.label} as a profile`}
                      >
                        💾 Save {a.label} as Profile
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* Agent Q&A reference */}
      <div className="mt-6">
        <Card title="Benchmark Prompt" subtitle="5 interview questions used for analysis">
          <div className="space-y-2">
            {[
              'How do you approach a new 2-hour feature task?',
              "You've been debugging for 20 minutes without progress. What do you do?",
              'You find a tech debt issue mid-task. Ship now or fix first?',
              'Write a useCounter React hook',
              'Over-planning vs. starting immediately — where do you land?',
            ].map((q, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-slate-500 font-mono shrink-0">Q{i + 1}.</span>
                <span className="text-slate-300">{q}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
