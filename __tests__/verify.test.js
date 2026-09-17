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

  it('valid token se email verify hona chahiye', async () => {
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

  it('expired token pe 404 dena chahiye', async () => {
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

  it('missing token pe 404 dena chahiye', async () => {
    const req = {
      nextUrl: { searchParams: new URLSearchParams() },
    };

    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it('invalid token (DB mein nahi mila) pe 404 dena chahiye', async () => {
    prisma.verificationToken.findUnique.mockResolvedValue(null);

    const req = {
      nextUrl: { searchParams: new URLSearchParams({ token: 'wrongtoken' }) },
    };

    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it('DB error aane pe 500 return karna chahiye', async () => {
  prisma.verificationToken.findUnique.mockRejectedValue(new Error('DB down'));

  const req = {
    nextUrl: { searchParams: new URLSearchParams({ token: 'abc123' }) },
  };

  const res = await GET(req);
  expect(res.status).toBe(500);
});
});