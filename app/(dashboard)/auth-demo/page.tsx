import { SessionInfo } from "@/components/auth/session-info"
import { AccessTokenDemo } from "@/components/auth/access-token-demo"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"

export default function AuthDemoPage() {
  return (
    <div className="space-y-6">
      <DashboardTitle 
        title="Auth0 Integration Demo" 
        description="Test authentication, sessions, and access tokens" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SessionInfo />
        <AccessTokenDemo />
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Available Auth0 Endpoints:</h3>
        <ul className="text-sm space-y-1">
          <li><code>/auth/login</code> - Sign in with Auth0</li>
          <li><code>/auth/logout</code> - Sign out</li>
          <li><code>/auth/callback</code> - Auth0 callback (handled automatically)</li>
          <li><code>/auth/profile</code> - Get user profile</li>
          <li><code>/auth/access-token</code> - Get access token (client-side)</li>
        </ul>
      </div>
    </div>
  )
} 