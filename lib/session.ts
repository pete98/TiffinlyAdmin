import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface User {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
  updated_at: string;
}

export async function getSession(request?: NextRequest): Promise<User | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('auth_session');
  
  if (!sessionToken) {
    return null;
  }
  
  try {
    // In a real implementation, you'd verify the session token
    // For now, we'll just decode it as JSON
    const user = JSON.parse(sessionToken.value);
    return user;
  } catch {
    return null;
  }
}

export async function setSession(user: User) {
  const cookieStore = cookies();
  cookieStore.set('auth_session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('auth_session');
} 