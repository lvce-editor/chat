import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Message } from '../src/parts/Message/Message.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as MessageRole from '../src/parts/MessageRole/MessageRole.ts'

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
      content: [
        {
          content: 'Hello world',
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Human,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      content: [
        {
          text: 'Hello world',
          type: 'text',
        },
      ],
      role: 'user',
    },
  ])
})

test('formats code content for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const messages: readonly Message[] = [
    {
      content: [
        {
          content: 'const x = 1;',
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Human,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      content: [
        {
          text: 'const x = 1;',
          type: 'text',
        },
      ],
      role: 'user',
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
      content: [
        {
          file: new File(['test'], 'test.png', { type: 'image/png' }),
          fileName: 'test.png',
          mediaType: 'image/png',
          type: MessageContentType.Image,
        },
      ],
      role: MessageRole.Human,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      content: [
        {
          source: {
            data: mockBase64,
            media_type: 'image/png',
            type: 'base64',
          },
          type: 'image',
        },
      ],
      role: 'user',
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
      content: [
        {
          content: 'Here is an image:',
          type: MessageContentType.Text,
        },
        {
          file: new File(['test'], 'test.png', { type: 'image/png' }),
          fileName: 'test.png',
          mediaType: 'image/png',
          type: MessageContentType.Image,
        },
        {
          content: 'console.log("hello")',
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Human,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      content: [
        {
          text: 'Here is an image:',
          type: 'text',
        },
        {
          source: {
            data: mockBase64,
            media_type: 'image/png',
            type: 'base64',
          },
          type: 'image',
        },
        {
          text: 'console.log("hello")',
          type: 'text',
        },
      ],
      role: 'user',
    },
  ])
})

test('formats AI messages for api', async () => {
  const { formatMessagesForApi } = await import('../src/parts/FormatMessagesForApi/FormatMessagesForApi.ts')
  const messages: readonly Message[] = [
    {
      content: [
        {
          content: 'Hello, I am an AI',
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Ai,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForApi(messages)

  expect(result).toEqual([
    {
      content: [
        {
          text: 'Hello, I am an AI',
          type: 'text',
        },
      ],
      role: 'assistant',
    },
  ])
})
