/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  project: {
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

describe('Projects [id] API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/projects/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 when project not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/projects/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(404);
  });

  it('returns project when found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const mockProject = { id: '1', name: 'Test', tasks: [] };
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);

    const res = await GET(
      new Request('http://localhost/api/projects/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockProject);
  });
});

describe('Projects [id] API - PATCH', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(401);
  });

  it('returns 404 when project not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('updates project successfully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const updated = { id: '1', name: 'Updated' };
    (prisma.project.update as jest.Mock).mockResolvedValue(updated);

    const req = new Request('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  it('returns 400 for name exceeding 100 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'a'.repeat(101) }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for description exceeding 500 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ description: 'a'.repeat(501) }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(400);
  });

  it('can archive a project', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.project.update as jest.Mock).mockResolvedValue({ id: '1', isArchived: true });

    const req = new Request('http://localhost/api/projects/1', {
      method: 'PATCH',
      body: JSON.stringify({ isArchived: true }),
    });
    await PATCH(req as never, makeParams('1'));

    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isArchived: true }),
      })
    );
  });
});

describe('Projects [id] API - DELETE', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/projects/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(401);
  });

  it('returns 404 when project not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/projects/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('deletes project successfully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.project.delete as jest.Mock).mockResolvedValue({});

    const req = new Request('http://localhost/api/projects/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});
