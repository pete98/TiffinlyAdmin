import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = `${process.env.APP_BASE_URL}/auth/callback`;
  
  const authUrl = new URL('/authorize', auth0Domain);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', Buffer.from(JSON.stringify({ returnTo: process.env.APP_BASE_URL })).toString('base64'));
  
  return Response.redirect(authUrl.toString());
} 