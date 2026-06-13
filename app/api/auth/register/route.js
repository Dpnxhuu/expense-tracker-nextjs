import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const [existing] = await db.query("SELECT * FROM users where email = ?", [
      email,
    ]);

    if (existing.length > 0) throw new Error("Email already exist");

    const hashedPass = await bcrypt.hash(password, 10);

    const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await db.query(
      "INSERT INTO users (name, email, password, verification_token) VALUES (?,?,?,?)",
      [name, email, hashedPass, token],
    );

    sendVerificationEmail(email, token);

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
