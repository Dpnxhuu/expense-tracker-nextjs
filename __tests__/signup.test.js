import { POST } from '../app/api/auth/register/route';
import { prisma } from '../lib/prisma';

// Prisma ko mock kar do (real DB pe hit nahi karna)
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

// Email bhejne wale function ko bhi mock karo (real email na jaaye)
jest.mock('../lib/mailer', () => ({
  sendVerificationEmail: jest.fn(),
}));

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // har test se pehle saare mocks reset
  });

  it('naya user successfully create hona chahiye', async () => {
    prisma.user.findUnique.mockResolvedValue(null); // user exist nahi karta
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

  it('duplicate email pe 409 error dena chahiye', async () => {
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

  it('weak password pe 400 error dena chahiye', async () => {
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
});