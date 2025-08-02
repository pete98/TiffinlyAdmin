import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession(request);
    
    if (!user) {
      return Response.json({ user: null }, { status: 401 });
    }
    
    return Response.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return Response.json({ user: null }, { status: 500 });
  }
} 