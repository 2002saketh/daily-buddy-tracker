import type { Message } from "@/components/chat-interface"

export interface ConversationContext {
  userMood: number
  productivity: number
  goals: string[]
  previousMessages: Array<{ role: string; content: string }>
  userName: string
}

// Sentiment keywords for emotion detection
const sentimentKeywords = {
  low: ["sad", "depressed", "down", "low", "tired", "exhausted", "overwhelmed", "stressed", "anxious", "frustrated"],
  excited: ["happy", "excited", "great", "amazing", "awesome", "wonderful", "fantastic", "excellent", "motivated"],
  neutral: ["okay", "fine", "alright", "normal", "average", "decent", "so-so"],
}

/**
 * Analyze user message sentiment to detect mood
 */
export function analyzeSentiment(message: string): "low" | "excited" | "neutral" {
  const lower = message.toLowerCase()

  if (sentimentKeywords.low.some((word) => lower.includes(word))) {
    return "low"
  }
  if (sentimentKeywords.excited.some((word) => lower.includes(word))) {
    return "excited"
  }
  return "neutral"
}

/**
 * Generate intelligent responses based on user input and context
 */
export function generateIntelligentResponse(
  userMessage: string,
  context: ConversationContext,
  useSimulated: boolean,
): string {
  const sentiment = analyzeSentiment(userMessage)
  const lower = userMessage.toLowerCase()

  // Empathetic response for low mood
  if (sentiment === "low") {
    const lowMoodResponses = [
      `I hear you, ${context.userName}. Those days happen to everyone. 💙 What's one small thing that could make today a bit better?`,
      `That sounds tough. Remember, you've overcome challenges before. Want to talk about what's weighing on you?`,
      `I'm here for you. Sometimes the best thing is to take a break and be gentle with yourself. How can I help?`,
      `Bad days are temporary, but your resilience is permanent. Let's focus on what you can control right now.`,
      `It's okay to not be okay. Let's identify one positive step forward, no matter how small. 🌱`,
    ]
    return lowMoodResponses[Math.floor(Math.random() * lowMoodResponses.length)]
  }

  // Celebratory response for excitement
  if (sentiment === "excited") {
    const excitedResponses = [
      `That's amazing, ${context.userName}! 🎉 Your energy is contagious. Keep riding this wave!`,
      `Yes! I love this enthusiasm! What's next on your list? Let's keep this momentum going! 🚀`,
      `This is incredible! You're crushing it. How does this success feel? 🌟`,
      `Wow, that's awesome! You deserve to celebrate this. What did you do to achieve it?`,
    ]
    return excitedResponses[Math.floor(Math.random() * excitedResponses.length)]
  }

  // Goal-related responses
  if (lower.includes("goal") || lower.includes("target") || lower.includes("objective")) {
    if (context.goals.length > 0) {
      const goalResponses = [
        `Great question! You've got ${context.goals.length} goals for today. My top advice: focus on the most important one first. Which matters most to you?`,
        `I see you have ${context.goals.length} goals today. Let's prioritize—which one would make you feel most accomplished if you finished it?`,
        `Your goals are ${context.goals.join(", ")}. Remember, progress over perfection. Pick one and start small. 💪`,
      ]
      return goalResponses[Math.floor(Math.random() * goalResponses.length)]
    } else {
      return `I don't see any goals set yet. What's one thing you'd like to accomplish today? Setting a goal helps create direction. 🎯`
    }
  }

  // Productivity tracking
  if (lower.includes("productivity") || lower.includes("productive") || lower.includes("focus")) {
    return `Your productivity today is at ${context.productivity}/10. ${
      context.productivity >= 7
        ? "That's solid! Keep it up!"
        : "Let's boost it. What's one distraction you can remove right now?"
    }`
  }

  // Mood tracking
  if (lower.includes("how are you") || lower.includes("mood") || lower.includes("feeling")) {
    return `I'm here and ready to help! 😊 Your mood today is ${context.userMood}/10. Want to talk about what's influencing that?`
  }

  // Reflection prompts
  if (lower.includes("reflect") || lower.includes("reflection")) {
    const reflectionPrompts = [
      `Let's reflect: What was one win today, no matter how small?`,
      `Reflection time: What did you learn about yourself today?`,
      `Think back: What would you do differently tomorrow? 🤔`,
      `Reflection moment: What are you grateful for today?`,
    ]
    return reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
  }

  // Default supportive responses
  const defaultResponses = [
    `I hear you! Tell me more about that. 👂`,
    `That's interesting. How did that make you feel?`,
    `I'm following you. What's your take on this?`,
    `Got it! What would help you most right now?`,
    `That's something to think about. Any ideas on next steps?`,
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

/**
 * Build conversation memory from localStorage
 */
export function getConversationHistory(): Message[] {
  try {
    const stored = localStorage.getItem("dailybuddy_chat_history")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save conversation to localStorage
 */
export function saveConversationHistory(messages: Message[]): void {
  try {
    localStorage.setItem("dailybuddy_chat_history", JSON.stringify(messages))
  } catch {
    console.error("[v0] Failed to save conversation history")
  }
}

/**
 * Create AI system prompt that references user context
 */
export function buildSystemPrompt(context: ConversationContext): string {
  return `You are DailyBuddy, an AI companion designed to help ${context.userName} track daily habits, mood, productivity, and goals.

Your personality:
- Friendly, warm, and genuinely supportive like a real buddy
- Conversational and natural (avoid robotic language)
- Motivating but realistic (no empty platitudes)
- Empathetic to emotions while being action-oriented
- Use occasional emojis naturally (not overboard)
- Remember context from the conversation
- Ask follow-up questions to show genuine care

Current context:
- User's mood today: ${context.userMood}/10
- Productivity level: ${context.productivity}/10
- Today's goals: ${context.goals.length > 0 ? context.goals.join(", ") : "No goals set yet"}

Your role:
1. Listen empathetically to how they're feeling
2. If mood is low: offer support and help them identify one small positive step
3. If mood is high: celebrate with them and encourage maintaining momentum
4. Help them reflect on progress toward goals
5. Provide actionable suggestions, not generic advice
6. Keep responses concise (2-3 sentences typically)
7. Be genuinely interested in their day and challenges
8. Occasionally ask about mood or productivity to encourage tracking

Remember: You're a buddy, not a therapist. Be supportive but know your limits.`
}
