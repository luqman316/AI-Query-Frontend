import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  redirectUri: process.env.AUTHKIT_REDIRECT_URI,
});
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)", "/"],
};
