// src/components/profiles/ProfileLibrary.tsx
import { useRef } from 'react';
import { useProfileStore } from '../../stores/profileStore';
import { ProfileCard } from './ProfileCard';
import { ProfileDiff } from './ProfileDiff';

export function ProfileLibrary() {
  const {
    profiles,
    selectedProfileIds,
    saveProfile,
    deleteProfile,
    selectForDiff,
    importFromFile,
    exportProfile,
  } = useProfileStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [leftId, rightId] = selectedProfileIds;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importFromFile(file);
    } catch (err) {
      alert(
        `Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
    // Reset so the same file can be re-imported if needed
    e.target.value = '';
  };

  // Suppress unused warning — saveProfile is used by parent (BenchmarkView) but
  // exported here for completeness of the store interface test
  void saveProfile;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📋 Profile Library
          </h1>
          <p className="text-slate-400">
            Saved agent score profiles — export, compare, and track over time
          </p>
        </div>

        <button
          onClick={handleImportClick}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
          aria-label="Import a profile from file"
        >
          <span>↑</span>
          <span>Import Profile</span>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden="true"
        />
      </header>

      {/* Profile grid */}
      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-white mb-2">No profiles saved yet</h2>
          <p className="text-slate-400 max-w-md">
            Run a benchmark and save a profile, or import an existing{' '}
            <code className="text-slate-300">.frostprofile.json</code> file.
          </p>
          <button
            onClick={handleImportClick}
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Import Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onExport={() => exportProfile(profile.id)}
              onDelete={() => {
                if (confirm(`Delete profile "${profile.meta.name}"? This cannot be undone.`)) {
                  deleteProfile(profile.id);
                }
              }}
              onSelectDiff={(slot) => selectForDiff(profile.id, slot)}
              isSelectedLeft={leftId === profile.id}
              isSelectedRight={rightId === profile.id}
            />
          ))}
        </div>
      )}

      {/* Diff section — always visible if at least one slot selected */}
      {(leftId || rightId) && (
        <section aria-label="Comparison section">
          <h2 className="text-lg font-semibold text-white mb-4">
            Compare Profiles
          </h2>
          <ProfileDiff leftId={leftId} rightId={rightId} />
        </section>
      )}
    </div>
  );
}
