import { authorizeUser } from '../lib/authorizeUser';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

// fully mock next-auth (real package never loads, avoids the ESM issue)
jest.mock('next-auth', () => ({
  CredentialsSignin: class CredentialsSignin extends Error {},
}));

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

  it('should return the user for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashedpass',
      emailVerified: new Date(),
    });
    bcrypt.compare.mockResolvedValue(true); // password matches

    const result = await authorizeUser({
      email: 'test@test.com',
      password: 'Pass@1234',
    });

    expect(result.email).toBe('test@test.com');
  });

  it('should throw an error for wrong password', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashedpass',
      emailVerified: new Date(),
    });
    bcrypt.compare.mockResolvedValue(false); // password doesn't match

    await expect(
      authorizeUser({ email: 'test@test.com', password: 'wrongpass' })
    ).rejects.toThrow();
  });

  it('should throw an error for unverified email', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashedpass',
      emailVerified: null, // not verified
    });

    await expect(
      authorizeUser({ email: 'test@test.com', password: 'Pass@1234' })
    ).rejects.toThrow();
  });

  it('should throw an error if user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authorizeUser({ email: 'notfound@test.com', password: 'Pass@1234' })
    ).rejects.toThrow();
  });

  it('should throw an error for invalid email format', async () => {
    await expect(
      authorizeUser({ email: 'notanemail', password: 'Pass@1234' })
    ).rejects.toThrow();
  });
});