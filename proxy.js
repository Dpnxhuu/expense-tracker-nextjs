import { NextResponse } from 'next/server';

const AUTH_PAGES = new Set([
  "/",
  "/login",
  "/signup",
  "/signup/email",
  "/forgot-password"
])

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const isAuthPage = AUTH_PAGES.has(pathname);
  const isProtected = pathname === '/home' || pathname.startsWith("/home/")
  const isResetPage = pathname === "/forgot-password/reset-password";

  if (isResetPage) {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
  }

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/home", request.url))
    }
  }

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/home/:path*",
    "/login",
    "/signup/:path*",
    "/forgot-password/:path*",
  ],
};