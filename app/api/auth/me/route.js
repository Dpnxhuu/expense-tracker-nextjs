import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import Email from "@/app/signup/email/page";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 404 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json(
      { userId: decoded.userId, name: decoded.name, email: decoded.email },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "not authenticated" }, { status: 500 });
  }
}
