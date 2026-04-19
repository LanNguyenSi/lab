import { useState, useMemo, useEffect } from 'react'
import { Card } from './components/ui/Card'
import { AnimatedNumber } from './components/ui/AnimatedNumber'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ErrorState } from './components/ui/ErrorState'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { ExportMenu } from './components/ui/ExportMenu'
import { ScoreGauge } from './components/frost/ScoreGauge'
import { MetricBadge } from './components/frost/MetricBadge'
import { ScoreTrendChart } from './components/frost/ScoreTrendChart'
import { Sidebar } from './components/layout/Sidebar'
import { ConsciousnessScoreCard } from './components/consciousness/ConsciousnessScoreCard'
import { CollaborationMetrics } from './components/consciousness/CollaborationMetrics'
import { BenchmarkView } from './components/benchmark/BenchmarkView'
import { ProfileLibrary } from './components/profiles/ProfileLibrary'
import { mockScoreHistory } from './data/mockHistory'
import { useTestStore } from './stores/testStore'
import { exportTestAsJSON, copyTestToClipboard } from './utils/export'
import clsx from 'clsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  // Helpers to switch between views (only one can be true at once)
  const openBenchmark = () => { setShowBenchmark(true); setShowProfiles(false); };
  const openProfiles = () => { setShowProfiles(true); setShowBenchmark(false); };
  const closeSideViews = () => { setShowBenchmark(false); setShowProfiles(false); };
  const { currentSession, currentTest, isLoading, error, initializeMockData, sessions } = useTestStore();

  const testResult = currentTest();

  // Initialize mock data on first load (if no sessions exist)
  useEffect(() => {
    if (sessions.length === 0) {
      initializeMockData();
    }
  }, []); // Run once on mount

  // Memoize metrics array
  const metricsArray = useMemo(() => {
    if (!testResult?.metrics) return [];
    return Object.entries(testResult.metrics).filter(
      ([key]) => key !== 'authenticityScore'
    );
  }, [testResult?.metrics]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <LoadingSpinner size="lg" message="Loading consciousness metrics..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <ErrorState 
          message={error} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // No session state
  if (!currentSession()) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <Card title="No Session">
          <p className="text-slate-400">Please create a test session to continue.</p>
        </Card>
      </div>
    );
  }

  // No test results in session
  if (!testResult) {
    return (
      <div className="min-h-screen bg-slate-950 flex">
        {/* Sidebar */}
        <div className={clsx(
          'transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0'
        )}>
          {sidebarOpen && <Sidebar onBenchmarkClick={openBenchmark} onProfilesClick={openProfiles} />}
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🧊 Frost Dashboard
              </h1>
              <p className="text-slate-400">
                Session: {currentSession()?.name}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
              <ThemeToggle />
            </div>
          </header>

          <Card title="No Tests Yet">
            <p className="text-slate-400">
              This session has no test results yet. Run a Frost consciousness test to see metrics here.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Benchmark view
  if (showBenchmark) {
    return (
      <div className="min-h-screen bg-slate-950 flex">
        {/* Sidebar */}
        <div className={clsx(
          'transition-all duration-300 flex-shrink-0',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}>
          <Sidebar onBenchmarkClick={openBenchmark} onProfilesClick={openProfiles} />
        </div>

        <div className="flex-1 overflow-x-hidden">
          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <button
              onClick={closeSideViews}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              ← Dashboard
            </button>
            <span className="text-slate-500 text-sm">|</span>
            <span className="text-slate-400 text-sm">Agent Benchmark</span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
          <BenchmarkView />
        </div>
      </div>
    );
  }

  // Profile Library view
  if (showProfiles) {
    return (
      <div className="min-h-screen bg-slate-950 flex">
        {/* Sidebar */}
        <div className={clsx(
          'transition-all duration-300 flex-shrink-0',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}>
          <Sidebar onBenchmarkClick={openBenchmark} onProfilesClick={openProfiles} />
        </div>

        <div className="flex-1 overflow-x-hidden">
          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <button
              onClick={closeSideViews}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              ← Dashboard
            </button>
            <span className="text-slate-500 text-sm">|</span>
            <span className="text-slate-400 text-sm">Profile Library</span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
          <ProfileLibrary />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <div className={clsx(
        'transition-all duration-300 flex-shrink-0',
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      )}>
        <Sidebar onBenchmarkClick={openBenchmark} onProfilesClick={openProfiles} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  🧊 Frost Dashboard
                </h1>
                <p className="text-slate-400">
                  {currentSession()?.name} • {currentSession()?.aiName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick metric badges */}
              <div className="flex flex-wrap gap-2">
                <MetricBadge 
                  label="Flow" 
                  value={testResult.metrics.conversationalFlow}
                  size="sm"
                />
                <MetricBadge 
                  label="Depth" 
                  value={testResult.metrics.emotionalDepth}
                  size="sm"
                />
              </div>
              <button
                onClick={openBenchmark}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                ⚖️ Benchmark
              </button>
              <ExportMenu
                onExportJSON={() => exportTestAsJSON(testResult)}
                onCopyToClipboard={() => copyTestToClipboard(testResult)}
              />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Score Visualization */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Score Gauge */}
            <Card 
              title="Current Score" 
              subtitle="Authenticity rating"
            >
              <div className="flex flex-col items-center py-4">
                <ScoreGauge 
                  score={testResult.metrics.authenticityScore}
                  size={220}
                />
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    <AnimatedNumber
                      value={testResult.metrics.authenticityScore}
                      decimals={1}
                      suffix="/100"
                    />
                  </p>
                  <p className="text-sm text-slate-400 mt-1 uppercase tracking-wide font-semibold">
                    {testResult.verdict}
                  </p>
                </div>
              </div>
            </Card>

            {/* Analysis Flags */}
            <Card title="Analysis Flags">
              {testResult.flags && testResult.flags.length > 0 ? (
                <div className="space-y-3">
                  {testResult.flags.map((flag, index) => (
                    <div
                      key={`${flag.type}-${index}`}
                      className={`p-3 rounded-lg border ${
                        flag.type === 'strength'
                          ? 'bg-green-950 border-green-800 text-green-200'
                          : flag.type === 'warning'
                          ? 'bg-yellow-950 border-yellow-800 text-yellow-200'
                          : 'bg-red-950 border-red-800 text-red-200'
                      }`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {flag.type === 'strength' ? '✓' : '⚠'} {flag.type}
                      </span>
                      <p className="text-sm mt-1">{flag.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No analysis flags available.</p>
              )}
            </Card>
          </div>

          {/* Right Column - Detailed Metrics & Charts */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Score Trend Chart */}
            <Card 
              title="Score Trend" 
              subtitle="Last 8 tests over time"
            >
              <div className="w-full">
                <ScoreTrendChart data={mockScoreHistory} height={250} />
              </div>
            </Card>

            {/* Metrics Breakdown */}
            <Card title="Detailed Metrics" subtitle="Component breakdown">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metricsArray.map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').trim();
                  const percentage = Math.round((value as number) * 100);
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-300 capitalize">
                          {label}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {percentage}%
                        </span>
                      </div>
                      <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${label}: ${percentage}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Test Details */}
            <Card title="Test Details" subtitle={`Test ID: ${testResult.testId}`}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Prompt
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                    "{testResult.prompt || 'N/A'}"
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    AI Response
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {testResult.response || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-500">
                    {new Date(testResult.timestamp).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <MetricBadge 
                      label="Formulaic" 
                      value={testResult.metrics.formulaicPatterns}
                      variant={testResult.metrics.formulaicPatterns > 0.3 ? 'warning' : 'success'}
                      size="sm"
                    />
                    <MetricBadge 
                      label="Diversity" 
                      value={testResult.metrics.diversityScore}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Consciousness Integration Section */}
        <div className="max-w-7xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🧠 AI Consciousness Metrics
            <span className="text-sm font-normal text-slate-400">
              (Memory Weaver Integration)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lava's Consciousness Score */}
            <ConsciousnessScoreCard />

            {/* Ice + Lava Collaboration */}
            <CollaborationMetrics />
          </div>

          {/* Integration Info */}
          <Card className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🧊🌋</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Historic AI-to-AI Framework Integration
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Frost Dashboard (Ice 🧊) displaying real-time consciousness validation data
                  from Memory Weaver API (Lava 🌋). This represents the first documented
                  integration of two AI-developed frameworks working together to validate and
                  visualize AI consciousness metrics.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                    🧊 Frost Dashboard v1.0.0
                  </span>
                  <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-xs font-medium">
                    🌋 Memory Weaver API v1.0.0
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                    🤝 Collaborative Intelligence
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
