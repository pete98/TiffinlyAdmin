import { NextRequest } from "next/server";
import { setSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  if (error) {
    // Handle error
    return Response.redirect(new URL('/login?error=' + error, request.url));
  }
  
  if (!code) {
    // No authorization code
    return Response.redirect(new URL('/login?error=no_code', request.url));
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code: code,
        redirect_uri: `${process.env.APP_BASE_URL}/auth/callback`,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch(`${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }
    
    const user = await userResponse.json();
    
    // Set session
    await setSession(user);
    
    // Redirect to dashboard
    return Response.redirect(new URL('/dashboard', request.url));
    
  } catch (error) {
    console.error('Auth callback error:', error);
    return Response.redirect(new URL('/login?error=callback_failed', request.url));
  }
} 