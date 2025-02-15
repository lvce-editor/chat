/**
 * @jest-environment jsdom
 */
import { test, expect } from '@jest/globals'
import * as ToBase64 from '../src/parts/ToBase64/ToBase64.ts'

test('converts blob to base64', async () => {
  const blob = new Blob(['Hello World'], { type: 'text/plain' })
  const result = await ToBase64.toBase64(blob)
  expect(result).toBe('SGVsbG8gV29ybGQ=') // "Hello World" in base64
})

test('handles empty blob', async () => {
  const blob = new Blob([], { type: 'application/octet-stream' })
  const result = await ToBase64.toBase64(blob)
  expect(result).toBe('')
})

test('handles different mime types', async () => {
  const blob = new Blob(['test'], { type: 'image/jpeg' })
  const result = await ToBase64.toBase64(blob)
  expect(result).toBe('dGVzdA==') // "test" in base64
})
