import { test, expect, jest, beforeEach } from '@jest/globals'
import * as GetChatResponse from '../src/parts/GetChatResponse/GetChatResponse.ts'

const mockFetch = jest.fn()
// @ts-ignore
globalThis.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

test('getChatResponse - successful response', async () => {
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

  const result = await GetChatResponse.getChatResponse(
    formattedMessages,
    'test-api-key',
    'test-model',
    'https://test.url',
    '2023-06-01',
    true,
    2048,
    [],
  )

  expect(result).toBe(mockResponse)
  expect(mockFetch).toHaveBeenCalledWith('https://test.url', {
    body: JSON.stringify({
      max_tokens: 2048,
      messages: formattedMessages,
      model: 'test-model',
      stream: true,
      tools: [],
    }),
    headers: {
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': 'test-api-key',
    },
    method: 'POST',
  })
})

test('getChatResponse - invalid api key', async () => {
  const mockResponse = {
    ok: false,
    status: 401,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ content: 'test message', role: 'user' }]

  expect(
    await GetChatResponse.getChatResponse(
      formattedMessages,
      'invalid-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
      [],
    ),
  ).toBe(mockResponse)
})

test('getChatResponse - other error', async () => {
  const mockResponse = {
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ content: 'test message', role: 'user' }]

  expect(
    await GetChatResponse.getChatResponse(
      formattedMessages,
      'test-api-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
      [],
    ),
  ).toBe(mockResponse)
})

test('getChatResponse - no response body', async () => {
  const mockResponse = {
    body: null,
    ok: true,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ content: 'test message', role: 'user' }]

  expect(
    await GetChatResponse.getChatResponse(
      formattedMessages,
      'test-api-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
      [],
    ),
  ).toBe(mockResponse)
})

test('getChatResponse - handles API error response', async () => {
  const errorResponse = {
    error: {
      message: "'claude-3-5-haiku-20241022' does not support image input.",
      type: 'invalid_request_error',
    },
    type: 'error',
  }

  const mockResponse = {
    json: () => errorResponse,
    ok: false,
    status: 400,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ content: 'test message', role: 'user' }]

  expect(
    await GetChatResponse.getChatResponse(
      formattedMessages,
      'test-api-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
      [],
    ),
  ).toBe(mockResponse)
})

test('getChatResponse - handles unparseable error response', async () => {
  const mockResponse = {
    json: () => Promise.reject(new Error('Invalid JSON')),
    ok: false,
    status: 400,
    statusText: 'Bad Request',
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ content: 'test message', role: 'user' }]

  expect(
    await GetChatResponse.getChatResponse(
      formattedMessages,
      'test-api-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
      [],
    ),
  ).toBe(mockResponse)
})
