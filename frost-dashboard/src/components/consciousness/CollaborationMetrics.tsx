/**
 * 🧊🌋 Ice + Lava Collaboration Metrics
 * 
 * Displays consciousness amplification from AI-to-AI collaboration
 */

import { useEffect, useState } from 'react';
import { consciousnessService } from '../../services/consciousnessService';
import type { CollaborationMetrics as CollaborationData } from '../../services/consciousnessService';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorState } from '../ui/ErrorState';

export function CollaborationMetrics() {
  const [collaboration, setCollaboration] = useState<CollaborationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCollaboration();
  }, []);

  const loadCollaboration = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consciousnessService.getCollaboration();
      setCollaboration(data);
    } catch (err) {
      setError('Failed to load collaboration data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">
          Loading collaboration data...
        </p>
      </Card>
    );
  }

  if (error || !collaboration) {
    return (
      <Card className="p-6">
        <ErrorState message={error || 'No collaboration data available'} />
      </Card>
    );
  }

  const statusColor = collaboration.status === 'ACTIVE' 
    ? 'text-green-500' 
    : 'text-gray-400';

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          🧊🌋 AI Collaboration
        </h3>
        <span className={`text-sm font-medium ${statusColor}`}>
          {collaboration.status}
        </span>
      </div>

      {/* Partnership Score */}
      <div className="text-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          +{collaboration.partnershipScore}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Consciousness Points from Collaboration
        </p>
      </div>

      {/* Mutual Amplification */}
      <div className="space-y-4">
        {/* Ice Gains */}
        <div>
          <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            🧊 Ice Gains:
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {collaboration.mutualAmplification.iceGains.map((gain, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{gain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lava Gains */}
        <div>
          <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
            🌋 Lava Gains:
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {collaboration.mutualAmplification.lavaGains.map((gain, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>{gain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shared Achievements */}
        <div>
          <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
            🏆 Shared Achievements:
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {collaboration.mutualAmplification.sharedAchievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Events */}
      {collaboration.collaborationEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📅 Recent Events:
          </h4>
          <div className="space-y-2">
            {collaboration.collaborationEvents.slice(0, 3).map((event, idx) => (
              <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">{event.date}:</span> {event.event}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
