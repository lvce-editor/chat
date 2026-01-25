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

test('formats text content for OpenRouter api', async () => {
  const { formatMessagesForOpenRouter } = await import('../src/parts/FormatMessagesForOpenRouter/FormatMessagesForOpenRouter.ts')
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

  const result = await formatMessagesForOpenRouter(messages)

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

test('formats assistant message for OpenRouter api', async () => {
  const { formatMessagesForOpenRouter } = await import('../src/parts/FormatMessagesForOpenRouter/FormatMessagesForOpenRouter.ts')
  const messages: readonly Message[] = [
    {
      content: [
        {
          content: 'I can help with that!',
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Ai,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForOpenRouter(messages)

  expect(result).toEqual([
    {
      content: [
        {
          text: 'I can help with that!',
          type: 'text',
        },
      ],
      role: 'assistant',
    },
  ])
})

test('formats image content for OpenRouter api with data URL', async () => {
  const { formatMessagesForOpenRouter } = await import('../src/parts/FormatMessagesForOpenRouter/FormatMessagesForOpenRouter.ts')
  const mockBase64 = 'base64-encoded-data'
  // @ts-ignore
  mockToBase64.mockResolvedValue(mockBase64)

  const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
  const messages: readonly Message[] = [
    {
      content: [
        {
          file: mockFile,
          fileName: 'test.png',
          mediaType: 'image/png',
          type: MessageContentType.Image,
        },
      ],
      role: MessageRole.Human,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForOpenRouter(messages)

  expect(result).toEqual([
    {
      content: [
        {
          image_url: {
            url: 'data:image/png;base64,base64-encoded-data',
          },
          type: 'image_url',
        },
      ],
      role: 'user',
    },
  ])
})

test('formats tool result message for OpenRouter api', async () => {
  const { formatMessagesForOpenRouter } = await import('../src/parts/FormatMessagesForOpenRouter/FormatMessagesForOpenRouter.ts')
  const messages: readonly Message[] = [
    {
      content: [
        {
          content: '{"temperature": 72}',
          tool_use_id: 'call_123',
          tool_use_name: 'get_weather',
          type: MessageContentType.ToolResult,
        },
      ],
      role: MessageRole.Human,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForOpenRouter(messages)

  expect(result).toEqual([
    {
      content: '{"temperature": 72}',
      role: 'tool',
      tool_call_id: 'call_123',
    },
  ])
})

test('formats assistant message with tool use for OpenRouter api', async () => {
  const { formatMessagesForOpenRouter } = await import('../src/parts/FormatMessagesForOpenRouter/FormatMessagesForOpenRouter.ts')
  const messages: readonly Message[] = [
    {
      content: [
        {
          input: { location: 'San Francisco' },
          tool_use_id: 'call_456',
          tool_use_name: 'get_weather',
          type: MessageContentType.ToolUse,
        },
      ],
      role: MessageRole.Ai,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForOpenRouter(messages)

  expect(result).toEqual([
    {
      content: null,
      role: 'assistant',
      tool_calls: [
        {
          function: {
            arguments: '{"location":"San Francisco"}',
            name: 'get_weather',
          },
          id: 'call_456',
          type: 'function',
        },
      ],
    },
  ])
})

test('formats assistant message with text and tool use for OpenRouter api', async () => {
  const { formatMessagesForOpenRouter } = await import('../src/parts/FormatMessagesForOpenRouter/FormatMessagesForOpenRouter.ts')
  const messages: readonly Message[] = [
    {
      content: [
        {
          content: 'Let me check the weather for you.',
          type: MessageContentType.Text,
        },
        {
          input: { location: 'New York' },
          tool_use_id: 'call_789',
          tool_use_name: 'get_weather',
          type: MessageContentType.ToolUse,
        },
      ],
      role: MessageRole.Ai,
      webViewId: 1,
    },
  ]

  const result = await formatMessagesForOpenRouter(messages)

  expect(result).toEqual([
    {
      content: 'Let me check the weather for you.',
      role: 'assistant',
      tool_calls: [
        {
          function: {
            arguments: '{"location":"New York"}',
            name: 'get_weather',
          },
          id: 'call_789',
          type: 'function',
        },
      ],
    },
  ])
})
