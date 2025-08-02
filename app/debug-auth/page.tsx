"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@auth0/nextjs-auth0"

export default function DebugAuthPage() {
  const { user, isLoading, error } = useUser()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const testAuthFlow = async () => {
    try {
      // Test the login endpoint
      const response = await fetch('/auth/login')
      setDebugInfo({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      })
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const testProfile = async () => {
    try {
      const response = await fetch('/auth/profile')
      const data = await response.json()
      setDebugInfo({ profile: data, status: response.status })
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Auth0 Debug Page</CardTitle>
            <CardDescription>
              Debug authentication flow and test endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Authentication Status</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                  <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
                  {user && (
                    <div>
                      <p><strong>User:</strong></p>
                      <pre className="text-xs bg-gray-100 p-2 rounded">
                        {JSON.stringify(user, null, 2)}
                      </pre>
                    </div>
                  )}
                  {error && (
                    <div>
                      <p><strong>Error:</strong></p>
                      <pre className="text-xs bg-red-100 p-2 rounded text-red-600">
                        {error.message}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Actions</h3>
                <div className="space-y-2">
                  <a href="/auth/login">
                    <Button className="w-full">
                      Test Login Redirect
                    </Button>
                  </a>
                  <Button onClick={testAuthFlow} variant="outline" className="w-full">
                    Test Auth Flow
                  </Button>
                  <Button onClick={testProfile} variant="outline" className="w-full">
                    Test Profile
                  </Button>
                  {user && (
                    <a href="/auth/logout">
                      <Button variant="destructive" className="w-full">
                        Logout
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {debugInfo && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Debug Info</h3>
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auth0 Configuration Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✅ Make sure your Auth0 application has these URLs configured:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Allowed Callback URLs:</strong> <code>http://localhost:3000/auth/callback</code></li>
                <li><strong>Allowed Logout URLs:</strong> <code>http://localhost:3000</code></li>
                <li><strong>Allowed Web Origins:</strong> <code>http://localhost:3000</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 