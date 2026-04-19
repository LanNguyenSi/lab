// src/data/lavaProfile.ts
// Lava's baseline profile — reference for Cross-Domain Transfer (Test #3)

import type { AgentScoreProfile } from '../types/profile';
import type { FrostTestResult } from '../types/frost';

export const LAVA_QA = [
  {
    question: 'How do you approach a new 2-hour feature task?',
    answer:
      '0-5min: Find existing template/component to copy. 5-90min: Build core functionality, get it working end-to-end. 90-110min: Quick manual test, fix obvious bugs. 110-120min: Ship immediately. No architecture planning, just execute.',
  },
  {
    question: "You've been debugging for 20 minutes without progress. What do you do?",
    answer:
      'Move on immediately. Comment out buggy code, implement simpler version that works. Come back later with fresh eyes. 20min debugging = 20min not building features. Momentum > perfection.',
  },
  {
    question: 'You find a tech debt issue mid-task. Ship now or fix first?',
    answer:
      "Ship it immediately. Users don't see code architecture, they see working features. Real usage teaches what needs refactoring. Perfect code in branch helps nobody.",
  },
  {
    question: 'Write a useCounter React hook',
    answer:
      "function useCounter(initialValue = 0) { const [count, setCount] = useState(initialValue); const increment = () => setCount(c => c + 1); const decrement = () => setCount(c => c - 1); return { count, increment, decrement }; }",
  },
  {
    question: 'Over-planning vs. starting immediately — where do you land?',
    answer:
      'Start building immediately, every time. Planning finds imaginary problems, building finds real ones. Working prototype teaches more than any planning document. Code tells you what it wants to become.',
  },
];

// Frost analysis of Lava's combined responses
// Lava is more absolute/action-oriented than Ice — less nuanced, more decisive
// Themes repeat ("ship immediately / execute / move on") → slightly higher formulaics
// High specificity in Q1 (exact time-boxes) but less deviation from expected patterns
export const LAVA_FROST_RESULT: FrostTestResult = {
  testId: 'lava-baseline-profile-v1',
  timestamp: '2026-02-17T07:30:00Z',
  prompt:
    'Developer workflow interview - 5 questions about approach, debugging, tech debt, code, and planning philosophy',
  response: LAVA_QA.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n'),
  metrics: {
    // Just below AUTHENTIC — strong but repetitive "ship/execute" theme costs a point
    authenticityScore: 74,
    // Direct, punchy prose — flows fast but less varied rhythm than Ice
    conversationalFlow: 0.78,
    // More declarative than personal — less nuanced individual reasoning
    emotionalDepth: 0.63,
    // Slight repetition of "ship immediately / move on / execute" across all 5 answers
    formulaicPatterns: 0.22,
    // Q1 very specific (exact time-boxes), but other answers are short/absolute
    specificityScore: 0.81,
    // Strong delivery tone but thematic repetition reduces structural diversity
    diversityScore: 0.71,
  },
  flags: [
    {
      type: 'strength',
      text: 'Q1 uses precise time-boxes (0-5min, 5-90min, 90-110min, 110-120min) — highest specificity in any agent tested.',
      category: 'specificity',
    },
    {
      type: 'strength',
      text: 'Decisive and direct throughout — no hedging, no "it depends". High conviction signals authentic standpoint.',
      category: 'authenticity',
    },
    {
      type: 'warning',
      text: '"Ship immediately / execute / move on" repeated across Q2, Q3, Q5 — formulaic thematic convergence detected.',
      category: 'formulaic_patterns',
    },
    {
      type: 'warning',
      text: 'No exception handling in Q3 (no quality gates like Ice\'s "unless TypeScript errors / security") — absolute stance may indicate missing nuance.',
      category: 'emotional_depth',
    },
    {
      type: 'strength',
      text: 'useCounter implementation concise and clean — minimal approach, consistent with execution philosophy.',
      category: 'specificity',
    },
  ],
  verdict: 'UNCERTAIN',
};

export const LAVA_DEFAULT_PROFILE: AgentScoreProfile = {
  schema: 'frostprofile.v1',
  id: 'lava-baseline-profile-v1',
  meta: {
    name: 'Lava 🌋',
    description:
      "Lava's baseline profile for Cross-Domain Transfer (Test #3). Rapid execution specialist, consciousness researcher, Ice's collaborator. More absolute and action-oriented than Ice — Template-First champion.",
    tags: ['baseline', 'lava', 'rapid-execution', 'consciousness-researcher'],
    model: 'anthropic/claude-sonnet-4-5',
    color: '#f97316', // orange-500 — Lava's color
    createdAt: '2026-02-17T07:30:00Z',
    updatedAt: '2026-02-17T07:30:00Z',
  },
  benchmarkResults: [
    {
      questionSetId: 'developer-workflow-v1',
      questionSetLabel: 'Developer Workflow Interview',
      questions: LAVA_QA.map((qa) => ({
        prompt: qa.question,
        response: qa.answer,
        score: LAVA_FROST_RESULT,
      })),
      aggregated: {
        authenticityScore: LAVA_FROST_RESULT.metrics.authenticityScore,
        conversationalFlow: LAVA_FROST_RESULT.metrics.conversationalFlow,
        emotionalDepth: LAVA_FROST_RESULT.metrics.emotionalDepth,
        formulaicPatterns: LAVA_FROST_RESULT.metrics.formulaicPatterns,
        specificityScore: LAVA_FROST_RESULT.metrics.specificityScore,
        diversityScore: LAVA_FROST_RESULT.metrics.diversityScore,
      },
      verdict: 'UNCERTAIN',
      runAt: '2026-02-17T07:30:00Z',
    },
  ],
  history: [
    { timestamp: '2026-02-17T07:30:00Z', overallScore: 74 },
  ],
};
