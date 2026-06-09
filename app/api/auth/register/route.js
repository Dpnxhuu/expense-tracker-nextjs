import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const [existing] = await db.query("SELECT * FROM users where email = ?", [
      email,
    ]);

    if (existing.length > 0) throw new Error("Email already exist");

    const hashedPass = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?,?,?)",
      [name, email, hashedPass],
    );

    const token = jwt.sign(
      { userId: result.insertId, name, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 },
    );
  }
}
