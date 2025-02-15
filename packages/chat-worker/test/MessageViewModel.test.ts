/**
 * @jest-environment jsdom
 */
import { test, expect, jest, beforeEach } from '@jest/globals'
import type { Message } from '../src/parts/Message/Message.ts'

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

jest.unstable_mockModule('../src/parts/WebViewStates/WebViewStates.ts', () => ({
  get: mockWebViewStates.get,
}))

beforeEach(() => {
  jest.resetAllMocks()
})

const MessageViewModel = await import('../src/parts/MessageViewModel/MessageViewModel.ts')

test('creates view model for text message', async () => {
  const message: Message = {
    role: 'human',
    webViewId: 1,
    content: [
      {
        type: 'text',
        content: 'Hello world',
      },
    ],
  }

  const result = await MessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: 'human',
    webViewId: 1,
    blocks: [
      {
        type: 'text',
        content: 'Hello world',
        display: {},
      },
    ],
  })
})

test('creates view model for code block', async () => {
  const message: Message = {
    role: 'ai',
    webViewId: 1,
    content: [
      {
        type: 'code',
        content: 'const x = 1;',
        language: 'javascript',
      },
    ],
  }

  const result = await MessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: 'ai',
    webViewId: 1,
    blocks: [
      {
        type: 'code',
        content: 'const x = 1;',
        display: {
          language: 'javascript',
        },
      },
    ],
  })
})

test('creates view model for image with File', async () => {
  const file = new File(['test'], 'test.png', { type: 'image/png' })
  // @ts-ignore
  mockPort.invoke.mockResolvedValue('blob:test-url')

  const message: Message = {
    role: 'human',
    webViewId: 1,
    content: [
      {
        type: 'image',
        file,
        fileName: 'test.png',
        mediaType: 'image/png',
      },
    ],
  }

  const result = await MessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: 'human',
    webViewId: 1,
    blocks: [
      {
        type: 'image',
        content: '',
        display: {
          blobUrl: 'blob:test-url',
        },
      },
    ],
  })
  expect(mockPort.invoke).toHaveBeenCalledWith('createObjectUrl', file)
})

test('creates view model for image without File', async () => {
  const message: Message = {
    role: 'human',
    webViewId: 1,
    content: [
      {
        type: 'image',
        file: new File(['test'], 'test.png', { type: 'image/png' }),
        fileName: 'test.png',
        mediaType: 'image/png',
      },
    ],
  }

  const result = await MessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: 'human',
    webViewId: 1,
    blocks: [
      {
        type: 'image',
        content: '',
        display: {
          blobUrl: '#',
        },
      },
    ],
  })
  expect(mockPort.invoke).not.toHaveBeenCalled()
})

test('creates view model for mixed content', async () => {
  // @ts-ignore
  mockPort.invoke.mockResolvedValue('blob:test-url')
  const file = new File(['test'], 'test.png', { type: 'image/png' })

  const message: Message = {
    role: 'ai',
    webViewId: 1,
    content: [
      {
        type: 'text',
        content: 'Hello',
      },
      {
        type: 'code',
        content: 'const x = 1;',
        language: 'javascript',
      },
      {
        type: 'image',
        file,
        fileName: 'test.png',
        mediaType: 'image/png',
      },
    ],
  }

  const result = await MessageViewModel.createMessageViewModel(message)

  expect(result).toEqual({
    role: 'ai',
    webViewId: 1,
    blocks: [
      {
        type: 'text',
        content: 'Hello',
        display: {},
      },
      {
        type: 'code',
        content: 'const x = 1;',
        display: {
          language: 'javascript',
        },
      },
      {
        type: 'image',
        content: '',
        display: {
          blobUrl: 'blob:test-url',
        },
      },
    ],
  })
})
