import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "invalid token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const verificationToken = jwt.sign(
      { name: decoded.name, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    const [result] = await db.query(
      "UPDATE users SET verification_token = ? WHERE email = ?",
      [verificationToken, decoded.email],
    );

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }

    sendVerificationEmail(decoded.email, verificationToken);

    return NextResponse.json(
      { message: "verification email sent" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({message: error.message},{status: 401})
  }
}
