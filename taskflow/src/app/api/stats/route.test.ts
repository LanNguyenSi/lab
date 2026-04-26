/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  task: {
    count: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },
  project: {
    count: jest.fn(),
  },
  timeEntry: {
    count: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { GET } from './route';

const mockSession = { user: { id: 'user-1' } };

describe('Stats API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(new Request('http://localhost/api/stats') as never);
    expect(res.status).toBe(401);
  });

  it('returns stats with default timeframe', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    (prisma.task.count as jest.Mock).mockResolvedValue(10);
    (prisma.project.count as jest.Mock).mockResolvedValue(3);
    (prisma.timeEntry.count as jest.Mock).mockResolvedValue(5);
    (prisma.task.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.task.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.timeEntry.aggregate as jest.Mock).mockResolvedValue({
      _sum: { duration: 3600 },
    });

    const res = await GET(new Request('http://localhost/api/stats') as never);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.overview).toBeDefined();
    expect(data.productivity).toBeDefined();
    expect(data.timeframe).toBe('7d');
  });

  it('supports 30d timeframe', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.count as jest.Mock).mockResolvedValue(0);
    (prisma.project.count as jest.Mock).mockResolvedValue(0);
    (prisma.timeEntry.count as jest.Mock).mockResolvedValue(0);
    (prisma.task.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.task.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.timeEntry.aggregate as jest.Mock).mockResolvedValue({
      _sum: { duration: null },
    });

    const res = await GET(
      new Request('http://localhost/api/stats?timeframe=30d') as never
    );
    const data = await res.json();
    expect(data.timeframe).toBe('30d');
  });

  it('calculates completion rate correctly', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    // total=10, completed=4
    let callCount = 0;
    (prisma.task.count as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 10; // total
      if (callCount === 2) return 4; // completed
      if (callCount === 3) return 3; // in progress
      if (callCount === 4) return 2; // todo
      return 1; // cancelled
    });
    (prisma.project.count as jest.Mock).mockResolvedValue(2);
    (prisma.timeEntry.count as jest.Mock).mockResolvedValue(5);
    (prisma.task.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.task.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.timeEntry.aggregate as jest.Mock).mockResolvedValue({
      _sum: { duration: 7200 },
    });

    const res = await GET(new Request('http://localhost/api/stats') as never);
    const data = await res.json();
    expect(data.overview.completionRate).toBe(40); // 4/10 * 100
    expect(data.overview.totalTimeTracked).toBe(7200);
  });

  it('handles zero tasks for completion rate', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.count as jest.Mock).mockResolvedValue(0);
    (prisma.project.count as jest.Mock).mockResolvedValue(0);
    (prisma.timeEntry.count as jest.Mock).mockResolvedValue(0);
    (prisma.task.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.task.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.timeEntry.aggregate as jest.Mock).mockResolvedValue({
      _sum: { duration: null },
    });

    const res = await GET(new Request('http://localhost/api/stats') as never);
    const data = await res.json();
    expect(data.overview.completionRate).toBe(0);
    expect(data.overview.totalTimeTracked).toBe(0);
  });
});
