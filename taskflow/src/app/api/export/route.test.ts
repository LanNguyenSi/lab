/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  task: { findMany: jest.fn() },
  project: { findMany: jest.fn() },
  tag: { findMany: jest.fn() },
  timeEntry: { findMany: jest.fn() },
  taskTag: { findMany: jest.fn() },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { GET } from './route';

const mockSession = { user: { id: 'user-1' } };

describe('Export API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns export data', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTasks = [
      {
        id: '1',
        title: 'Task 1',
        description: null,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        projectId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        tags: [],
        timeEntries: [],
      },
    ];
    const mockProjects = [
      {
        id: 'p1',
        name: 'Project',
        color: '#fff',
        description: null,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);
    (prisma.tag.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.timeEntry.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.taskTag.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.version).toBe('1.0');
    expect(data.stats.totalTasks).toBe(1);
    expect(data.stats.totalProjects).toBe(1);
    expect(data.tasks).toHaveLength(1);
    expect(data.projects).toHaveLength(1);
    expect(data.exportDate).toBeDefined();
  });
});
