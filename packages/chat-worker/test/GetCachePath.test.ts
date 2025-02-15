import { test, expect } from '@jest/globals'
import * as GetCachePath from '../src/parts/GetCachePath/GetCachePath.ts'

test('combines base url and filename', () => {
  const result = GetCachePath.getCachePath('https://example.com', 'test.png')
  expect(result).toBe('https://example.com/test.png')
})

test('works with different base urls', () => {
  const result = GetCachePath.getCachePath('http://localhost:3000', 'image.jpg')
  expect(result).toBe('http://localhost:3000/image.jpg')
})
