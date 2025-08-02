import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold">Auth0 Integration Test</CardTitle>
          <CardDescription>
            Test the Auth0 integration endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/api/auth/login">
              <Button className="w-full" variant="outline">
                Test Login Redirect
              </Button>
            </Link>
            
            <Link href="/api/auth/profile">
              <Button className="w-full" variant="outline">
                Test Profile (should fail if not authenticated)
              </Button>
            </Link>
            
            <Link href="/api/protected">
              <Button className="w-full" variant="outline">
                Test Protected Route (should fail if not authenticated)
              </Button>
            </Link>
            
            <Link href="/auth-demo">
              <Button className="w-full">
                Go to Auth Demo Page
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Check the network tab to see the redirects and responses</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 