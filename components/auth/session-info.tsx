"use client"

import { useUser } from "@auth0/nextjs-auth0"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SessionInfo() {
  const { user, isLoading, error } = useUser()

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading authentication status...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was an error loading your session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error: {error.message}</div>
          <a href="/auth/login">
            <Button className="w-full mt-4">
              Try Again
            </Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>You are not logged in</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/auth/login">
            <Button className="w-full">
              Sign In
            </Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome, {user.name || user.email}</CardTitle>
        <CardDescription>You are successfully authenticated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.picture} alt={user.name || user.email} />
            <AvatarFallback>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name || 'No name provided'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Session Details:</h4>
          <div className="text-xs space-y-1">
            <p><strong>User ID:</strong> {user.sub}</p>
            <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
            <p><strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}</p>
          </div>
        </div>

        <a href="/auth/logout">
          <Button variant="outline" className="w-full">
            Sign Out
          </Button>
        </a>
      </CardContent>
    </Card>
  )
} 