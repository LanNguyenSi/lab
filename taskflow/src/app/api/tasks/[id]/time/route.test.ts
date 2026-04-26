/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  task: {
    findUnique: jest.fn(),
  },
  timeEntry: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { POST } from './route';

const mockSession = { user: { id: 'user-1' } };
const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe('Time Tracking API - POST', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(401);
  });

  it('returns 404 when task not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('starts time tracking', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      timeEntries: [],
    });

    const mockEntry = { id: 'entry-1', taskId: '1', startedAt: new Date() };
    (prisma.timeEntry.create as jest.Mock).mockResolvedValue(mockEntry);

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(201);
  });

  it('returns 400 when time tracking already active', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      timeEntries: [{ id: 'entry-1', endedAt: null }],
    });

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Time tracking already active');
  });

  it('stops time tracking', async () => {
    const startedAt = new Date(Date.now() - 3600000); // 1 hour ago
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      timeEntries: [{ id: 'entry-1', startedAt, endedAt: null }],
    });

    const mockUpdated = { id: 'entry-1', duration: 3600 };
    (prisma.timeEntry.update as jest.Mock).mockResolvedValue(mockUpdated);

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'stop' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(200);

    expect(prisma.timeEntry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          endedAt: expect.any(Date),
          duration: expect.any(Number),
        }),
      })
    );
  });

  it('returns 400 when no active time tracking to stop', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      timeEntries: [],
    });

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'stop' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('No active time tracking');
  });

  it('returns 400 for invalid action', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      timeEntries: [],
    });

    const req = new Request('http://localhost/api/tasks/1/time', {
      method: 'POST',
      body: JSON.stringify({ action: 'invalid' }),
    });
    const res = await POST(req as never, makeParams('1'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid action');
  });
});
