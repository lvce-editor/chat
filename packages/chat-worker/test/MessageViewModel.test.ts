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
      port: mockPort,
    }
  },
}

jest.unstable_mockModule('../src/parts/WebViewStates/WebViewStates.ts', () => mockWebViewStates)

beforeEach(() => {
  jest.resetAllMocks()
})

const CreateMessageViewModel = await import('../src/parts/CreateMessageViewModel/CreateMessageViewModel.ts')

test('creates view model for text content', async () => {
  const message: Message = {
    role: MessageRole.Human,
    webViewId: 1,
    content: [
      {
        type: MessageContentType.Text,
        content: 'Hello',
      },
    ],
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: MessageRole.Human,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Text,
        content: 'Hello',
        display: {},
      },
    ],
  })
})

test('creates view model for code content', async () => {
  const message: Message = {
    role: MessageRole.Ai,
    webViewId: 1,
    content: [
      {
        type: MessageContentType.Code,
        content: 'const x = 1;',
        language: 'javascript',
      },
    ],
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: MessageRole.Ai,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Code,
        content: 'const x = 1;',
        display: {
          language: 'javascript',
          tokens: expect.anything(),
        },
      },
    ],
  })
})

test('creates view model for image content', async () => {
  // @ts-ignore
  mockPort.invoke.mockResolvedValue('blob:test-url')
  const file = new File(['test'], 'test.png', { type: 'image/png' })

  const message: Message = {
    role: MessageRole.Human,
    webViewId: 1,
    content: [
      {
        type: MessageContentType.Image,
        file,
        fileName: 'test.png',
        mediaType: 'image/png',
      },
    ],
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: MessageRole.Human,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Image,
        content: '',
        display: {
          blobUrl: 'blob:test-url',
        },
      },
    ],
  })
})

test('creates view model for mixed content', async () => {
  // @ts-ignore
  mockPort.invoke.mockResolvedValue('blob:test-url')
  const file = new File(['test'], 'test.png', { type: 'image/png' })

  const message: Message = {
    role: MessageRole.Ai,
    webViewId: 1,
    content: [
      {
        type: MessageContentType.Text,
        content: 'Hello',
      },
      {
        type: MessageContentType.Code,
        content: 'const x = 1;',
        language: 'javascript',
      },
      {
        type: MessageContentType.Image,
        file,
        fileName: 'test.png',
        mediaType: 'image/png',
      },
    ],
  }

  const result = await CreateMessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: MessageRole.Ai,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Text,
        content: 'Hello',
        display: {},
      },
      {
        type: MessageContentType.Code,
        content: 'const x = 1;',
        display: {
          language: 'javascript',
          tokens: expect.anything(),
        },
      },
      {
        type: MessageContentType.Image,
        content: '',
        display: {
          blobUrl: 'blob:test-url',
        },
      },
    ],
  })
})
