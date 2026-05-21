"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "./api"

interface User {
  id: number
  email: string
  name: string
  role: "student" | "staff" | "admin" | "external"
  department?: string
  phone?: string
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem("auth_token")
    if (token) {
      validateToken()
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async () => {
    try {
      const response = await apiService.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    try {
      const response = await apiService.login(email, password)

      // Store token and user data
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}!`,
      })

      setLoading(false)
      return true
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      setLoading(false)
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true)

    try {
      const response = await apiService.register({
        ...userData,
        password_confirmation: userData.confirmPassword,
      })

      // Store token and user data
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)

      toast({
        title: "Registration Successful",
        description: `Welcome, ${response.user.name}!`,
      })

      setLoading(false)
      return true
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Registration failed",
        variant: "destructive",
      })
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      // Even if logout fails on server, we still clear local data
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth_token")
      setUser(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
