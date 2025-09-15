import { NextRequest } from "next/server";

export async function getServerSession(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('auth0_session');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (session.expires_at && Date.now() > session.expires_at) {
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(request);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
