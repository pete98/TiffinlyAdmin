import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if the user is authenticated by looking for the session cookie
  const session = request.cookies.get('auth0_session');
  
  // Only protect dashboard routes, not the home page
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/kitchens') ||
      request.nextUrl.pathname.startsWith('/stores') ||
      request.nextUrl.pathname.startsWith('/products') ||
      request.nextUrl.pathname.startsWith('/menu-items') ||
      request.nextUrl.pathname.startsWith('/orders') ||
      request.nextUrl.pathname.startsWith('/users')) {
    
    // If no session and trying to access protected routes, redirect to login
    if (!session) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if session is expired
    try {
      const sessionData = JSON.parse(session.value);
      if (sessionData.expires_at && Date.now() > sessionData.expires_at) {
        const loginUrl = new URL('/api/auth/login', request.url);
        loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
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
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth).*)",
  ],
}; 