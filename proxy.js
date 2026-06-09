import { NextResponse } from 'next/server'

const AUTH_PAGES = new Set([
  "/",
  "/login",
  "/signup",
  "/signup/email"
])

export function middleware(request) {
  
const token = request.cookies.get("token")?.value;
const {pathname} = request.nextUrl;

const isAuthPage = AUTH_PAGES.has(pathname);
const isProtected = pathname === '/home' || pathname.startsWith("/home/")

if(isAuthPage){
  if(token){
    return NextResponse.redirect(new URL("/home", request.url))
  }
}

if(isProtected){
  if(!token){
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup/:path*",
    "/home"
  ],
};