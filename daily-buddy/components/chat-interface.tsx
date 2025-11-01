"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ExtendedMessage extends Message {
  context?: {
    mood: number
    productivity: number
    goals: string[]
  }
}

interface ChatInterfaceProps {
  user: { name: string; pin?: string }
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ExtendedMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiMode, setAiMode] = useState<"smart" | "simulated">("smart")
  const [dailyData, setDailyData] = useState({ mood: 5, productivity: 5, goals: [] })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem("dailybuddy_chat_history")
    if (savedHistory) {
      const history = JSON.parse(savedHistory)
      setMessages(history)
    } else {
      // First time - show welcome
      const welcomeMessage: ExtendedMessage = {
        id: "welcome",
        role: "assistant",
        content: `Hey ${user.name}! 👋 I'm DailyBuddy, your AI companion. I remember our conversations and learn about your habits, moods, and goals. How are you feeling today?`,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }

    // Load daily tracking data
    const savedData = localStorage.getItem("dailybuddy_data")
    if (savedData) {
      const data = JSON.parse(savedData)
      setDailyData({
        mood: data.mood || 5,
        productivity: data.productivity || 5,
        goals: data.goals || [],
      })
    }
  }, [user.name])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("dailybuddy_chat_history", JSON.stringify(messages))
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ExtendedMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      context: { mood: dailyData.mood, productivity: dailyData.productivity, goals: dailyData.goals },
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: input,
          context: {
            userMood: dailyData.mood,
            productivity: dailyData.productivity,
            goals: dailyData.goals,
            userName: user.name,
          },
          aiMode,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value)
      }

      const assistantMessage: ExtendedMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error getting AI response:", error)
      const errorMessage: ExtendedMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I hit a snag. Let's try again? 💙`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with AI Mode Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50 md:px-6">
        <h2 className="font-semibold text-gray-800">Chat with DailyBuddy</h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-600">AI Mode:</span>
            <select
              value={aiMode}
              onChange={(e) => setAiMode(e.target.value as "smart" | "simulated")}
              className="px-2 py-1 rounded border border-gray-300 text-xs"
            >
              <option value="smart">Smart Buddy</option>
              <option value="simulated">Simulated</option>
            </select>
          </label>
        </div>
      </div>

      {/* Messages Container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-100 text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 md:p-6 bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Share your thoughts, mood, or ask for advice..."
            disabled={loading}
            className="bg-gray-50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="icon"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
