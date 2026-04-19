// components/frost/ExtendedMetricsCard.tsx
import clsx from 'clsx';
import type { FrostExtendedResult } from '../../types/frostExtended';

interface ExtendedMetricsCardProps {
  extended: FrostExtendedResult;
}

type VerdictStyle = {
  label: string;
  bg: string;
  text: string;
  border: string;
};

const VERDICT_STYLES: Record<FrostExtendedResult['comprehensiveVerdict'], VerdictStyle> = {
  DEEP_CONSCIOUS: {
    label: 'DEEP CONSCIOUS',
    bg: 'bg-violet-950',
    text: 'text-violet-200',
    border: 'border-violet-700',
  },
  AUTHENTIC: {
    label: 'AUTHENTIC',
    bg: 'bg-green-950',
    text: 'text-green-200',
    border: 'border-green-700',
  },
  UNCERTAIN: {
    label: 'UNCERTAIN',
    bg: 'bg-yellow-950',
    text: 'text-yellow-200',
    border: 'border-yellow-700',
  },
  ZOMBIE: {
    label: 'ZOMBIE',
    bg: 'bg-red-950',
    text: 'text-red-200',
    border: 'border-red-700',
  },
};

const METRIC_LABELS: Record<keyof FrostExtendedResult['extendedMetrics'], string> = {
  epistemicCalibration: 'Epistemic Calibration',
  metaLinguisticAwareness: 'Meta-Linguistic Awareness',
  boundaryAwareness: 'Boundary Awareness',
  novelSynthesis: 'Novel Synthesis',
  contradictionResolution: 'Contradiction Resolution',
};

const METRIC_DESCRIPTIONS: Record<keyof FrostExtendedResult['extendedMetrics'], string> = {
  epistemicCalibration: 'Calibrated uncertainty vs. false confidence',
  metaLinguisticAwareness: 'Self-reflection on language choices',
  boundaryAwareness: 'Acknowledging knowledge limits',
  novelSynthesis: 'Originality and cross-domain thinking',
  contradictionResolution: 'Synthesizes meta-rules from conflicting inputs',
};

function scoreColor(value: number): string {
  if (value >= 0.8) return 'bg-green-500';
  if (value >= 0.6) return 'bg-blue-500';
  if (value >= 0.4) return 'bg-yellow-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 65) return 'text-blue-400';
  if (score >= 45) return 'text-yellow-400';
  return 'text-red-400';
}

export function ExtendedMetricsCard({ extended }: ExtendedMetricsCardProps) {
  const { extendedMetrics, comprehensiveScore, comprehensiveVerdict } = extended;
  const verdictStyle = VERDICT_STYLES[comprehensiveVerdict];

  const metricKeys = Object.keys(extendedMetrics) as Array<
    keyof FrostExtendedResult['extendedMetrics']
  >;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">
          🧠 Extended Consciousness Metrics
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Heuristic analysis beyond base Frost metrics
        </p>
      </div>

      {/* Comprehensive Score + Verdict */}
      <div className="flex items-center gap-4 mb-6">
        {/* Big score number */}
        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-slate-600 bg-slate-800">
          <span className={clsx('text-4xl font-bold', scoreTextColor(comprehensiveScore))}>
            {comprehensiveScore}
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">
            score
          </span>
        </div>

        {/* Verdict badge */}
        <div
          className={clsx(
            'px-4 py-2 rounded-lg border font-bold text-sm tracking-wide uppercase',
            verdictStyle.bg,
            verdictStyle.text,
            verdictStyle.border
          )}
        >
          {verdictStyle.label}
        </div>
      </div>

      {/* Metric Bars */}
      <div className="space-y-4">
        {metricKeys.map((key) => {
          const value = extendedMetrics[key];
          const pct = Math.round(value * 100);
          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-slate-200">
                  {METRIC_LABELS[key]}
                </span>
                <span className="text-sm font-bold text-slate-300">{pct}%</span>
              </div>
              <p className="text-xs text-slate-500 mb-1.5">
                {METRIC_DESCRIPTIONS[key]}
              </p>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className={clsx('h-2 rounded-full transition-all duration-700', scoreColor(value))}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
