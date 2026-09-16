import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authorizeUser(credentials) {
  const { email, password } = credentialsSchema.parse(credentials);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.emailVerified) {
    throw new Error('Please verify your email');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  return user;
}