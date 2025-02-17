import { test, expect } from '@jest/globals'
import * as UnwrapApiResponse from '../src/parts/UnwrapApiResponse/UnwrapApiResponse.ts'

test('handles API error response', async () => {
  const errorResponse = {
    type: 'error',
    error: {
      type: 'invalid_request_error',
      message: "'claude-3-5-haiku-20241022' does not support image input.",
    },
  }

  const response = new Response(JSON.stringify(errorResponse), {
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
