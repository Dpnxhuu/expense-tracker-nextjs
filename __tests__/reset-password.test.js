import { POST } from '../app/api/forgot-password/reset/route';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

jest.mock('../lib/prisma', () => ({
  prisma: {
    passwordToken: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('POST /api/forgot-password/reset-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset password with a valid token', async () => {
    prisma.passwordToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() + 10000),
    });
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      emailVerified: new Date(),
      password: 'oldhashedpass',
    });
    bcrypt.compare.mockResolvedValue(false); // new password is different from old one
    bcrypt.hash.mockResolvedValue('newhashedpass');
    prisma.user.update.mockResolvedValue({});
    prisma.passwordToken.delete.mockResolvedValue({});

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'NewPass@123' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe('Password reset successfully');
    expect(prisma.passwordToken.delete).toHaveBeenCalledTimes(1);
  });

  it('should return 401 for an expired/invalid token', async () => {
    prisma.passwordToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() - 10000), // expired
    });

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'NewPass@123' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Invalid link or expired!');
  });

  it('should return 409 if new password matches the old one', async () => {
    prisma.passwordToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() + 10000),
    });
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      emailVerified: new Date(),
      password: 'oldhashedpass',
    });
    bcrypt.compare.mockResolvedValue(true); // same password matched

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'SamePass@123' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe("New password can't be same as old password!");
  });

  it('should return 400 for a weak password', async () => {
    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'weak' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 404 if user does not exist or is unverified', async () => {
    prisma.passwordToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() + 10000),
    });
    prisma.user.findUnique.mockResolvedValue(null);

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'NewPass@123' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Invalid user!');
  });

  it('should return 500 on DB error', async () => {
    prisma.passwordToken.findUnique.mockRejectedValue(new Error('DB down'));

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'NewPass@123' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('should also work for a Google-signup user (null password)', async () => {
    prisma.passwordToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() + 10000),
    });
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      emailVerified: new Date(),
      password: null, // signed up via Google, no password
    });
    bcrypt.hash.mockResolvedValue('newhashedpass');
    prisma.user.update.mockResolvedValue({});
    prisma.passwordToken.delete.mockResolvedValue({});

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'NewPass@123' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});