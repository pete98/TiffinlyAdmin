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
    
    return NextResponse.json(session.user);
  } catch (error) {
    console.error('Error getting user info:', error);
    return NextResponse.json({ error: 'Failed to get user info' }, { status: 500 });
  }
} 