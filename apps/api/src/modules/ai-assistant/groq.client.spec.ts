import { GroqClient, type ChatMessage } from './groq.client'
import type { ConfigService } from '../config/config.service'

const MESSAGES: ChatMessage[] = [
  { role: 'system', content: 'You are ZoikoSocial AI.' },
  { role: 'user', content: 'How do I add a pet?' },
]

function buildClient(overrides: Partial<Record<'groqApiKey' | 'groqModel' | 'groqEnabled', unknown>> = {}) {
  const config = {
    groqApiKey: 'gsk_test_key',
    groqModel: 'llama-3.3-70b-versatile',
    groqEnabled: true,
    ...overrides,
  } as unknown as ConfigService
  return new GroqClient(config)
}

function mockFetch(impl: jest.Mock): void {
  ;(globalThis as { fetch: unknown }).fetch = impl
}

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

describe('GroqClient', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    ;(globalThis as { fetch: unknown }).fetch = originalFetch
    jest.restoreAllMocks()
  })

  it('reports enabled from config', () => {
    expect(buildClient().enabled).toBe(true)
    expect(buildClient({ groqEnabled: false }).enabled).toBe(false)
  })

  it('returns the assistant message content on success', async () => {
    mockFetch(jest.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: '  Head to Pet Diary → Add a pet.  ' } }] }),
    ))

    const reply = await buildClient().complete(MESSAGES)

    expect(reply).toBe('Head to Pet Diary → Add a pet.')
  })

  it('posts the model, messages and bearer token to the Groq endpoint', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: 'ok' } }] }),
    )
    mockFetch(fetchMock)

    await buildClient().complete(MESSAGES)

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions')
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer gsk_test_key')

    const body = JSON.parse(init.body as string)
    expect(body.model).toBe('llama-3.3-70b-versatile')
    expect(body.messages).toEqual(MESSAGES)
    expect(body.max_tokens).toBeGreaterThan(0)
  })

  it('returns null without calling fetch when no key is configured', async () => {
    const fetchMock = jest.fn()
    mockFetch(fetchMock)

    const reply = await buildClient({ groqApiKey: undefined }).complete(MESSAGES)

    expect(reply).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns null on a non-OK response', async () => {
    mockFetch(jest.fn().mockResolvedValue(jsonResponse({ error: 'invalid_api_key' }, false, 401)))
    expect(await buildClient().complete(MESSAGES)).toBeNull()
  })

  it('returns null when the response carries no message content', async () => {
    mockFetch(jest.fn().mockResolvedValue(jsonResponse({ choices: [] })))
    expect(await buildClient().complete(MESSAGES)).toBeNull()
  })

  it('returns null when content is present but blank', async () => {
    mockFetch(jest.fn().mockResolvedValue(jsonResponse({ choices: [{ message: { content: '   ' } }] })))
    expect(await buildClient().complete(MESSAGES)).toBeNull()
  })

  it('returns null instead of throwing when the request fails outright', async () => {
    mockFetch(jest.fn().mockRejectedValue(new Error('network unreachable')))
    await expect(buildClient().complete(MESSAGES)).resolves.toBeNull()
  })

  it('returns null instead of throwing when the response body is not JSON', async () => {
    mockFetch(jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => { throw new Error('Unexpected token') },
      text: async () => 'not json',
    }))
    await expect(buildClient().complete(MESSAGES)).resolves.toBeNull()
  })
})
