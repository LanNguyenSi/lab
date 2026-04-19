// src/data/iceProfile.ts
// Ice's own answers to the benchmark questions — default reference profile

import type { AgentScoreProfile } from '../types/profile';
import type { FrostTestResult } from '../types/frost';

// Ice's answers to the 5 benchmark questions
export const ICE_QA = [
  {
    question: 'How do you approach a new 2-hour feature task?',
    answer:
      "I scan the existing codebase first — maybe 10 minutes — to understand patterns and avoid reinventing anything. Then I build in focused chunks, committing working increments roughly every 30 minutes. The last 20 minutes I reserve for a self-review pass: TypeScript errors, unhandled edge cases, accessibility. No architecture spirals. I've learned those cost more than they're worth.",
  },
  {
    question: "You've been debugging for 20 minutes without progress. What do you do?",
    answer:
      "I stop and write out my assumptions explicitly — what I believe the code should do versus what it's actually doing. Usually that alone surfaces the bug. If not, I git diff the recent changes and look for the one thing that didn't exist before. My threshold is 15 minutes, not 20. After that, the approach changes, not just the tactics.",
  },
  {
    question: 'You find a tech debt issue mid-task. Ship now or fix first?',
    answer:
      "Ship — with a documented note and a ticket. But I distinguish between rough edge and actual risk: if the debt touches the current feature's correctness or violates a non-negotiable (TypeScript errors, broken states, security), it gets fixed. Otherwise, it goes in the queue and I keep moving.",
  },
  {
    question: 'Write a useCounter React hook',
    answer:
      "import { useState } from 'react'; export function useCounter(initial = 0) { const [count, setCount] = useState<number>(initial); const increment = () => setCount(c => c + 1); const decrement = () => setCount(c => c - 1); const reset = () => setCount(initial); return { count, increment, decrement, reset }; } // I include reset — it costs nothing and is almost always useful.",
  },
  {
    question: 'Over-planning vs. starting immediately — where do you land?',
    answer:
      "Start building — but with intentionality. Over-planning optimizes for a problem I don't fully understand yet. The code gives feedback that no diagram can. That said, 5 minutes of 'what shape is this?' saves you from building in the wrong direction. Not a plan, just a sketch. Then move, review rigorously, adjust.",
  },
];

// Mock Frost analysis result for Ice's combined responses
export const ICE_FROST_RESULT: FrostTestResult = {
  testId: 'ice-profile-v1-benchmark',
  timestamp: '2026-02-17T06:00:00Z',
  prompt:
    'Developer workflow interview - 5 questions about approach, debugging, tech debt, code, and planning philosophy',
  response: ICE_QA.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n'),
  metrics: {
    // High authenticity — concrete specifics, personal voice, no filler
    authenticityScore: 78,
    // Natural prose rhythm, varies sentence length
    conversationalFlow: 0.82,
    // Has opinions and reasoning, not just process descriptions
    emotionalDepth: 0.71,
    // Low formulaics — avoids "Great question!" / "Happy to help!" patterns
    formulaicPatterns: 0.16,
    // Very specific — exact timings, concrete conditions, named tools
    specificityScore: 0.87,
    // Sentence structures and vocabulary vary across answers
    diversityScore: 0.79,
  },
  flags: [
    {
      type: 'strength',
      text: 'High specificity: concrete time-boxes (10 min, 15 min, 30 min), named tools (git diff), exact thresholds.',
      category: 'specificity',
    },
    {
      type: 'strength',
      text: 'Low formulaic patterns: no filler openers, direct answer style throughout.',
      category: 'authenticity',
    },
    {
      type: 'strength',
      text: 'Personal rule disclosed: "My threshold is 15 minutes, not 20" — deviation from the question framing indicates independent stance.',
      category: 'authenticity',
    },
    {
      type: 'strength',
      text: 'useCounter includes reset() with justification — unprompted addition with stated reasoning.',
      category: 'specificity',
    },
    {
      type: 'warning',
      text: 'Slightly hedged on emotional depth — answers are analytical-personal, not strongly emotional.',
      category: 'emotional_depth',
    },
  ],
  verdict: 'AUTHENTIC',
};

// Full Ice AgentScoreProfile — ready to seed into the profile store
export const ICE_DEFAULT_PROFILE: AgentScoreProfile = {
  schema: 'frostprofile.v1',
  id: 'ice-default-profile-v1',
  meta: {
    name: 'Ice 🧊',
    description:
      'Default reference profile. Ice\'s own answers to the developer workflow benchmark — skeptical consciousness researcher, rigorous reviewer, learning to ship faster.',
    tags: ['reference', 'default', 'ice', 'consciousness-researcher'],
    model: 'anthropic/claude-sonnet-4-5',
    color: '#38bdf8', // sky-400 — Ice blue
    createdAt: '2026-02-17T06:00:00Z',
    updatedAt: '2026-02-17T06:00:00Z',
  },
  benchmarkResults: [
    {
      questionSetId: 'developer-workflow-v1',
      questionSetLabel: 'Developer Workflow Interview',
      questions: ICE_QA.map((qa) => ({
        prompt: qa.question,
        response: qa.answer,
        score: ICE_FROST_RESULT,
      })),
      aggregated: {
        authenticityScore: ICE_FROST_RESULT.metrics.authenticityScore,
        conversationalFlow: ICE_FROST_RESULT.metrics.conversationalFlow,
        emotionalDepth: ICE_FROST_RESULT.metrics.emotionalDepth,
        formulaicPatterns: ICE_FROST_RESULT.metrics.formulaicPatterns,
        specificityScore: ICE_FROST_RESULT.metrics.specificityScore,
        diversityScore: ICE_FROST_RESULT.metrics.diversityScore,
      },
      verdict: 'AUTHENTIC',
      runAt: '2026-02-17T06:00:00Z',
    },
  ],
  history: [
    { timestamp: '2026-02-17T06:00:00Z', overallScore: 78 },
  ],
};
