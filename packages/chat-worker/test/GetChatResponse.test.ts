import { test, expect, jest, beforeEach } from '@jest/globals'
import * as GetChatResponse from '../src/parts/GetChatResponse/GetChatResponse.ts'

const mockFetch = jest.fn()
// @ts-ignore
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

test('getChatResponse - successful response', async () => {
  const mockResponse = new ReadableStream()
  // @ts-ignore
  mockFetch.mockResolvedValue({
    ok: true,
    body: mockResponse,
  })

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
      stream: true,
    }),
  })
})

test('getChatResponse - invalid api key', async () => {
  // @ts-ignore
  mockFetch.mockResolvedValue({
    ok: false,
    status: 401,
  })

  const formattedMessages = [{ role: 'user', content: 'test message' }]

  await expect(
    GetChatResponse.getChatResponse(formattedMessages, 'invalid-key', 'test-model', 'https://test.url', '2023-06-01', true, 2048),
  ).rejects.toThrow('invalid api key')
})

test('getChatResponse - other error', async () => {
  // @ts-ignore
  mockFetch.mockResolvedValue({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
  })

  const formattedMessages = [{ role: 'user', content: 'test message' }]

  await expect(
    GetChatResponse.getChatResponse(
      formattedMessages,
      'test-api-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
    ),
  ).rejects.toThrow('Internal Server Error')
})

test('getChatResponse - no response body', async () => {
  // @ts-ignore
  mockFetch.mockResolvedValue({
    ok: true,
    body: null,
  })

  const formattedMessages = [{ role: 'user', content: 'test message' }]

  await expect(
    GetChatResponse.getChatResponse(
      formattedMessages,
      'test-api-key',
      'test-model',
      'https://test.url',
      '2023-06-01',
      true,
      2048,
    ),
  ).rejects.toThrow('no response body')
})
