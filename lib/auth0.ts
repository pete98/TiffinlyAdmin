// Auth0 configuration for Next.js v4 SDK
// The SDK automatically reads from environment variables
// No need to create a client instance manually

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  baseURL: process.env.APP_BASE_URL,
  secret: process.env.AUTH0_SECRET,
}; 