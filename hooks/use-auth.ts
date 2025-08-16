"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  sub: string
  name?: string
  email?: string
  picture?: string
  email_verified?: boolean
  updated_at: string
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/auth/profile')
      if (response.ok) {
        const user = await response.json()
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
    }
  }

  const login = () => {
    window.location.href = '/auth/login'
  }

  const logout = () => {
    window.location.href = '/auth/logout'
  }

  return {
    ...authState,
    login,
    logout,
    checkSession
  }
} 