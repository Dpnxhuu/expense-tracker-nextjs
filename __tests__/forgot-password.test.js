import { POST } from '../app/api/forgot-password/route';
import { prisma } from '../lib/prisma';
import { ResetPasswordEmail } from '../lib/mailer';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    passwordToken: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../lib/mailer', () => ({
  ResetPasswordEmail: jest.fn(),
}));

describe('POST /api/forgot-password', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset all mocks before each test
  });

  it('should send reset email for a valid verified user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      emailVerified: new Date(),
    });
    prisma.passwordToken.create.mockResolvedValue({});

    const req = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Reset email sent!');
    expect(ResetPasswordEmail).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'notfound@test.com' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid credentials!');
  });

  it('should return 400 for unverified email', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      emailVerified: null,
    });

    const req = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Email not verified!');
  });

  it('should return 400 for invalid email format', async () => {
    const req = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'notanemail' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 500 on DB error', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB down'));

    const req = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});