/**
 * @jest-environment jsdom
 */
import { test, expect, jest, beforeEach } from '@jest/globals'
import type { Message } from '../src/parts/Message/Message.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as MessageRole from '../src/parts/MessageRole/MessageRole.ts'

const mockPort = {
  invoke: jest.fn(),
}

const mockWebViewStates = {
  get() {
    return {
      imageUrlCache: new Map(),
      port: mockPort,
    }
  },
}

jest.unstable_mockModule('../src/parts/WebViewStates/WebViewStates.ts', () => mockWebViewStates)

beforeEach(() => {
  mockPort.invoke.mockReset()
  mockWebViewStates.get().imageUrlCache.clear()
})

const CreateMessageViewModel = await import('../src/parts/CreateMessageViewModel/CreateMessageViewModel.ts')

test('creates view model for text content', async () => {
  const message: Message = {
    content: [
      {
        content: 'Hello',
        type: MessageContentType.Text,
      },
    ],
    role: MessageRole.Human,
    webViewId: 1,
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    blocks: [
      {
        content: 'Hello',
        display: {},
        type: MessageContentType.Text,
      },
    ],
    role: MessageRole.Human,
    webViewId: 1,
  })
})

test('creates view model for code content', async () => {
  const message: Message = {
    content: [
      {
        content: '```javascript\nconst x = 1;\n```',
        type: MessageContentType.Text,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    blocks: [
      {
        content: 'const x = 1;',
        display: {
          language: 'javascript',
          tokens: expect.anything(),
        },
        type: MessageContentType.Code,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  })
})

test('creates view model for image content', async () => {
  // @ts-ignore
  mockPort.invoke.mockResolvedValue('blob:test-url')
  const file = new File(['test'], 'test.png', { type: 'image/png' })

  const message: Message = {
    content: [
      {
        file,
        fileName: 'test.png',
        mediaType: 'image/png',
        type: MessageContentType.Image,
      },
    ],
    role: MessageRole.Human,
    webViewId: 1,
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    blocks: [
      {
        content: '',
        display: {
          blobUrl: 'blob:test-url',
        },
        type: MessageContentType.Image,
      },
    ],
    role: MessageRole.Human,
    webViewId: 1,
  })
})

test('creates view model for mixed content', async () => {
  // @ts-ignore
  mockPort.invoke.mockResolvedValue('blob:test-url')
  const file = new File(['test'], 'test.png', { type: 'image/png' })

  const message: Message = {
    content: [
      {
        content: 'Hello\n```javascript\nconst x = 1;\n```',
        type: MessageContentType.Text,
      },
      {
        file,
        fileName: 'test.png',
        mediaType: 'image/png',
        type: MessageContentType.Image,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    blocks: [
      {
        content: 'Hello',
        display: {},
        type: MessageContentType.Text,
      },
      {
        content: 'const x = 1;',
        display: {
          language: 'javascript',
          tokens: expect.anything(),
        },
        type: MessageContentType.Code,
      },
      {
        content: '',
        display: {
          blobUrl: 'blob:test-url',
        },
        type: MessageContentType.Image,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  })
})

test('creates view model for list content', async () => {
  const message: Message = {
    content: [
      {
        content: '- First item\n- Second item',
        type: MessageContentType.Text,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    blocks: [
      {
        content: '',
        display: {},
        items: ['First item', 'Second item'],
        ordered: false,
        type: MessageContentType.List,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  })
})
