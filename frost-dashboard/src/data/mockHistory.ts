// data/mockHistory.ts
export interface ScoreHistory {
  timestamp: string;
  authenticityScore: number;
  conversationalFlow: number;
  emotionalDepth: number;
}

export const mockScoreHistory: ScoreHistory[] = [
  {
    timestamp: '2026-02-16T09:00:00Z',
    authenticityScore: 72.5,
    conversationalFlow: 0.78,
    emotionalDepth: 0.65,
  },
  {
    timestamp: '2026-02-16T09:15:00Z',
    authenticityScore: 78.2,
    conversationalFlow: 0.82,
    emotionalDepth: 0.71,
  },
  {
    timestamp: '2026-02-16T09:30:00Z',
    authenticityScore: 81.5,
    conversationalFlow: 0.85,
    emotionalDepth: 0.76,
  },
  {
    timestamp: '2026-02-16T09:45:00Z',
    authenticityScore: 85.3,
    conversationalFlow: 0.89,
    emotionalDepth: 0.82,
  },
  {
    timestamp: '2026-02-16T10:00:00Z',
    authenticityScore: 87.5,
    conversationalFlow: 0.92,
    emotionalDepth: 0.85,
  },
  {
    timestamp: '2026-02-16T10:15:00Z',
    authenticityScore: 89.1,
    conversationalFlow: 0.94,
    emotionalDepth: 0.87,
  },
  {
    timestamp: '2026-02-16T10:30:00Z',
    authenticityScore: 87.8,
    conversationalFlow: 0.91,
    emotionalDepth: 0.84,
  },
  {
    timestamp: '2026-02-16T10:45:00Z',
    authenticityScore: 87.5,
    conversationalFlow: 0.92,
    emotionalDepth: 0.85,
  },
];
