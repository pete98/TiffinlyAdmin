"use client"

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ChefHat } from 'lucide-react'

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <ChefHat className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Tiffin Admin</CardTitle>
            <CardDescription className="text-base">
              Welcome back! Sign in to manage your tiffin service
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={login} 
            className="w-full h-12 text-base font-medium bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            Sign In with Auth0
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Secure authentication powered by Auth0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 