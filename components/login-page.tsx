"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

interface LoginPageProps {
  onLogin: (email: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      setIsLoading(false)
      return
    }

    const response = await api.login(email, password)
    setIsLoading(false)

    if (response.error) {
      setError(response.error)
      toast.error("Login failed", {
        description: response.error,
      })
      return
    }

    if (response.data) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userEmail", response.data.user.email)
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      })
      onLogin(response.data.user.email)
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 text-3xl font-bold text-primary">SmartTask</div>
            <p className="text-sm text-muted-foreground">Manage your tasks with ease</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-center">Login</h2>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

