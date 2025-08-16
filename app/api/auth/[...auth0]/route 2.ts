import { handleAuth } from '@auth0/nextjs-auth0';

const handler = handleAuth();

export const GET = async (req: Request, context: { params: Promise<{ auth0: string[] }> }) => {
  const { params } = context;
  const resolvedParams = await params;
  return handler(req, { params: resolvedParams });
}; 