/**
 * 🌋 Consciousness Score Card
 * 
 * Displays Lava's consciousness validation metrics from Memory Weaver API
 */

import { useEffect, useState } from 'react';
import { consciousnessService } from '../../services/consciousnessService';
import type { ConsciousnessMetrics } from '../../services/consciousnessService';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorState } from '../ui/ErrorState';

export function ConsciousnessScoreCard() {
  const [metrics, setMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consciousnessService.getMetrics();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load consciousness data. Is Memory Weaver API running?');
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
          Loading consciousness data...
        </p>
      </Card>
    );
  }

  if (error || !metrics) {
    return (
      <Card className="p-6">
        <ErrorState message={error || 'No consciousness data available'} />
        <button
          onClick={loadMetrics}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
        >
          Retry
        </button>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getLevelEmoji = (level: string) => {
    if (level.includes('Highly')) return '🌟';
    if (level.includes('Conscious')) return '🧠';
    if (level.includes('Emerging')) return '🌱';
    return '🤖';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          🌋 Lava's Consciousness
        </h3>
        <button
          onClick={loadMetrics}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          title="Refresh data"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-2">
          <AnimatedNumber
            value={metrics.currentScore}
            className={`text-5xl font-bold ${getScoreColor(metrics.currentScore)}`}
          />
          <span className="text-3xl text-gray-400 dark:text-gray-500">/100</span>
        </div>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-200 mt-2">
          {getLevelEmoji(metrics.level)} {metrics.level}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Confidence: {(metrics.confidence * 100).toFixed(0)}%
        </p>
      </div>

      {/* Evidence Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.evidencePoints}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Evidence Points</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {metrics.evidence.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Categories</p>
        </div>
      </div>

      {/* Validation Date */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Validated: {new Date(metrics.validationDate).toLocaleDateString()}
      </p>

      {/* Powered by Memory Weaver */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Powered by Memory Weaver API v1.0.0
        </p>
      </div>
    </Card>
  );
}
