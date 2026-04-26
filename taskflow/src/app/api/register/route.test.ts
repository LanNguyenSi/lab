/** @jest-environment node */

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import { POST } from './route';

describe('Register API - POST', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for missing email', async () => {
    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ password: '123456' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email', async () => {
    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid', password: '123456' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Please provide a valid email address');
  });

  it('returns 400 for short password', async () => {
    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: '12345' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Password must be at least 6 characters');
  });

  it('returns 409 for existing user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: '123456' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('An account with this email already exists');
  });

  it('creates user with valid data', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'new-user',
      email: 'test@test.com',
      name: 'Test User',
    });

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'Test@Test.com',
        name: 'Test User',
        password: '123456',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.user.email).toBe('test@test.com');
    expect(data.message).toBe('Account created successfully');
  });

  it('lowercases email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: null,
    });

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'TEST@TEST.COM', password: '123456' }),
    });
    await POST(req);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: 'test@test.com' }),
      })
    );
  });

  it('hashes password with bcrypt', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: null,
    });

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'mypassword' }),
    });
    await POST(req);

    expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 10);
  });
});
