"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

interface TokenData {
  access_token: string
  expires_at: number
  user: {
    name: string
    email: string
    sub: string
  }
}

export function AccessTokenDisplay() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showToken, setShowToken] = useState(false)

  const fetchAccessToken = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/auth/access-token')
      if (response.status === 200) {
        const data = response.data
        setTokenData(data)
        toast({
          title: "Access Token Retrieved",
          description: "Successfully fetched your access token.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to retrieve access token",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to retrieve access token",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (tokenData?.access_token) {
      try {
        await navigator.clipboard.writeText(tokenData.access_token)
        toast({
          title: "Copied!",
          description: "Access token copied to clipboard",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        })
      }
    }
  }

  const formatExpiryDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const isExpired = tokenData?.expires_at ? Date.now() > tokenData.expires_at : false

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Access Token
          <Badge variant={isExpired ? "destructive" : "default"}>
            {isExpired ? "Expired" : "Valid"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Retrieve and manage your Auth0 access token for API calls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!tokenData ? (
          <Button 
            onClick={fetchAccessToken} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrieving...
              </>
            ) : (
              "Get Access Token"
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Expires: {formatExpiryDate(tokenData.expires_at)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAccessToken}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {showToken && (
              <div className="relative">
                <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                  {tokenData.access_token}
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <div>User: {tokenData.user.name}</div>
              <div>Email: {tokenData.user.email}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 