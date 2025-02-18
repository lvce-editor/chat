import { test, expect } from '@jest/globals'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'

test('message content type constants', () => {
  expect(MessageContentType.Text).toBe(1)
  expect(MessageContentType.Code).toBe(2)
  expect(MessageContentType.Image).toBe(3)
})
