import { test, expect, jest, beforeEach } from '@jest/globals'
import * as GetImageFromCache from '../src/parts/GetImageFromCache/GetImageFromCache.ts'

const mockMatch = jest.fn()
const mockOpen = jest.fn()
const mockConsoleError = jest.fn()

// Mock console.error
console.error = mockConsoleError

// Mock global caches object
// @ts-ignore
globalThis.caches = {
  // @ts-ignore
  open: mockOpen,
}

beforeEach(() => {
  mockMatch.mockReset()
  mockOpen.mockReset()
  mockConsoleError.mockReset()
})

test('successfully gets image from cache', async () => {
  const mockResponse = new Response('test-data')
  // @ts-ignore
  mockMatch.mockResolvedValue(mockResponse)
  // @ts-ignore
  mockOpen.mockResolvedValue({
    match: mockMatch,
  })

  const result = await GetImageFromCache.getImageFromCache('test-cache', 'https://example.com', 'test.png')

  expect(result).toBe(mockResponse)
  expect(mockOpen).toHaveBeenCalledWith('test-cache')
  expect(mockMatch).toHaveBeenCalledWith('https://example.com/test.png')
  expect(mockConsoleError).not.toHaveBeenCalled()
})

test('returns undefined when cache.match returns null', async () => {
  // @ts-ignore
  mockMatch.mockResolvedValue(null)
  // @ts-ignore
  mockOpen.mockResolvedValue({
    // @ts-ignore
    match: mockMatch,
  })

  const result = await GetImageFromCache.getImageFromCache('test-cache', 'https://example.com', 'test.png')

  expect(result).toBeNull()
  expect(mockConsoleError).not.toHaveBeenCalled()
})

test('returns undefined when cache.open throws error', async () => {
  const error = new Error('Failed to open cache')
  // @ts-ignore
  mockOpen.mockRejectedValue(error)
  // @ts-ignore
  const result = await GetImageFromCache.getImageFromCache('test-cache', 'https://example.com', 'test.png')

  expect(result).toBeUndefined()
  expect(mockConsoleError).toHaveBeenCalledWith('Error getting image from cache: Error: Failed to open cache')
})

test('returns undefined when cache.match throws error', async () => {
  const error = new Error('Failed to match cache')
  // @ts-ignore
  mockMatch.mockRejectedValue(error)
  // @ts-ignore
  mockOpen.mockResolvedValue({
    match: mockMatch,
  })

  const result = await GetImageFromCache.getImageFromCache('test-cache', 'https://example.com', 'test.png')

  expect(result).toBeUndefined()
  expect(mockConsoleError).toHaveBeenCalledWith('Error getting image from cache: Error: Failed to match cache')
})
