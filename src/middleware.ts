import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// Prefer WORKOS_REDIRECT_URI but keep backward compatibility with AUTHKIT_REDIRECT_URI
const redirectUri =
  process.env.WORKOS_REDIRECT_URI || process.env.AUTHKIT_REDIRECT_URI;

export default authkitMiddleware({
  redirectUri,
});
export const config = {
  // Run middleware broadly for app routes, but avoid intercepting the
  // dynamically-generated auth URL endpoint we implement at /api/auth/urls.
  // Explicitly list the auth API endpoints that need middleware instead
  // of using a broad `/api/auth/:path*` pattern.
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
    "/",
    "/api/auth/callback",
    "/api/auth/post-auth",
    "/api/auth/me",
    "/api/auth/ensure-membership",
    "/api/auth/logout",
  ],
};
