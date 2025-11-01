"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardProps {
  user: { name: string; pin?: string }
}

interface ChartData {
  date: string
  mood: number
  productivity: number
  happiness: number
}

interface DailyData {
  date: string
  mood: number
  productivity: number
  goals: string[]
  streak: number
}

export function Dashboard({ user }: DashboardProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [stats, setStats] = useState({
    avgMood: 0,
    avgProductivity: 0,
    totalGoalsCompleted: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    const savedData = localStorage.getItem("dailybuddy_data")
    const conversations = JSON.parse(localStorage.getItem("dailybuddy_conversations") || "[]")

    // Generate chart data for the week
    const data: ChartData[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      // Parse saved data if it exists
      let mood = 6
      let productivity = 6
      if (savedData) {
        const parsed = JSON.parse(savedData) as DailyData
        if (parsed.date === date.toISOString().split("T")[0]) {
          mood = parsed.mood
          productivity = parsed.productivity
        }
      }

      data.push({
        date: dateStr,
        mood: mood,
        productivity: productivity,
        happiness: Math.round((mood + productivity) / 2),
      })
    }
    setChartData(data)

    // Calculate stats from saved data
    if (savedData) {
      const parsed = JSON.parse(savedData) as DailyData
      const avgMood = parsed.mood
      const avgProductivity = parsed.productivity
      const totalGoalsCompleted = parsed.goals.length
      const currentStreak = parsed.streak

      setStats({
        avgMood,
        avgProductivity,
        totalGoalsCompleted,
        currentStreak,
      })
    } else {
      // Fallback to generated stats
      const avgMood = Math.round(data.reduce((sum, d) => sum + d.mood, 0) / data.length)
      const avgProductivity = Math.round(data.reduce((sum, d) => sum + d.productivity, 0) / data.length)
      setStats({
        avgMood,
        avgProductivity,
        totalGoalsCompleted: 0,
        currentStreak: 1,
      })
    }
  }, [])

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Your Insights</h1>
        <p className="text-muted-foreground">Track your progress and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Avg Mood",
            value: stats.avgMood,
            suffix: "/10",
            color: "from-pink-500 to-red-500",
          },
          {
            label: "Productivity",
            value: stats.avgProductivity,
            suffix: "/10",
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Goals Done",
            value: stats.totalGoalsCompleted,
            suffix: "",
            color: "from-purple-500 to-indigo-500",
          },
          {
            label: "Current Streak",
            value: stats.currentStreak,
            suffix: " days",
            color: "from-yellow-500 to-orange-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                  <span className="text-base">{stat.suffix}</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Productivity Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
              <CardDescription>Your mood and productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Happiness Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Happiness Index</CardTitle>
              <CardDescription>Daily happiness levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHappiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="happiness"
                    stroke="#a78bfa"
                    fillOpacity={1}
                    fill="url(#colorHappiness)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Consistency Overview</CardTitle>
              <CardDescription>Your metrics across the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="mood" fill="#ec4899" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="productivity" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="happiness" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
