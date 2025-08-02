import { NextRequest } from "next/server";
import { clearSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  // Clear the session
  await clearSession();
  
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const returnTo = process.env.APP_BASE_URL;
  
  const logoutUrl = new URL('/v2/logout', auth0Domain);
  logoutUrl.searchParams.set('client_id', clientId);
  logoutUrl.searchParams.set('returnTo', returnTo);
  
  return Response.redirect(logoutUrl.toString());
} 