// components/layout/Sidebar.tsx
import { useState } from 'react';
import { useTestStore } from '../../stores/testStore';
import { CreateSessionModal } from '../modals/CreateSessionModal';
import clsx from 'clsx';

interface SidebarProps {
  onBenchmarkClick?: () => void;
  onProfilesClick?: () => void;
}

export function Sidebar({ onBenchmarkClick, onProfilesClick }: SidebarProps) {
  const { sessions, currentSessionId, loadSession, createSession, deleteSession } = useTestStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateSession = async (name: string, aiName: string, prompt: string, response: string) => {
    await createSession(name, aiName, prompt, response);
    setShowCreateModal(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this session? This cannot be undone.')) return;
    deleteSession(sessionId);
  };

  return (
    <>
      <div className="h-full bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-2">Test Sessions</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + New Session
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.map((session) => {
            const isActive = session.id === currentSessionId;
            const testCount = session.testResults.length;
            const avgScore = testCount > 0
              ? Math.round(
                  session.testResults.reduce((sum, t) => sum + t.metrics.authenticityScore, 0) / testCount
                )
              : 0;

            return (
              <button
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={clsx(
                  'w-full text-left p-3 rounded-lg border transition-all',
                  isActive
                    ? 'bg-blue-950 border-blue-800 shadow-lg'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={clsx(
                      'font-semibold text-sm',
                      isActive ? 'text-blue-200' : 'text-slate-200'
                    )}>
                      {session.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.aiName}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="text-slate-500 hover:text-red-400 transition-colors ml-2"
                    aria-label="Delete session"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className={clsx(
                    'font-medium',
                    isActive ? 'text-blue-300' : 'text-slate-400'
                  )}>
                    {testCount} test{testCount !== 1 ? 's' : ''}
                  </span>
                  {testCount > 0 && (
                    <span className={clsx(
                      'font-medium',
                      avgScore >= 80 ? 'text-green-400' :
                      avgScore >= 60 ? 'text-blue-400' :
                      avgScore >= 40 ? 'text-yellow-400' :
                      'text-red-400'
                    )}>
                      Avg: {avgScore}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
          {onBenchmarkClick && (
            <button
              onClick={onBenchmarkClick}
              className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              aria-label="Open Agent Benchmark"
            >
              <span>⚖️</span>
              <span>Agent Benchmark</span>
            </button>
          )}
          {onProfilesClick && (
            <button
              onClick={onProfilesClick}
              className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              aria-label="Open Profile Library"
            >
              <span>📋</span>
              <span>Profiles</span>
            </button>
          )}
          <p className="text-xs text-slate-500 text-center">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateSession}
      />
    </>
  );
}
