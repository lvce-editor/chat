import { test, expect, jest, beforeEach } from '@jest/globals'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as MessageRole from '../src/parts/MessageRole/MessageRole.ts'

const mockUpdate = {
  update: jest.fn(),
}

const mockWebViewStates = {
  get: jest.fn(),
}

const mockGetChatResponse = {
  getChatResponse: jest.fn(),
}

const mockUnwrapApiResponse = {
  unwrapApiResponse: jest.fn(),
}

const mockHandleApiResponse = {
  handleApiResponse: jest.fn(),
}

jest.unstable_mockModule('../src/parts/Update/Update.ts', () => mockUpdate)
jest.unstable_mockModule('../src/parts/WebViewStates/WebViewStates.ts', () => mockWebViewStates)
jest.unstable_mockModule('../src/parts/GetChatResponse/GetChatResponse.ts', () => mockGetChatResponse)
jest.unstable_mockModule('../src/parts/UnwrapApiResponse/UnwrapApiResponse.ts', () => mockUnwrapApiResponse)
jest.unstable_mockModule('../src/parts/HandleApiResponse/HandleApiResponse.ts', () => mockHandleApiResponse)

const HandleSubmit = await import('../src/parts/HandleSubmit/HandleSubmit.ts')

beforeEach(() => {
  mockUpdate.update.mockReset()
  mockWebViewStates.get.mockReset()
  mockGetChatResponse.getChatResponse.mockReset()
  mockUnwrapApiResponse.unwrapApiResponse.mockReset()
  mockHandleApiResponse.handleApiResponse.mockReset()
})

test.skip('handles offline error', async () => {
  mockWebViewStates.get.mockReturnValue({
    messages: [],
    currentInput: 'test message',
    images: [],
  })

  // @ts-ignore
  mockGetChatResponse.getChatResponse.mockRejectedValue(new TypeError('Failed to fetch'))

  await HandleSubmit.handleSubmit(1)

  expect(mockUpdate.update).toHaveBeenCalledWith(1, {
    messages: [
      {
        role: MessageRole.Human,
        content: [
          {
            type: MessageContentType.Text,
            content: 'test message',
          },
        ],
        webViewId: 1,
      },
      {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: 'Error: E_OFFLINE: Unable to connect. Please check your internet connection and try again.',
          },
        ],
        webViewId: 1,
      },
    ],
  })
})

test.skip('handles other network errors', async () => {
  mockWebViewStates.get.mockReturnValue({
    messages: [],
    currentInput: 'test message',
    images: [],
  })

  // @ts-ignore
  mockGetChatResponse.getChatResponse.mockRejectedValue(new Error('Some other error'))

  await HandleSubmit.handleSubmit(1)

  expect(mockUpdate.update).toHaveBeenCalledWith(1, {
    messages: [
      {
        role: MessageRole.Human,
        content: [
          {
            type: MessageContentType.Text,
            content: 'test message',
          },
        ],
        webViewId: 1,
      },
      {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: 'Error: Error: Some other error',
          },
        ],
        webViewId: 1,
      },
    ],
  })
})
