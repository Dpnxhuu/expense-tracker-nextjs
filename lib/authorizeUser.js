import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { CredentialsSignin } from 'next-auth';

class InvalidCredentialsError extends CredentialsSignin {
  code = "Invalid email or password!";
}

class UnverifiedEmailError extends CredentialsSignin {
  code = "Verify your email!";
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authorizeUser(credentials) {
  const parsed = credentialsSchema.safeParse(credentials);

  if (!parsed.success) {
    throw new InvalidCredentialsError();
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw new InvalidCredentialsError();
  }

  if (!user.emailVerified) {
    throw new UnverifiedEmailError();
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new InvalidCredentialsError();
  }

  return user;
}