import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout successfull" },
      { status: 200 },
    );

    response.cookies.delete("token");

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout faild" }, { status: 400 });
  }
}
