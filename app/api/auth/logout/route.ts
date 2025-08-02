import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get('returnTo') || '/';
  
  // Create response to redirect to home page
  const response = NextResponse.redirect(`${process.env.APP_BASE_URL}${returnTo}`);
  
  // Add cache control headers to prevent caching
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  // Clear the session cookie more aggressively
  response.cookies.delete('auth0_session');
  
  // Also set it to empty with immediate expiration as backup
  response.cookies.set('auth0_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    expires: new Date(0), // Set to epoch time
  });
  
  return response;
} 