"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface AuthScreenProps {
  onAuth: (user: { name: string; pin?: string }) => void
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [step, setStep] = useState<"name" | "pin" | "confirm">("name")

  const handleNameSubmit = () => {
    if (name.trim()) {
      setStep("pin")
    }
  }

  const handlePinSkip = () => {
    onAuth({ name: name.trim() })
  }

  const handlePinSubmit = () => {
    if (pin.length >= 4) {
      onAuth({ name: name.trim(), pin })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DailyBuddy
            </h1>
            <p className="text-muted-foreground">Your AI companion for daily growth</p>
          </div>

          {step === "name" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">What's your name?</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleNameSubmit()}
                  autoFocus
                  className="bg-gray-50"
                />
              </div>
              <Button
                onClick={handleNameSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === "pin" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Set a PIN (optional, 4+ digits)</label>
                <Input
                  type="password"
                  placeholder="1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  onKeyPress={(e) => e.key === "Enter" && pin.length >= 4 && handlePinSubmit()}
                  className="bg-gray-50"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-2">Protects your data on this device</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePinSkip} className="flex-1 bg-transparent">
                  Skip
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  disabled={pin.length < 4}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Set PIN
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
