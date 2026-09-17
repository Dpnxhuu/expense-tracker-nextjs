import { GET } from '../app/api/auth/email-verification/route';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    verificationToken: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}));

describe('GET /api/auth/email-verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify email with a valid token', async () => {
    prisma.verificationToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() + 10000), // future date
    });
    prisma.user.update.mockResolvedValue({ id: 1, emailVerified: new Date() });

    const req = {
      nextUrl: { searchParams: new URLSearchParams({ token: 'abc123' }) },
    };

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Verification successful');
    expect(prisma.verificationToken.delete).toHaveBeenCalledTimes(1);
  });

  it('should return 404 for an expired token', async () => {
    prisma.verificationToken.findUnique.mockResolvedValue({
      token: 'abc123',
      identifier: 'test@test.com',
      expires: new Date(Date.now() - 10000), // past date
    });

    const req = {
      nextUrl: { searchParams: new URLSearchParams({ token: 'abc123' }) },
    };

    const res = await GET(req);

    expect(res.status).toBe(404);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should return 404 for a missing token', async () => {
    const req = {
      nextUrl: { searchParams: new URLSearchParams() },
    };

    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it('should return 404 for an invalid token (not found in DB)', async () => {
    prisma.verificationToken.findUnique.mockResolvedValue(null);

    const req = {
      nextUrl: { searchParams: new URLSearchParams({ token: 'wrongtoken' }) },
    };

    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it('should return 500 on DB error', async () => {
    prisma.verificationToken.findUnique.mockRejectedValue(new Error('DB down'));

    const req = {
      nextUrl: { searchParams: new URLSearchParams({ token: 'abc123' }) },
    };

    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});