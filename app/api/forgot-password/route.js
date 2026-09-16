import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { ResetPasswordEmail } from "@/lib/mailer";
import crypto from "crypto"

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
      return NextResponse.json({ error: "Invalid credentials!" }, { status: 400 });
    }

    if(!user.emailVerified){
      return NextResponse.json({error: "Email not verified!"},{status: 400})
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 15)

    await prisma.passwordToken.create({
      data: { identifier: email, token, expires},
    });
    
    await ResetPasswordEmail(token, email);

    return NextResponse.json({ message: "Reset email sent!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}