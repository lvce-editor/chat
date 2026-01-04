import { test, expect } from '@jest/globals'
import * as UnwrapApiResponse from '../src/parts/UnwrapApiResponse/UnwrapApiResponse.ts'

test('handles API error response', async () => {
  const errorResponse = {
    error: {
      message: "'claude-3-5-haiku-20241022' does not support image input.",
      type: 'invalid_request_error',
    },
    type: 'error',
  }

  const response = Response.json(errorResponse, {
    status: 400,
    statusText: 'Bad Request',
  })

  await expect(UnwrapApiResponse.unwrapApiResponse(response)).rejects.toThrow(
    "'claude-3-5-haiku-20241022' does not support image input.",
  )
})

test('handles invalid api key', async () => {
  const response = new Response(null, {
    status: 401,
    statusText: 'Unauthorized',
  })

  await expect(UnwrapApiResponse.unwrapApiResponse(response)).rejects.toThrow('E_INVALID_API_KEY: Invalid API key')
})

test('handles unparseable error response', async () => {
  const response = new Response('invalid json', {
    status: 400,
    statusText: 'Bad Request',
  })

  await expect(UnwrapApiResponse.unwrapApiResponse(response)).rejects.toThrow('Bad Request')
})

test.skip('handles missing body', async () => {
  const response = new Response(null, {
    status: 200,
  })
  // @ts-ignore - Testing invalid response
  response.body = null

  await expect(UnwrapApiResponse.unwrapApiResponse(response)).rejects.toThrow('no response body')
})

test.skip('returns response body for successful response', async () => {
  const mockBody = new ReadableStream()
  const response = new Response(null, {
    status: 200,
  })
  // @ts-ignore - Mocking response body
  response.body = mockBody

  const result = await UnwrapApiResponse.unwrapApiResponse(response)
  expect(result).toBe(mockBody)
})

test('handles empty message content error', async () => {
  const errorResponse = {
    error: {
      message: 'messages.2: all messages must have non-empty content except for the optional final assistant message',
      type: 'invalid_request_error',
    },
    type: 'error',
  }

  const response = Response.json(errorResponse, {
    status: 400,
    statusText: 'Bad Request',
  })

  await expect(UnwrapApiResponse.unwrapApiResponse(response)).rejects.toThrow(
    new Error(
      `E_EMPTY_MESSAGE_NOT_ALLOWED: messages.2: all messages must have non-empty content except for the optional final assistant message`,
    ),
  )
})

test('handles unsupported image format error', async () => {
  const errorResponse = {
    error: {
      message: 'Image does not match the provided media type image/png',
      type: 'invalid_request_error',
    },
    type: 'error',
  }

  const response = Response.json(errorResponse, {
    status: 400,
    statusText: 'Bad Request',
  })

  await expect(UnwrapApiResponse.unwrapApiResponse(response)).rejects.toThrow(
    'E_UNSUPPORTED_IMAGE_FORMAT: only png images are supported',
  )
})
