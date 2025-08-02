import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = `${process.env.APP_BASE_URL}/api/auth/callback`;
  
  const authUrl = `https://${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid profile email&` +
    `state=${encodeURIComponent(returnTo)}&` +
    `prompt=login&` + // Force fresh login
    // Add audience parameter to get JWT tokens instead of opaque tokens
    `${process.env.AUTH0_AUDIENCE ? `audience=${encodeURIComponent(process.env.AUTH0_AUDIENCE)}&` : ''}`;
  
  return NextResponse.redirect(authUrl);
} 