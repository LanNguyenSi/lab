/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  timeEntry: { deleteMany: jest.fn() },
  taskTag: { deleteMany: jest.fn() },
  task: { deleteMany: jest.fn() },
  tag: { deleteMany: jest.fn() },
  project: { deleteMany: jest.fn() },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { POST } from './route';

const mockSession = { user: { id: 'user-1' } };

describe('Reset API - POST', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await POST();
    expect(res.status).toBe(401);
  });

  it('deletes all user data in correct order', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.timeEntry.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.taskTag.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.task.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.tag.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.project.deleteMany as jest.Mock).mockResolvedValue({});

    const res = await POST();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify deletion order (dependencies first)
    const timeEntryOrder =
      (prisma.timeEntry.deleteMany as jest.Mock).mock.invocationCallOrder[0];
    const taskTagOrder =
      (prisma.taskTag.deleteMany as jest.Mock).mock.invocationCallOrder[0];
    const taskOrder =
      (prisma.task.deleteMany as jest.Mock).mock.invocationCallOrder[0];
    const tagOrder =
      (prisma.tag.deleteMany as jest.Mock).mock.invocationCallOrder[0];
    const projectOrder =
      (prisma.project.deleteMany as jest.Mock).mock.invocationCallOrder[0];

    expect(timeEntryOrder).toBeLessThan(taskOrder);
    expect(taskTagOrder).toBeLessThan(taskOrder);
    expect(taskOrder).toBeLessThan(tagOrder);
    expect(taskOrder).toBeLessThan(projectOrder);
  });
});
