"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function AccessTokenDemo() {
  const [loading, setLoading] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const { toast } = useToast()

  const fetchAccessToken = async () => {
    setLoading(true)
    try {
      // Use the SDK's exposed endpoint for client-side access token retrieval
      const response = await fetch('/auth/access-token')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTokenInfo(data)
      
      toast({
        title: "Access token retrieved",
        description: "Successfully fetched access token from client side",
      })
    } catch (error) {
      console.error('Error fetching access token:', error)
      toast({
        title: "Error fetching access token",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testProtectedRoute = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/protected')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTokenInfo(data)
      
      toast({
        title: "Protected route accessed",
        description: "Successfully accessed protected API route",
      })
    } catch (error) {
      console.error('Error accessing protected route:', error)
      toast({
        title: "Error accessing protected route",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Auth0 Access Token Demo</CardTitle>
        <CardDescription>
          Test access token retrieval and protected routes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button 
            onClick={fetchAccessToken} 
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Get Access Token"}
          </Button>
          
          <Button 
            onClick={testProtectedRoute} 
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Test Protected Route"}
          </Button>
        </div>
        
        {tokenInfo && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Response:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(tokenInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 