import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Message } from '../src/parts/Message/Message.ts'

const mockToBase64 = jest.fn()

jest.unstable_mockModule('../src/parts/ToBase64/ToBase64.ts', () => ({
  toBase64: mockToBase64,
}))

beforeEach(() => {
  mockToBase64.mockReset()
})

test('formats text content for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const messages: readonly Message[] = [
    {
      role: 'human',
      webViewId: 1,
      content: [
        {
          type: 'text',
          content: 'Hello world',
        },
      ],
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Hello world',
        },
      ],
    },
  ])
})

test('formats code content for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const messages: readonly Message[] = [
    {
      role: 'human',
      webViewId: 1,
      content: [
        {
          type: 'code',
          content: 'const x = 1;',
          language: 'javascript',
        },
      ],
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'const x = 1;',
        },
      ],
    },
  ])
})

test('formats image content for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const mockBase64 = 'base64-encoded-data'
  // @ts-ignore
  mockToBase64.mockResolvedValue(mockBase64)

  const messages: readonly Message[] = [
    {
      role: 'human',
      webViewId: 1,
      content: [
        {
          type: 'image',
          file: new File(['test'], 'test.png', { type: 'image/png' }),
          mediaType: 'image/png',
          fileName: 'test.png',
        },
      ],
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: mockBase64,
          },
        },
      ],
    },
  ])
})

test('formats mixed content for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const mockBase64 = 'base64-encoded-data'
  // @ts-ignore
  mockToBase64.mockResolvedValue(mockBase64)

  const messages: readonly Message[] = [
    {
      role: 'human',
      webViewId: 1,
      content: [
        {
          type: 'text',
          content: 'Here is an image:',
        },
        {
          type: 'image',
          file: new File(['test'], 'test.png', { type: 'image/png' }),
          mediaType: 'image/png',
          fileName: 'test.png',
        },
        {
          type: 'code',
          content: 'console.log("hello")',
          language: 'javascript',
        },
      ],
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Here is an image:',
        },
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: mockBase64,
          },
        },
        {
          type: 'text',
          text: 'console.log("hello")',
        },
      ],
    },
  ])
})

test('formats AI messages for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const messages: readonly Message[] = [
    {
      role: 'ai',
      webViewId: 1,
      content: [
        {
          type: 'text',
          content: 'Hello, I am an AI',
        },
      ],
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'Hello, I am an AI',
        },
      ],
    },
  ])
})
