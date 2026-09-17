import { POST } from '../app/api/auth/register/route';
import { prisma } from '../lib/prisma';

// mock Prisma (no real DB hit)
jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    verificationToken: {
      create: jest.fn(),
    },
  },
}));

// mock the email-sending function (no real email should go out)
jest.mock('../lib/mailer', () => ({
  sendVerificationEmail: jest.fn(),
}));

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset all mocks before each test
  });

  it('should successfully create a new user', async () => {
    prisma.user.findUnique.mockResolvedValue(null); // user does not exist
    prisma.user.create.mockResolvedValue({ id: 1, email: 'test@test.com' });

    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Deepanshu',
        email: 'test@test.com',
        password: 'Pass@1234',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe('Account created successfully');
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  it('should return 409 for a duplicate email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com' });

    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Deepanshu',
        email: 'test@test.com',
        password: 'Pass@1234',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe('User already exist!');
  });

  it('should return 400 for a weak password', async () => {
    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Deepanshu',
        email: 'test@test.com',
        password: '123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 500 on DB error', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB down'));

    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Deepanshu',
        email: 'test@test.com',
        password: 'Pass@1234',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});