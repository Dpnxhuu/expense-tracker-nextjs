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

  it('valid token se password reset hona chahiye', async () => {
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
    bcrypt.compare.mockResolvedValue(false); // naya password purane se alag hai
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

  it('expired/invalid token pe 401 error dena chahiye', async () => {
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

  it('same password (purane jaisa) pe 409 error dena chahiye', async () => {
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
    bcrypt.compare.mockResolvedValue(true); // same password match ho gaya

    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'SamePass@123' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe("New password can't be same as old password!");
  });

  it('weak password pe 400 error dena chahiye', async () => {
    const req = new Request('http://localhost/api/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc123', pass: 'weak' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('user exist na kare ya unverified ho toh 404 error dena chahiye', async () => {
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

  it('DB error aane pe 500 return karna chahiye', async () => {
  prisma.passwordToken.findUnique.mockRejectedValue(new Error('DB down'));

  const req = new Request('http://localhost/api/forgot-password/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token: 'abc123', pass: 'NewPass@123' }),
  });

  const res = await POST(req);
  expect(res.status).toBe(500);
});

it('Google-signup user (password null) ke case mein bhi kaam karna chahiye', async () => {
  prisma.passwordToken.findUnique.mockResolvedValue({
    token: 'abc123',
    identifier: 'test@test.com',
    expires: new Date(Date.now() + 10000),
  });
  prisma.user.findUnique.mockResolvedValue({
    id: 1,
    email: 'test@test.com',
    emailVerified: new Date(),
    password: null, // Google se signup kiya, password nahi hai
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