import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('auth0_session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (session.expires_at && Date.now() > session.expires_at) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    
    if (!session.access_token) {
      return NextResponse.json({ error: 'No access token found in session' }, { status: 404 });
    }
    
    // Log token details for debugging
    console.log('Auth0 session token details:', {
      tokenType: typeof session.access_token,
      tokenLength: session.access_token?.length,
      tokenStartsWith: session.access_token?.substring(0, 20) + '...',
      isJWE: session.access_token?.startsWith('eyJ'),
      sessionKeys: Object.keys(session)
    });
    
    // Check if there are other token types available
    const availableTokens = {
      access_token: session.access_token,
      id_token: session.id_token,
      refresh_token: session.refresh_token,
      // Some Auth0 sessions might have different token types
      api_token: session.api_token,
      management_token: session.management_token
    };
    
    console.log('Available tokens in session:', Object.keys(availableTokens).filter(key => availableTokens[key]));
    
    return NextResponse.json({
      access_token: session.access_token,
      expires_at: session.expires_at,
      user: session.user,
      // Include other token types for debugging
      available_tokens: Object.keys(availableTokens).filter(key => availableTokens[key])
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
} 