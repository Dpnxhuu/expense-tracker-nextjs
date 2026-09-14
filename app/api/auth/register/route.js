import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/mailer";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(3, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ chars"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (dbUser) return NextResponse.json({ error: "User already exist!" }, { status: 409 });

    const hashedPass = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        verificationToken: verifyToken,
      },
    });

    await sendVerificationEmail(email, verifyToken);

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 },
    );
  }
}
