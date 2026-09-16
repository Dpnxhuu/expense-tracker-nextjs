import { authorizeUser } from '../lib/authorizeUser';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('authorizeUser (login logic)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('valid credentials se user return hona chahiye', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashedpass',
      emailVerified: new Date(),
    });
    bcrypt.compare.mockResolvedValue(true); // password match

    const result = await authorizeUser({
      email: 'test@test.com',
      password: 'Pass@1234',
    });

    expect(result.email).toBe('test@test.com');
  });

  it('wrong password pe error throw karna chahiye', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashedpass',
      emailVerified: new Date(),
    });
    bcrypt.compare.mockResolvedValue(false); // password galat

    await expect(
      authorizeUser({ email: 'test@test.com', password: 'wrongpass' })
    ).rejects.toThrow();
  });

  it('unverified email pe error throw karna chahiye', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashedpass',
      emailVerified: null, // verify nahi hai
    });

    await expect(
      authorizeUser({ email: 'test@test.com', password: 'Pass@1234' })
    ).rejects.toThrow();
  });

  it('user exist na kare toh error throw karna chahiye', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authorizeUser({ email: 'notfound@test.com', password: 'Pass@1234' })
    ).rejects.toThrow();
  });

  it('invalid email format pe error throw karna chahiye', async () => {
    await expect(
      authorizeUser({ email: 'notanemail', password: 'Pass@1234' })
    ).rejects.toThrow();
  });
});