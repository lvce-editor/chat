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
    ok: true,
    body: mockStream,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
    { role: 'user', content: 'How are you?' },
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
    method: 'POST',
    headers: {
      'x-api-key': 'test-api-key',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'test-model',
      max_tokens: 2048,
      messages: formattedMessages,
      tools: [],
      stream: true,
    }),
  })
})

test('getChatResponse - invalid api key', async () => {
  const mockResponse = {
    ok: false,
    status: 401,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ role: 'user', content: 'test message' }]

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

  const formattedMessages = [{ role: 'user', content: 'test message' }]

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
    ok: true,
    body: null,
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ role: 'user', content: 'test message' }]

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
    type: 'error',
    error: {
      type: 'invalid_request_error',
      message: "'claude-3-5-haiku-20241022' does not support image input.",
    },
  }

  const mockResponse = {
    ok: false,
    status: 400,
    json: () => Promise.resolve(errorResponse),
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ role: 'user', content: 'test message' }]

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
    ok: false,
    status: 400,
    statusText: 'Bad Request',
    json: () => Promise.reject(new Error('Invalid JSON')),
  }
  // @ts-ignore
  mockFetch.mockResolvedValue(mockResponse)

  const formattedMessages = [{ role: 'user', content: 'test message' }]

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
