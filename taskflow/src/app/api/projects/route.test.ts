/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  project: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { GET, POST } from './route';

const mockSession = { user: { id: 'user-1' } };

describe('Projects API - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(new Request('http://localhost/api/projects') as never);
    expect(res.status).toBe(401);
  });

  it('returns paginated projects', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockProjects = [{ id: '1', name: 'Project 1' }];
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);
    (prisma.project.count as jest.Mock).mockResolvedValue(1);

    const res = await GET(new Request('http://localhost/api/projects?page=1&limit=9') as never);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.data).toEqual(mockProjects);
    expect(data.meta.page).toBe(1);
    expect(data.meta.limit).toBe(9);
    expect(data.meta.total).toBe(1);
    expect(data.meta.totalPages).toBe(1);
  });

  it('uses default pagination', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.project.count as jest.Mock).mockResolvedValue(0);

    const res = await GET(new Request('http://localhost/api/projects') as never);
    const data = await res.json();
    expect(data.meta.page).toBe(1);
    expect(data.meta.limit).toBe(9);
  });

  it('filters by isArchived: false', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.project.count as jest.Mock).mockResolvedValue(0);

    await GET(new Request('http://localhost/api/projects') as never);

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1', isArchived: false },
      })
    );
  });
});

describe('Projects API - POST', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
  });

  it('creates a project with valid data', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockProject = { id: '1', name: 'Test', color: '#3b82f6' };
    (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data).toEqual(mockProject);
  });

  it('returns 400 for empty name', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Name is required');
  });

  it('returns 400 for name exceeding 100 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'a'.repeat(101) }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('returns 400 for description exceeding 500 chars', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', description: 'a'.repeat(501) }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('trims name and description', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.create as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: '  Test  ', description: '  Desc  ' }),
    });
    await POST(req as never);

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Test',
          description: 'Desc',
        }),
      })
    );
  });

  it('uses default color when not provided', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.project.create as jest.Mock).mockResolvedValue({ id: '1' });

    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    await POST(req as never);

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          color: '#3b82f6',
        }),
      })
    );
  });
});
