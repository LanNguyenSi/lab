/** @jest-environment node */

import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  tag: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

jest.mock('@prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      constructor(message: string, { code }: { code: string }) {
        super(message);
        this.code = code;
      }
    },
  },
}));

import { GET, PATCH, DELETE } from './route';

const mockSession = { user: { id: 'user-1' } };
const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe('Tags [id] API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/tags/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 when tag not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/tags/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(404);
  });

  it('returns tag when found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const mockTag = { id: '1', name: 'bug', tasks: [] };
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);

    const res = await GET(
      new Request('http://localhost/api/tags/1') as never,
      makeParams('1')
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockTag);
  });
});

describe('Tags [id] API - PATCH', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 when tag not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tags/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('updates tag successfully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const updated = { id: '1', name: 'updated' };
    (prisma.tag.update as jest.Mock).mockResolvedValue(updated);

    const req = new Request('http://localhost/api/tags/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(200);
  });

  it('lowercases and trims name on update', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.tag.update as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tags/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '  BUG  ' }),
    });
    await PATCH(req as never, makeParams('1'));

    expect(prisma.tag.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'bug' }),
      })
    );
  });

  it('returns 400 for name exceeding 50 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tags/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'a'.repeat(51) }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(400);
  });

  it('returns 409 for duplicate name on update', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
    } as never);
    (prisma.tag.update as jest.Mock).mockRejectedValue(error);

    const req = new Request('http://localhost/api/tags/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'existing' }),
    });
    const res = await PATCH(req as never, makeParams('1'));
    expect(res.status).toBe(409);
  });
});

describe('Tags [id] API - DELETE', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 when tag not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tags/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(404);
  });

  it('deletes tag successfully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.tag.delete as jest.Mock).mockResolvedValue({});

    const req = new Request('http://localhost/api/tags/1', { method: 'DELETE' });
    const res = await DELETE(req as never, makeParams('1'));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});
