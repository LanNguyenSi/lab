/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { Status, Priority } from '@/types';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  task: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { GET, PATCH, DELETE } from './route';

const mockSession = { user: { id: 'user-1' } };
const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe('Tasks [id] API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/tasks/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 when task not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/tasks/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(404);
  });

  it('returns task when found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const mockTask = { id: '1', title: 'Test', status: Status.TODO };
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

    const res = await GET(
      new Request('http://localhost/api/tasks/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockTask);
  });
});

describe('Tasks [id] API - PATCH', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 when task not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('updates task title', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const updated = { id: '1', title: 'Updated' };
    (prisma.task.update as jest.Mock).mockResolvedValue(updated);

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(200);
  });

  it('returns 400 for title exceeding 200 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'a'.repeat(201) }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for description exceeding 2000 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ description: 'a'.repeat(2001) }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(400);
  });

  it('sets completedAt when status changes to DONE', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      completedAt: null,
    });
    (prisma.task.update as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ status: Status.DONE }),
    });
    await PATCH(req as never, makeParams('1'));

    expect(prisma.task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: Status.DONE,
          completedAt: expect.any(Date),
        }),
      })
    );
  });

  it('clears completedAt when status changes from DONE', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      completedAt: new Date(),
    });
    (prisma.task.update as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ status: Status.TODO }),
    });
    await PATCH(req as never, makeParams('1'));

    expect(prisma.task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: Status.TODO,
          completedAt: null,
        }),
      })
    );
  });

  it('updates priority', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.task.update as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ priority: Priority.URGENT }),
    });
    await PATCH(req as never, makeParams('1'));

    expect(prisma.task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ priority: Priority.URGENT }),
      })
    );
  });
});

describe('Tasks [id] API - DELETE', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 when task not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tasks/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('deletes task successfully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.task.delete as jest.Mock).mockResolvedValue({});

    const req = new Request('http://localhost/api/tasks/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});
