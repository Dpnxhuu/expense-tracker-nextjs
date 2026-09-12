import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { CredentialsSignin } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "./lib/prisma";

const AUTH_PAGES = new Set([
  "/",
  "/login",
  "/signup",
  "/signup/email",
  "/forgot-password",
  "/forgot-password/reset-password",
]);

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

const adapter = PrismaAdapter(prisma);

// Custom linkAccount
adapter.linkAccount = async (account) => {
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      },
    },
    update: {
      ...account,
    },
    create: {
      ...account,
    },
  });
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  events: {
    linkAccount: async ({ user, profile }) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!existingUser) return;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          image: existingUser.image ?? profile?.image,
          emailVerified: existingUser.emailVerified ?? new Date(),
        },
      });

      await prisma.verificationToken.deleteMany({
        where: {
          identifier: user.email,
        },
      });
    },
  },

  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new InvalidCredentialsError();
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          throw new InvalidCredentialsError();
        }

        if (!user.emailVerified) {
          throw new UnverifiedEmailError();
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new InvalidCredentialsError();
        }

        return user;
      },
    }),
  ],

  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth;
      const { pathname, searchParams } = request.nextUrl;
      const isAuthPage = AUTH_PAGES.has(pathname);
      const isProtected = pathname === "/home" || pathname.startsWith("/home/");
      const isResetPage = pathname === "/forgot-password/reset-password";

      // Protected routes
      if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Don't allow logged-in users on auth pages
      if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      // Reset password token validation
      if (isResetPage) {
        const resetToken = searchParams.get("token");

        if (!resetToken) {
          return NextResponse.redirect(
            new URL("/forgot-password", request.url),
          );
        }
      }

      return true;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;

        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

        token.tokenVersion = dbUser?.tokenVersion ?? 0;
        token.emailVerified = dbUser?.emailVerified;

        token.picture = dbUser?.image;

        return token;
      }

      if (!token.id) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.id,
        },
      });

      if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
        return null;
      }

      token.picture = dbUser.image;
      token.emailVerified = dbUser.emailVerified;

      return token;
    },

    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.emailVerified = token.emailVerified;
        session.user.image = token.picture;
      }

      return session;
    },
  },
});
