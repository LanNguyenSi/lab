/** @jest-environment node */

import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  tag: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
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

import { GET, POST } from './route';

const mockSession = { user: { id: 'user-1' } };

describe('Tags API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(new Request('http://localhost/api/tags') as never);
    expect(res.status).toBe(401);
  });

  it('returns paginated tags', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTags = [{ id: '1', name: 'bug', color: '#ef4444' }];
    (prisma.tag.findMany as jest.Mock).mockResolvedValue(mockTags);
    (prisma.tag.count as jest.Mock).mockResolvedValue(1);

    const res = await GET(new Request('http://localhost/api/tags') as never);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.data).toEqual(mockTags);
    expect(data.meta.page).toBe(1);
    expect(data.meta.total).toBe(1);
  });

  it('supports custom pagination', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.tag.count as jest.Mock).mockResolvedValue(0);

    const res = await GET(new Request('http://localhost/api/tags?page=2&limit=5') as never);
    const data = await res.json();
    expect(data.meta.page).toBe(2);
    expect(data.meta.limit).toBe(5);
  });
});

describe('Tags API - POST', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
  });

  it('creates a tag with valid data', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTag = { id: '1', name: 'bug', color: '#6b7280' };
    (prisma.tag.create as jest.Mock).mockResolvedValue(mockTag);

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bug' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(201);
  });

  it('lowercases and trims tag name', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.create as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: '  BUG  ' }),
    });
    await POST(req as never);

    expect(prisma.tag.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'bug' }),
      })
    );
  });

  it('returns 400 for empty name', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('returns 400 for name exceeding 50 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: 'a'.repeat(51) }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('returns 409 for duplicate tag name', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
    } as never);
    (prisma.tag.create as jest.Mock).mockRejectedValue(error);

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: 'existing' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('Tag with this name already exists');
  });

  it('uses default color when not provided', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.tag.create as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    });
    await POST(req as never);

    expect(prisma.tag.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ color: '#6b7280' }),
      })
    );
  });
});
