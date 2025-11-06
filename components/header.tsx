"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

interface HeaderProps {
  userEmail: string
  onLogout: () => void
  stats: {
    total: number
    completed: number
    inProgress: number
    todo: number
  }
}

export function Header({ userEmail, onLogout, stats }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setIsDark(!isDark)
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">SmartTask Manager</h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-background">
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Tasks</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-background">
            <p className="text-xs font-medium text-muted-foreground uppercase">In Progress</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.inProgress}</p>
          </div>
          <div className="p-3 rounded-lg bg-background">
            <p className="text-xs font-medium text-muted-foreground uppercase">To Do</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.todo}</p>
          </div>
          <div className="p-3 rounded-lg bg-background">
            <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.completed}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
