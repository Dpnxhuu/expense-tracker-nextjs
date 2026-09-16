import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetSchema = z.object({
  token: z.string(),
  pass: z
    .string()
    .min(8, "Password must be 8+ chars")
    .regex(/[A-Z]/, "At least 1 uppercase letter required")
    .regex(/[a-z]/, "At least 1 lowercase letter required")
    .regex(/[0-9]/, "At least 1 number required")
    .regex(/[^A-Za-z0-9]/, "At least 1 special character required"),
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

    const tokenVerify = await prisma.passwordToken.findUnique({
      where: {token}
    })

    if(!tokenVerify || tokenVerify.expires < new Date()){
      return NextResponse.json({error: "Invalid link or expired!"}, {status: 401})
    }

    const user = await prisma.user.findUnique({
      where: { email: tokenVerify.identifier},
    });

    if (!user || !user.emailVerified) {
      return NextResponse.json(
        { error: "Invalid user!" },
        { status: 404 },
      );
    }

    if (user.password) {
      const compare = await bcrypt.compare(pass, user.password);

      if (compare) {
        return NextResponse.json(
          { error: "New password can't be same as old password!" },
          { status: 409 },
        );
      }
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    await prisma.user.update({
      where: { email: tokenVerify.identifier },
      data: {
        password: hashedPass,
        tokenVersion: { increment: 1 },
      },
    });

    await prisma.passwordToken.delete({
      where: {
        identifier_token: {
          identifier: tokenVerify.identifier,
          token
        }
      }
    })

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
