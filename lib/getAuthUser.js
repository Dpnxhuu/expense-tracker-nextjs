import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";

const tokenSchema = z.object({
  userId: z.number(),
  tokenVersion: z.number(),
});

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  // console.log("TOKEN:", token ? "present" : "MISSING");   // 👈 ye add karo

  if (!token) return null;

  try {
    const decoded = tokenSchema.parse(jwt.verify(token, process.env.JWT_SECRET));
    // console.log("DECODED:", decoded)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, isVerified: true, tokenVersion: true },
    });
    // console.log("USER FROM DB:", user);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return null;
    }

    // console.log(user)
    return user;
  } catch (error) {
    // console.log("CATCH ERROR:", error.message);
    return null;
  }
}