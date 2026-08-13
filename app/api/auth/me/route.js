import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Session expired, please login again" }, { status: 401 });
  }

  return NextResponse.json({ name: user.name, email: user.email, isVerified: user.isVerified });
}