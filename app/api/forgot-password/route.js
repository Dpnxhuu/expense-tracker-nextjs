import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "If this email exists, a reset link has been sent!" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await prisma.user.update({
      where: { email },
      data: { passResetToken: token },
    });

    const baseurl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseurl}/forgot-password/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter
      .sendMail({
        from: `"Expense Tracker" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        html: `
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
      })
      .catch(console.error);

    return NextResponse.json({ message: "Reset email sent!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}