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
    jest.clearAllMocks();
  });

  it('valid verified user ko reset email bhejna chahiye', async () => {
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

  it('user exist na kare toh 400 error dena chahiye', async () => {
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

  it('unverified email pe 400 error dena chahiye', async () => {
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

  it('invalid email format pe 400 error dena chahiye', async () => {
    const req = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'notanemail' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});