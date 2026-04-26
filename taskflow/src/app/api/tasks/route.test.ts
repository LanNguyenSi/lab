/** @jest-environment node */

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { Status, Priority } from '@/types';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  task: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { GET, POST } from '@/app/api/tasks/route';

describe('Tasks API - GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/tasks');
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns tasks with default pagination', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTasks = [
      { id: '1', title: 'Task 1', status: Status.TODO },
      { id: '2', title: 'Task 2', status: Status.IN_PROGRESS },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);
    (prisma.task.count as jest.Mock).mockResolvedValue(2);

    const request = new Request('http://localhost:3000/api/tasks');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toEqual(mockTasks);
    expect(data.meta.page).toBe(1);
    expect(data.meta.limit).toBe(10);
  });

  it('validates page parameter', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/tasks?page=0');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
  });

  it('validates limit parameter max value', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/tasks?limit=200');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
  });

  it('filters by status', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTasks = [{ id: '1', title: 'Task 1', status: Status.DONE }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);
    (prisma.task.count as jest.Mock).mockResolvedValue(1);

    const request = new Request('http://localhost:3000/api/tasks?status=DONE');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          status: { in: [Status.DONE] },
        }),
      })
    );
  });

  it('filters by search query', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTasks = [{ id: '1', title: 'Test Task' }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);
    (prisma.task.count as jest.Mock).mockResolvedValue(1);

    const request = new Request('http://localhost:3000/api/tasks?search=test');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: { contains: 'test' } },
            { description: { contains: 'test' } },
          ],
        }),
      })
    );
  });

  it('hides completed tasks when hideCompleted is true', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTasks = [{ id: '1', title: 'Active Task' }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);
    (prisma.task.count as jest.Mock).mockResolvedValue(1);

    const request = new Request(
      'http://localhost:3000/api/tasks?hideCompleted=true'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { not: Status.DONE },
        }),
      })
    );
  });
});

describe('Tasks API - POST', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Task' }),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('creates a task with valid data', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTask = {
      id: 'new-task-id',
      title: 'New Task',
      status: Status.TODO,
      priority: Priority.MEDIUM,
    };
    (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Task',
        status: Status.TODO,
        priority: Priority.MEDIUM,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toEqual(mockTask);
  });

  it('validates required title', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
    expect(data.details).toContainEqual(
      expect.objectContaining({
        field: 'title',
      })
    );
  });

  it('validates title length', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'a'.repeat(201),
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
  });

  it('validates description length', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid Title',
        description: 'a'.repeat(2001),
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
  });

  it('uses default values when not provided', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTask = {
      id: 'new-task-id',
      title: 'New Task',
      status: Status.TODO,
      priority: Priority.MEDIUM,
    };
    (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Task' }),
    });
    await POST(request);

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: Status.TODO,
          priority: Priority.MEDIUM,
        }),
      })
    );
  });

  it('trims title and description', async () => {
    const mockSession = { user: { id: 'user-1' } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const mockTask = { id: 'new-task-id', title: 'New Task' };
    (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: '  New Task  ',
        description: '  Description  ',
      }),
    });
    await POST(request);

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'New Task',
          description: 'Description',
        }),
      })
    );
  });
});
