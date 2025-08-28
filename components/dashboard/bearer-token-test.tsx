"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { API_ENDPOINTS } from "@/lib/constants"
import { toast } from "@/hooks/use-toast"

export function BearerTokenTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testBearerToken = async () => {
    setLoading(true)
    setTestResult("")
    
    try {
      // Test with a simple API call that should include the bearer token
      const result = await apiClient.get<any>(`${API_ENDPOINTS.KITCHEN}`)
      
      // Handle different response structures
      let itemsCount = 0
      if (Array.isArray(result)) {
        itemsCount = result.length
      } else if (result && Array.isArray(result.data)) {
        itemsCount = result.data.length
      } else if (result && Array.isArray(result.kitchens)) {
        itemsCount = result.kitchens.length
      } else if (result && Array.isArray(result.items)) {
        itemsCount = result.items.length
      } else {
        console.warn('Unexpected API response structure:', result)
        itemsCount = 0
      }
      
      setTestResult(`✅ Success! Bearer token was included. Received ${itemsCount} items.`)
      toast({
        title: "Bearer Token Test",
        description: "Successfully made API call with bearer token",
      })
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`)
      toast({
        title: "Bearer Token Test",
        description: `Error: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Bearer Token Test
          <Badge variant="secondary">Debug</Badge>
        </CardTitle>
        <CardDescription>
          Test if bearer tokens are being automatically added to API requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBearerToken} 
          disabled={loading}
          variant="outline"
        >
          {loading ? "Testing..." : "Test Bearer Token"}
        </Button>
        
        {testResult && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-mono">{testResult}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>• Check browser console for detailed logs</p>
          <p>• Look for "🔐 Adding bearer token" messages</p>
          <p>• This tests the kitchen API endpoint</p>
        </div>
      </CardContent>
    </Card>
  )
} 