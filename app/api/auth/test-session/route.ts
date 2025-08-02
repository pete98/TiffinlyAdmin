import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth0_session');
  
  if (!sessionCookie?.value) {
    return NextResponse.json({ 
      hasSession: false, 
      message: 'No session cookie found' 
    });
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    const isExpired = session.expires_at && Date.now() > session.expires_at;
    
    return NextResponse.json({
      hasSession: true,
      isExpired,
      user: session.user ? {
        name: session.user.name,
        email: session.user.email,
        sub: session.user.sub
      } : null,
      expiresAt: session.expires_at,
      currentTime: Date.now(),
      timeRemaining: session.expires_at ? session.expires_at - Date.now() : null
    });
  } catch (error) {
    return NextResponse.json({
      hasSession: false,
      message: 'Invalid session cookie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 