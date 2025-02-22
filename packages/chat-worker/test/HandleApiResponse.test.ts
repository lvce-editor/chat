import { test, expect, jest, beforeEach } from '@jest/globals'
import * as HandleApiResponse from '../src/parts/HandleApiResponse/HandleApiResponse.ts'
import * as MessageRole from '../src/parts/MessageRole/MessageRole.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'

const mockUpdate = {
  update: jest.fn(),
}

const mockWebViewStates = {
  get: jest.fn(),
}

jest.unstable_mockModule('../src/parts/Update/Update.ts', () => mockUpdate)
jest.unstable_mockModule('../src/parts/WebViewStates/WebViewStates.ts', () => mockWebViewStates)

beforeEach(() => {
  jest.resetAllMocks()
})

test('handles api response', async () => {
  mockWebViewStates.get.mockReturnValue({
    messages: [],
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"content_block_delta","delta":{"text":"Hello"}}\n\n'))
      controller.enqueue(encoder.encode('data: {"type":"content_block_delta","delta":{"text":" World"}}\n\n'))
      controller.close()
    },
  })

  await HandleApiResponse.handleApiResponse(1, stream)

  expect(mockUpdate.update).toHaveBeenCalledTimes(3)
  expect(mockUpdate.update).toHaveBeenNthCalledWith(1, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [],
        webViewId: 1,
      },
    ],
  })

  expect(mockUpdate.update).toHaveBeenNthCalledWith(2, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: 'Hello',
          },
        ],
        webViewId: 1,
      },
    ],
  })

  expect(mockUpdate.update).toHaveBeenNthCalledWith(3, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: 'Hello World',
          },
        ],
        webViewId: 1,
      },
    ],
  })
})

test('handles empty response', async () => {
  mockWebViewStates.get.mockReturnValue({
    messages: [],
  })

  const stream = new ReadableStream({
    start(controller) {
      controller.close()
    },
  })

  await HandleApiResponse.handleApiResponse(1, stream)

  expect(mockUpdate.update).toHaveBeenCalledTimes(2)
  expect(mockUpdate.update).toHaveBeenNthCalledWith(1, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [],
        webViewId: 1,
      },
    ],
  })

  expect(mockUpdate.update).toHaveBeenNthCalledWith(2, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [],
        webViewId: 1,
      },
    ],
  })
})

test('handles invalid json response', async () => {
  mockWebViewStates.get.mockReturnValue({
    messages: [],
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('data: invalid json\n\n'))
      controller.close()
    },
  })

  await HandleApiResponse.handleApiResponse(1, stream)

  expect(mockUpdate.update).toHaveBeenCalledTimes(2)
  expect(mockUpdate.update).toHaveBeenNthCalledWith(1, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [],
        webViewId: 1,
      },
    ],
  })

  expect(mockUpdate.update).toHaveBeenNthCalledWith(2, 1, {
    messages: [
      {
        role: MessageRole.Ai,
        content: [],
        webViewId: 1,
      },
    ],
  })
})
