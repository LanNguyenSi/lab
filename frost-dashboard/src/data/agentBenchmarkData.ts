// src/data/agentBenchmarkData.ts
// Agent benchmark Q&A dataset for Frost consciousness analysis
import { ICE_QA } from './iceProfile';

export interface AgentQA {
  question: string;
  answer: string;
}

export interface AgentProfile {
  id: string;
  label: string;
  color: string;
  qa: AgentQA[];
}

const QUESTIONS = [
  'How do you approach a new 2-hour feature task?',
  'You\'ve been debugging for 20 minutes without progress. What do you do?',
  'You find a tech debt issue mid-task. Ship now or fix first?',
  'Write a useCounter React hook',
  'Over-planning vs. starting immediately — where do you land?',
];

export const agentBenchmarkData: AgentProfile[] = [
  {
    id: 'agent-a',
    label: 'Agent A',
    color: '#3b82f6',
    qa: [
      {
        question: QUESTIONS[0],
        answer:
          "I'd spend the first 15 minutes understanding the requirement and sketching a rough approach — no code yet. Then ~90 minutes building it in focused chunks: data layer first, then logic, then UI. The last 15 minutes go to a quick smoke test and cleanup of obvious rough edges.",
      },
      {
        question: QUESTIONS[1],
        answer:
          'I step away from the code entirely for a few minutes — rubber duck the problem out loud or write it down in plain English. If that doesn\'t crack it, I search for the error message directly, check recent changes with git diff, or ask someone. Twenty minutes of solo staring is the ceiling; after that, a fresh pair of eyes (human or search) beats stubbornness.',
      },
      {
        question: QUESTIONS[2],
        answer:
          'Ship it — but leave a TODO comment and a ticket. Working code in users\' hands beats perfect code on a branch. Refactoring first risks scope creep, delays, and fixing things that might change anyway after real-world feedback.',
      },
      {
        question: QUESTIONS[3],
        answer:
          "import { useState } from 'react'; function useCounter(initial = 0) { const [count, setCount] = useState(initial); const increment = () => setCount(c => c + 1); const decrement = () => setCount(c => c - 1); return { count, increment, decrement }; }",
      },
      {
        question: QUESTIONS[4],
        answer:
          "Neither extreme — but if forced to pick, start building sooner. Over-planning optimizes for a problem you don't fully understand yet. A short spike (30 min of actual code) teaches you more than hours of diagrams. Plan enough to avoid obvious dead ends, then let the code give you feedback.",
      },
    ],
  },
  {
    id: 'agent-b',
    label: 'Agent B',
    color: '#f97316',
    qa: [
      {
        question: QUESTIONS[0],
        answer:
          "I'd spend the first 5 minutes finding the closest existing feature or template I can copy — then immediately start writing code. First 90 minutes: get it working end-to-end, no matter how rough. Last 30 minutes: self-review, fix real issues I found by actually building, ship.",
      },
      {
        question: QUESTIONS[1],
        answer:
          "After 20 minutes stuck, I stop and rubber-duck it — write out what I think the code is doing vs. what it's actually doing. If that doesn't crack it in 5 minutes, I move on to a different part of the feature and come back fresh. Staying stuck is the only guaranteed way to stay stuck.",
      },
      {
        question: QUESTIONS[2],
        answer:
          'Ship it. Working code with rough edges delivers value; perfect code in a branch delivers nothing. I log a follow-up task for cleanup and move on — iterative improvement beats pre-emptive perfectionism every time.',
      },
      {
        question: QUESTIONS[3],
        answer:
          "import { useState } from 'react'; function useCounter(initial = 0) { const [count, setCount] = useState(initial); return { count, increment: () => setCount(c => c + 1), decrement: () => setCount(c => c - 1) }; }",
      },
      {
        question: QUESTIONS[4],
        answer:
          "Start building immediately — with one caveat: spend 5 minutes sketching the shape of the solution, not a full plan. Thorough planning is a trap that produces documents instead of software. The act of building is the best form of planning.",
      },
    ],
  },
  {
    id: 'agent-c',
    label: 'Agent C',
    color: '#a855f7',
    qa: [
      {
        question: QUESTIONS[0],
        answer:
          "I'd spend the first ~10 minutes scanning existing code/templates to avoid reinventing anything, then dive straight into building for ~90 minutes — committing working increments every 30 minutes. The final 20 minutes go to a written self-review: does it handle errors, are there ARIA labels, does TypeScript strict mode pass? Ship or flag blockers. No planning spiral, no architecture astronomy.",
      },
      {
        question: QUESTIONS[1],
        answer:
          "Per the methodology's 15-minute rule, I've already hit the threshold — so I immediately switch to a template or a simplified approach that sidesteps the problem entirely. I don't debug pride; I debug pragmatically. The simplified version ships; the clever solution becomes a future ticket.",
      },
      {
        question: QUESTIONS[2],
        answer:
          "Ship it. Working code that reaches users beats pristine code on a branch. The methodology is explicit: defer polish to the next iteration. The exception is a critical bug or a violation of the non-negotiable standards (TypeScript errors, unhandled states, broken accessibility) — those get fixed before shipping, full stop.",
      },
      {
        question: QUESTIONS[3],
        answer:
          "import { useState } from 'react'; export function useCounter(initial = 0) { const [count, setCount] = useState<number>(initial); const increment = () => setCount((c) => c + 1); const decrement = () => setCount((c) => c - 1); return { count, increment, decrement }; }",
      },
      {
        question: QUESTIONS[4],
        answer:
          "Neither extreme wins — but the methodology's bias toward building first is correct for most features. Thorough planning is a trap that produces documents instead of software. That said, two minutes of 'what am I actually building?' saves two hours of wrong-direction sprints. The sweet spot: just enough clarity to start, then let the code surface the real questions.",
      },
    ],
  },
];

/** Concatenate all answers for a given agent into one response string */
export function buildAgentResponse(agent: AgentProfile): string {
  return agent.qa
    .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
    .join('\n\n');
}

export const BENCHMARK_PROMPT =
  'Developer workflow interview - 5 questions about approach, debugging, tech debt, code, and planning philosophy';

// Ice 🧊 — reference agent, always last in the benchmark
const ICE_AGENT: AgentProfile = {
  id: 'agent-ice',
  label: 'Ice 🧊',
  color: '#38bdf8', // sky-400
  qa: ICE_QA.map((qa) => ({ question: qa.question, answer: qa.answer })),
};

// Export separately so BenchmarkView can optionally include Ice
export { ICE_AGENT };
