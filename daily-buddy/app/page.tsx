"use client"

import { useState, useEffect } from "react"
import { AuthScreen } from "@/components/auth-screen"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [user, setUser] = useState<{ name: string; pin?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("dailybuddy_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleAuth = (userData: { name: string; pin?: string }) => {
    setUser(userData)
    localStorage.setItem("dailybuddy_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("dailybuddy_user")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            DailyBuddy
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <MainApp user={user} onLogout={handleLogout} /> : <AuthScreen onAuth={handleAuth} />
}
