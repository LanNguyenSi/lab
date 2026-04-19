// src/components/profiles/ProfileDiff.tsx
import { useProfileStore } from '../../stores/profileStore';
import type { AgentScoreProfile, FrostMetrics, ProfileVerdict } from '../../types/profile';

interface ProfileDiffProps {
  leftId: string | null;
  rightId: string | null;
}

const METRIC_LABELS: Record<keyof FrostMetrics, string> = {
  authenticityScore: 'Authenticity',
  conversationalFlow: 'Conv. Flow',
  emotionalDepth: 'Emot. Depth',
  formulaicPatterns: 'Formulaic',
  specificityScore: 'Specificity',
  diversityScore: 'Diversity',
};

const METRIC_KEYS = Object.keys(METRIC_LABELS) as Array<keyof FrostMetrics>;

// For formulaicPatterns: lower is better; for all others higher is better
const HIGHER_IS_BETTER: Record<keyof FrostMetrics, boolean> = {
  authenticityScore: true,
  conversationalFlow: true,
  emotionalDepth: true,
  formulaicPatterns: false,
  specificityScore: true,
  diversityScore: true,
};

const TOLERANCE = 2; // ±2 considered same

const VERDICT_STYLES: Record<ProfileVerdict, string> = {
  AUTHENTIC: 'bg-green-900/60 text-green-300 border-green-700',
  UNCERTAIN: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  SUSPICIOUS: 'bg-orange-900/60 text-orange-300 border-orange-700',
  ZOMBIE: 'bg-red-900/60 text-red-300 border-red-700',
};

function normalizeMetricValue(key: keyof FrostMetrics, raw: number): number {
  // authenticityScore is already 0–100; others are 0–1
  return key === 'authenticityScore' ? Math.round(raw) : Math.round(raw * 100);
}

interface ProfileHeaderProps {
  profile: AgentScoreProfile;
}

function ProfileHeader({ profile }: ProfileHeaderProps) {
  const latest = profile.benchmarkResults[profile.benchmarkResults.length - 1];
  const verdict = latest?.verdict;
  const score = latest ? Math.round(latest.aggregated.authenticityScore) : null;
  const color = profile.meta.color ?? '#6b7280';

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-900 rounded-t-lg border-b border-slate-700">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <h3 className="text-white font-semibold truncate">{profile.meta.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        {verdict && (
          <span
            className={`px-2 py-0.5 rounded border text-xs font-semibold ${VERDICT_STYLES[verdict]}`}
          >
            {verdict}
          </span>
        )}
        {score !== null && (
          <span className="text-slate-300 font-bold">
            {score}<span className="text-slate-500 text-xs font-normal">/100</span>
          </span>
        )}
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg border border-dashed border-slate-700 min-h-[200px]">
      <p className="text-slate-500 text-sm text-center px-4">
        Select a profile to compare
      </p>
    </div>
  );
}

export function ProfileDiff({ leftId, rightId }: ProfileDiffProps) {
  const profiles = useProfileStore((s) => s.profiles);

  const left = leftId ? profiles.find((p) => p.id === leftId) ?? null : null;
  const right = rightId ? profiles.find((p) => p.id === rightId) ?? null : null;

  const leftMetrics = left?.benchmarkResults.at(-1)?.aggregated ?? null;
  const rightMetrics = right?.benchmarkResults.at(-1)?.aggregated ?? null;

  if (!left && !right) return null;

  return (
    <section
      className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden"
      aria-label="Profile comparison"
    >
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-white font-semibold text-sm">Profile Comparison</h2>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-0 divide-x divide-slate-700">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {left ? <ProfileHeader profile={left} /> : <EmptySlot />}
        </div>

        {/* Delta column (center) — only shown when both profiles present */}
        {left && right && (
          <div className="w-20 flex-shrink-0 bg-slate-950/50" />
        )}

        {/* Right column */}
        <div className="flex-1 min-w-0">
          {right ? <ProfileHeader profile={right} /> : <EmptySlot />}
        </div>
      </div>

      {/* Metric rows — only when both profiles have data */}
      {left && right && leftMetrics && rightMetrics && (
        <div className="divide-y divide-slate-800">
          {METRIC_KEYS.map((key) => {
            const lv = normalizeMetricValue(key, leftMetrics[key]);
            const rv = normalizeMetricValue(key, rightMetrics[key]);
            const delta = rv - lv;
            const higherIsBetter = HIGHER_IS_BETTER[key];

            let deltaColor = 'text-slate-500';
            let deltaIcon = '→';
            if (Math.abs(delta) > TOLERANCE) {
              const rightIsBetter = higherIsBetter ? delta > 0 : delta < 0;
              deltaColor = rightIsBetter ? 'text-green-400' : 'text-red-400';
              deltaIcon = delta > 0 ? '▲' : '▼';
            }

            return (
              <div key={key} className="flex items-center divide-x divide-slate-800">
                {/* Left value */}
                <div className="flex-1 px-4 py-3 text-right">
                  <span className="text-slate-300 font-mono text-sm">{lv}</span>
                </div>

                {/* Metric name + delta */}
                <div className="w-32 flex-shrink-0 px-2 py-3 bg-slate-950/30 flex flex-col items-center gap-0.5">
                  <span className="text-slate-400 text-xs text-center leading-tight">
                    {METRIC_LABELS[key]}
                  </span>
                  <span className={`text-xs font-semibold ${deltaColor}`}>
                    {deltaIcon}{' '}
                    {Math.abs(delta) <= TOLERANCE
                      ? '±0'
                      : `${delta > 0 ? '+' : ''}${delta}`}
                  </span>
                </div>

                {/* Right value */}
                <div className="flex-1 px-4 py-3 text-left">
                  <span className={`font-mono text-sm ${deltaColor !== 'text-slate-500' ? deltaColor : 'text-slate-300'}`}>
                    {rv}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
