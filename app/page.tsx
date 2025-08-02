import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth0_session');
  
  // If user is already authenticated, redirect to dashboard
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      
      // Check if session has required fields and is not expired
      if (session.user && session.expires_at && Date.now() < session.expires_at) {
        redirect('/dashboard');
      }
    } catch (error) {
      // Invalid session JSON, continue to show login page
      console.log('Invalid session cookie:', error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Tiffin Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to access the admin dashboard
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Link
              href="/api/auth/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Auth0
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
