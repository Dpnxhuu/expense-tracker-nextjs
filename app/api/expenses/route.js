import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { message: "not authenticated" },
        { status: 400 },
      );

    const { amount, category, description, date } = await request.json();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await db.query(
      "INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?,?,?,?,?)",
      [decoded.userId, description, amount, category, date],
    );

    return NextResponse.json({ message: "Expense added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [expense] = await db.query(
      "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC",
      [decoded.userId],
    );

    return NextResponse.json({expense});
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
