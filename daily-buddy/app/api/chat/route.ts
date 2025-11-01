import { streamText, convertToModelMessages } from "ai"
import { buildSystemPrompt, generateIntelligentResponse } from "@/lib/ai-utils"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, userMessage, context, aiMode } = await req.json()

  if (aiMode === "simulated") {
    const response = generateIntelligentResponse(userMessage, context, true)

    // Convert to streaming response format
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(response))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const result = streamText({
    model: "openai/gpt-4-turbo",
    system: buildSystemPrompt(context),
    messages: convertToModelMessages(messages),
  })

  return result.toTextStreamResponse()
}
