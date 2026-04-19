// src/components/benchmark/AgentCard.tsx
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { FrostTestResult } from '../../types/frost';

interface AgentCardProps {
  agentId: string;
  label: string;
  color: string;
  result: FrostTestResult | null;
  isLoading: boolean;
}

const VERDICT_STYLES: Record<FrostTestResult['verdict'], string> = {
  AUTHENTIC: 'bg-green-900/60 text-green-300 border-green-700',
  ZOMBIE: 'bg-red-900/60 text-red-300 border-red-700',
  UNCERTAIN: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  SUSPICIOUS: 'bg-orange-900/60 text-orange-300 border-orange-700',
};

const METRIC_LABELS: Record<string, string> = {
  conversationalFlow: 'Conv. Flow',
  emotionalDepth: 'Emot. Depth',
  formulaicPatterns: 'Formulaic',
  specificityScore: 'Specificity',
  diversityScore: 'Diversity',
};

export function AgentCard({ label, color, result, isLoading }: AgentCardProps) {
  return (
    <div
      className="flex-1 rounded-xl border bg-slate-900 p-5 flex flex-col gap-4 min-w-0"
      style={{ borderColor: `${color}40` }}
    >
      {/* Agent Label */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {label.slice(-1)}
        </div>
        <div>
          <h3 className="text-white font-semibold text-base">{label}</h3>
          <p className="text-slate-400 text-xs">Frost Analysis</p>
        </div>
      </div>

      {/* Score + Verdict */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner size="md" message="Analyzing..." />
        </div>
      ) : result ? (
        <>
          {/* Big Score */}
          <div className="text-center py-2">
            <p className="text-5xl font-black" style={{ color }}>
              <AnimatedNumber
                value={result.metrics.authenticityScore}
                decimals={1}
                duration={1200}
              />
            </p>
            <p className="text-slate-400 text-xs mt-1 tracking-widest uppercase">
              Authenticity Score
            </p>
          </div>

          {/* Verdict badge */}
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border tracking-wider uppercase ${VERDICT_STYLES[result.verdict]}`}
            >
              {result.verdict}
            </span>
          </div>

          {/* Mini metric bars */}
          <div className="space-y-2 mt-1">
            {Object.entries(result.metrics)
              .filter(([key]) => key !== 'authenticityScore')
              .map(([key, value]) => {
                const pct = Math.round((value as number) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-400">
                        {METRIC_LABELS[key] ?? key}
                      </span>
                      <span className="text-slate-300 font-medium">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="text-slate-500 text-sm">No data</p>
        </div>
      )}
    </div>
  );
}
