"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChatInterface } from "@/components/chat-interface"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface MainAppProps {
  user: { name: string; pin?: string }
  onLogout: () => void
}

type View = "chat" | "dashboard"

export function MainApp({ user, onLogout }: MainAppProps) {
  const [view, setView] = useState<View>("chat")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:relative fixed h-full z-50"
      >
        <Sidebar
          user={user}
          view={view}
          onViewChange={setView}
          onLogout={onLogout}
          onClose={() => isMobile && setSidebarOpen(false)}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DailyBuddy
          </h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {view === "chat" && <ChatInterface user={user} />}
          {view === "dashboard" && <Dashboard user={user} />}
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </div>
  )
}
