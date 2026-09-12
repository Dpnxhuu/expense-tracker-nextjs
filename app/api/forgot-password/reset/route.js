import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetSchema = z.object({
  token: z.string(),
  pass: z.string().min(8, "Password too short!"),
});

const tokenSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = resetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const { token, pass } = result.data;

    const decoded = tokenSchema.parse(
      jwt.verify(token, process.env.JWT_SECRET),
    );

    const user = await prisma.user.findFirst({
      where: { email:decoded.email, passResetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Link already used or invalid" },
        { status: 401 },
      );
    }

    if (user.password) {
      const compare = await bcrypt.compare(pass, user.password);

      if (compare) {
        return NextResponse.json(
          { error: "New password can't be same as old password!" },
          { status: 401 },
        );
      }
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        password: hashedPass,
        passResetToken: null,
        tokenVersion: { increment: 1 },
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
