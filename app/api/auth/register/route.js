import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../../../lib/mailer";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(3, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be 8+ chars")
    .regex(/[A-Z]/, "At least 1 uppercase letter required")
    .regex(/[a-z]/, "At least 1 lowercase letter required")
    .regex(/[0-9]/, "At least 1 number required")
    .regex(/[^A-Za-z0-9]/, "At least 1 special character required"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result?.error?.issues[0]?.message },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (dbUser) return NextResponse.json({ error: "User already exist!" }, { status: 409 });

    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      },
    });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 24 );

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}
