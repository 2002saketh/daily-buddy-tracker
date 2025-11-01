"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, BarChart3, LogOut, TrendingUp, Heart, Target, Zap } from "lucide-react"

interface SidebarProps {
  user: { name: string; pin?: string }
  view: "chat" | "dashboard"
  onViewChange: (view: "chat" | "dashboard") => void
  onLogout: () => void
  onClose?: () => void
}

interface DailyData {
  date: string
  mood: number
  productivity: number
  goals: string[]
  streak: number
}

export function Sidebar({ user, view, onViewChange, onLogout, onClose }: SidebarProps) {
  const [dailyData, setDailyData] = useState<DailyData>({
    date: new Date().toISOString().split("T")[0],
    mood: 5,
    productivity: 5,
    goals: [],
    streak: 1,
  })
  const [goalInput, setGoalInput] = useState("")

  useEffect(() => {
    // Load daily data from localStorage
    const savedData = localStorage.getItem("dailybuddy_data")
    if (savedData) {
      setDailyData(JSON.parse(savedData))
    }
  }, [])

  const saveDailyData = (data: DailyData) => {
    setDailyData(data)
    localStorage.setItem("dailybuddy_data", JSON.stringify(data))
  }

  const addGoal = () => {
    if (goalInput.trim()) {
      const updated = {
        ...dailyData,
        goals: [...dailyData.goals, goalInput],
      }
      saveDailyData(updated)
      setGoalInput("")
    }
  }

  const removeGoal = (index: number) => {
    const updated = {
      ...dailyData,
      goals: dailyData.goals.filter((_, i) => i !== index),
    }
    saveDailyData(updated)
  }

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😢"
    if (mood <= 4) return "😐"
    if (mood <= 6) return "🙂"
    if (mood <= 8) return "😊"
    return "🤩"
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-600 to-purple-600 text-white w-full p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">DailyBuddy</h1>
        <p className="text-blue-100 text-sm">Welcome, {user.name}!</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => {
            onViewChange("chat")
            onClose?.()
          }}
          variant={view === "chat" ? "default" : "ghost"}
          className={`flex-1 ${
            view === "chat" ? "bg-white text-purple-600 hover:bg-gray-100" : "text-white hover:bg-white/20"
          }`}
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
        <Button
          onClick={() => {
            onViewChange("dashboard")
            onClose?.()
          }}
          variant={view === "dashboard" ? "default" : "ghost"}
          className={`flex-1 ${
            view === "dashboard" ? "bg-white text-purple-600 hover:bg-gray-100" : "text-white hover:bg-white/20"
          }`}
          size="sm"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Insights
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-semibold">Streak</span>
          </div>
          <p className="text-3xl font-bold">{dailyData.streak}</p>
          <p className="text-blue-100 text-xs">days active</p>
        </motion.div>

        {/* Mood Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-300" />
            <span className="text-sm font-semibold">Mood Today</span>
          </div>
          <p className="text-2xl mb-2">{getMoodEmoji(dailyData.mood)}</p>
          <input
            type="range"
            min="1"
            max="10"
            value={dailyData.mood}
            onChange={(e) =>
              saveDailyData({
                ...dailyData,
                mood: Number.parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-300"
          />
          <p className="text-xs text-blue-100 mt-2">{dailyData.mood}/10</p>
        </motion.div>

        {/* Productivity Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-300" />
            <span className="text-sm font-semibold">Productivity</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={dailyData.productivity}
            onChange={(e) =>
              saveDailyData({
                ...dailyData,
                productivity: Number.parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-green-300"
          />
          <p className="text-xs text-blue-100 mt-2">{dailyData.productivity}/10</p>
        </motion.div>

        {/* Daily Goals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-200" />
            <span className="text-sm font-semibold">Today's Goals</span>
          </div>
          <div className="space-y-2 mb-3">
            {dailyData.goals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-white/10 rounded p-2 text-xs"
              >
                <input type="checkbox" className="w-4 h-4" />
                <span className="flex-1">{goal}</span>
                <button onClick={() => removeGoal(index)} className="text-blue-200 hover:text-white">
                  ×
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addGoal()}
              placeholder="Add a goal..."
              className="h-8 text-xs bg-white/20 border-white/30 text-white placeholder:text-blue-100"
            />
            <Button onClick={addGoal} size="sm" className="h-8 bg-white text-purple-600 hover:bg-gray-100">
              +
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Logout Button */}
      <Button onClick={onLogout} variant="ghost" className="w-full text-blue-100 hover:bg-white/20 mt-4" size="sm">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  )
}
