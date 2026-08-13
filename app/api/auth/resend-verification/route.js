import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mailer";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "invalid token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const dbUser = await prisma.user.findUnique({
      where: {id: decoded.userId}
    })

    if(!dbUser){
        return NextResponse.json({message: "Something went wrong!"},{status: 401})
    }

    const verifyToken = jwt.sign(
      { name: dbUser.name, email: dbUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // const [result] = await db.query(
    //   "UPDATE users SET verification_token = ? WHERE email = ?",
    //   [verificationToken, decoded.email],
    // );

    const updatedUser = await prisma.user.update({
      where: {email: dbUser.email},
      data: {verificationToken: verifyToken}
    })


    await sendVerificationEmail(updatedUser.email, verifyToken);

    return NextResponse.json(
      { message: "verification email sent" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({message: error.message},{status: 401})
  }
}
