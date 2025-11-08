"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("userEmail")
    if (token && email) {
      setUserEmail(email)
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    setIsAuthenticated(false)
    setUserEmail("")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main>
      <Dashboard userEmail={userEmail} onLogout={handleLogout} />
    </main>
  )
}
