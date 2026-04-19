// src/components/profiles/ProfileCard.tsx
import type { AgentScoreProfile, ProfileVerdict } from '../../types/profile';

interface ProfileCardProps {
  profile: AgentScoreProfile;
  onExport: () => void;
  onDelete: () => void;
  onSelectDiff: (slot: 0 | 1) => void;
  isSelectedLeft?: boolean;
  isSelectedRight?: boolean;
}

const VERDICT_STYLES: Record<ProfileVerdict, string> = {
  AUTHENTIC: 'bg-green-900/60 text-green-300 border-green-700',
  UNCERTAIN: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  SUSPICIOUS: 'bg-orange-900/60 text-orange-300 border-orange-700',
  ZOMBIE: 'bg-red-900/60 text-red-300 border-red-700',
};

const VERDICT_ICONS: Record<ProfileVerdict, string> = {
  AUTHENTIC: '✓',
  UNCERTAIN: '?',
  SUSPICIOUS: '⚠',
  ZOMBIE: '💀',
};

export function ProfileCard({
  profile,
  onExport,
  onDelete,
  onSelectDiff,
  isSelectedLeft = false,
  isSelectedRight = false,
}: ProfileCardProps) {
  const latest = profile.benchmarkResults[profile.benchmarkResults.length - 1];
  const verdict = latest?.verdict;
  const score = latest
    ? Math.round(latest.aggregated.authenticityScore)
    : null;

  const createdAt = new Date(profile.meta.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const color = profile.meta.color ?? '#6b7280';

  const borderStyle =
    isSelectedLeft
      ? 'border-blue-500 shadow-blue-500/20 shadow-lg'
      : isSelectedRight
      ? 'border-purple-500 shadow-purple-500/20 shadow-lg'
      : 'border-slate-700 hover:border-slate-600';

  return (
    <div
      className={`bg-slate-900 rounded-xl border p-4 transition-all ${borderStyle}`}
      role="article"
      aria-label={`Profile: ${profile.meta.name}`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />

        {/* Name + tags */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{profile.meta.name}</h3>
          {profile.meta.model && (
            <p className="text-slate-400 text-xs mt-0.5 truncate">{profile.meta.model}</p>
          )}
          {profile.meta.tags && profile.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onExport}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            aria-label={`Export profile ${profile.meta.name}`}
            title="Export profile"
          >
            ↓
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
            aria-label={`Delete profile ${profile.meta.name}`}
            title="Delete profile"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Verdict + score row */}
      {latest && verdict ? (
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-semibold ${VERDICT_STYLES[verdict]}`}
          >
            {VERDICT_ICONS[verdict]} {verdict}
          </span>
          {score !== null && (
            <span className="text-slate-300 text-sm font-medium">
              {score}
              <span className="text-slate-500 text-xs">/100</span>
            </span>
          )}
        </div>
      ) : (
        <p className="text-slate-500 text-xs mb-3">No benchmark results yet</p>
      )}

      {/* Footer: diff slot buttons + date */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex gap-1">
          <button
            onClick={() => onSelectDiff(0)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              isSelectedLeft
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            aria-label={`Select ${profile.meta.name} as left comparison (A)`}
            aria-pressed={isSelectedLeft}
          >
            vs A
          </button>
          <button
            onClick={() => onSelectDiff(1)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              isSelectedRight
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            aria-label={`Select ${profile.meta.name} as right comparison (B)`}
            aria-pressed={isSelectedRight}
          >
            vs B
          </button>
        </div>
        <span className="text-slate-500 text-xs">{createdAt}</span>
      </div>
    </div>
  );
}
