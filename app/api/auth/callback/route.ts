import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(`${process.env.APP_BASE_URL}/?error=${error}`);
  }
  
  if (!code) {
    return NextResponse.redirect(`${process.env.APP_BASE_URL}/?error=no_code`);
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.APP_BASE_URL}/api/auth/callback`,
        // Add audience parameter to get JWT tokens instead of opaque tokens
        ...(process.env.AUTH0_AUDIENCE && { audience: process.env.AUTH0_AUDIENCE }),
      }),
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || 'Failed to exchange code for tokens');
    }
    
    // Get user info
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    
    const user = await userResponse.json();
    
    // Determine redirect URL - default to dashboard if no state or if state is just '/'
    const redirectUrl = state && state !== '/' ? state : '/dashboard';
    
    // Create session response
    const response = NextResponse.redirect(`${process.env.APP_BASE_URL}${redirectUrl}`);
    
    // Set secure session cookie
    response.cookies.set('auth0_session', JSON.stringify({
      user,
      access_token: tokens.access_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${process.env.APP_BASE_URL}/?error=auth_failed`);
  }
} 