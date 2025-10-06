import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware entirely for Next.js internals and public assets.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/waitlist") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if the user is authenticated by looking for the session cookie
  const session = request.cookies.get("auth0_session");

  // Only protect dashboard routes, not the home page
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/kitchens") ||
    pathname.startsWith("/stores") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/menu-items") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/users")
  ) {
    // If no session and trying to access protected routes, redirect to login
    if (!session) {
      const loginUrl = new URL("/api/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if session is expired
    try {
      const sessionData = JSON.parse(session.value);
      if (sessionData.expires_at && Date.now() > sessionData.expires_at) {
        const loginUrl = new URL("/api/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // Invalid session, redirect to login
      const loginUrl = new URL("/api/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - api/auth (Auth0 routes)
     * - api/waitlist (public waitlist submissions)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth|api/waitlist).*)",
  ],
};
