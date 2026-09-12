export {auth as proxy} from "./auth"

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