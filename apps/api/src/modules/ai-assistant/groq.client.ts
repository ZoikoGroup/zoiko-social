import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '../config/config.service'

/**
 * Minimal client for Groq's OpenAI-compatible chat completions endpoint.
 *
 * Uses the runtime's built-in `fetch` rather than adding an SDK dependency — the
 * surface needed here is one POST. Every failure resolves to `null` instead of
 * throwing: a chat reply is best-effort, and an outage upstream must never
 * surface as an error in the member's inbox.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const REQUEST_TIMEOUT_MS = 20_000
/**
 * Headroom, not a target — the prompt asks for two to four sentences. Sized so a
 * reply is never cut mid-sentence: 400 truncated real answers once the model
 * changed to a more verbose one, which reads as a bug to the member.
 */
const MAX_REPLY_TOKENS = 700
const TEMPERATURE = 0.6

export interface ToolCallRequest {
  id: string
  name: string
  /** Raw JSON string produced by the model — validate before trusting it. */
  arguments: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  /** Set when replaying an assistant turn that asked for tools. */
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[]
  /** Set on a 'tool' message, linking a result back to its request. */
  tool_call_id?: string
}

/** A function the model may ask us to run. `parameters` is a JSON Schema object. */
export interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface CompletionResult {
  content: string | null
  toolCalls: ToolCallRequest[]
}

interface GroqChoice {
  message?: {
    content?: string | null
    tool_calls?: { id?: string; function?: { name?: string; arguments?: string } }[]
  }
}

interface GroqResponse {
  choices?: GroqChoice[]
}

@Injectable()
export class GroqClient {
  private readonly logger = new Logger(GroqClient.name)

  constructor(private readonly config: ConfigService) {}

  get enabled(): boolean {
    return this.config.groqEnabled
  }

  /** Plain text completion. Returns the reply, or null if it could not be generated. */
  async complete(messages: ChatMessage[]): Promise<string | null> {
    const result = await this.send(messages)
    return result?.content ?? null
  }

  /**
   * Completion that may instead ask for tools to be run. Callers must handle both
   * shapes: `content` set (a normal reply), or `toolCalls` non-empty.
   */
  async completeWithTools(
    messages: ChatMessage[],
    tools: ToolDefinition[],
  ): Promise<CompletionResult | null> {
    return this.send(messages, tools)
  }

  private async send(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
  ): Promise<CompletionResult | null> {
    const apiKey = this.config.groqApiKey
    if (!apiKey) return null

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.groqModel,
          messages,
          max_tokens: MAX_REPLY_TOKENS,
          temperature: TEMPERATURE,
          ...(tools && tools.length > 0
            ? {
                tools: tools.map((t) => ({
                  type: 'function',
                  function: { name: t.name, description: t.description, parameters: t.parameters },
                })),
                tool_choice: 'auto',
              }
            : {}),
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        // Body may carry a useful reason (bad key, decommissioned model, rate limit).
        const detail = await response.text().catch(() => '')
        this.logger.warn(`Groq request failed (${response.status}): ${detail.slice(0, 300)}`)
        return null
      }

      const payload = (await response.json()) as GroqResponse
      const message = payload.choices?.[0]?.message
      const content = message?.content?.trim() ?? null
      const toolCalls: ToolCallRequest[] = (message?.tool_calls ?? [])
        .filter((c): c is { id?: string; function: { name: string; arguments?: string } } =>
          !!c.function?.name)
        .map((c, i) => ({
          id: c.id ?? `call_${i}`,
          name: c.function.name,
          arguments: c.function.arguments ?? '{}',
        }))

      if (!content && toolCalls.length === 0) {
        this.logger.warn('Groq returned neither message content nor tool calls')
        return null
      }
      return { content, toolCalls }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      this.logger.warn(`Groq request errored: ${reason}`)
      return null
    } finally {
      clearTimeout(timeout)
    }
  }
}
