"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("userEmail")
    if (token && email) {
      router.push("/")
    }
  }, [router])

  const handleLogin = (email: string) => {
    setIsAuthenticated(true)
    router.push("/")
  }

  if (isAuthenticated) {
    return null
  }

  return <LoginPage onLogin={handleLogin} />
}

