import { test, expect, jest, beforeEach } from '@jest/globals'
import * as GetChatResponseOpenRouter from '../src/parts/GetChatResponseOpenRouter/GetChatResponseOpenRouter.ts'

const mockFetch = jest.fn()
// @ts-ignore
globalThis.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

test('getChatResponseOpenRouter - successful response', async () => {
  const mockStream = new ReadableStream()
  const mockResponse = {
    body: mockStream,
    ok: true,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [
    { content: 'Hello', role: 'user' },
    { content: 'Hi there!', role: 'assistant' },
    { content: 'How are you?', role: 'user' },
  ]

  const result = await GetChatResponseOpenRouter.getChatResponseOpenRouter(
    formattedMessages,
    'test-api-key',
    'xiaomi/mimo-vl-7b-rl:free',
    'https://openrouter.ai/api/v1/chat/completions',
    true,
    2048,
    [],
  )

  expect(result).toBe(mockResponse)
  expect(mockFetch).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', {
    body: JSON.stringify({
      max_tokens: 2048,
      messages: formattedMessages,
      model: 'xiaomi/mimo-vl-7b-rl:free',
      stream: true,
    }),
    headers: {
      Authorization: 'Bearer test-api-key',
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lvce-editor.github.io',
      'X-Title': 'LVCE Editor Chat',
    },
    method: 'POST',
  })
})

test('getChatResponseOpenRouter - non-streaming', async () => {
  const mockResponse = {
    ok: true,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ content: 'Hello', role: 'user' }]

  await GetChatResponseOpenRouter.getChatResponseOpenRouter(
    formattedMessages,
    'test-api-key',
    'anthropic/claude-3.5-sonnet',
    'https://openrouter.ai/api/v1/chat/completions',
    false,
    512,
    [],
  )

  expect(mockFetch).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', {
    body: JSON.stringify({
      max_tokens: 512,
      messages: formattedMessages,
      model: 'anthropic/claude-3.5-sonnet',
      stream: false,
    }),
    headers: {
      Authorization: 'Bearer test-api-key',
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lvce-editor.github.io',
      'X-Title': 'LVCE Editor Chat',
    },
    method: 'POST',
  })
})
