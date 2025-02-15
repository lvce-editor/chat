import { test, expect } from '@jest/globals'
import type { MessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as SerializeContent from '../src/parts/SerializeContent/SerializeContent.ts'

test('serializes text content', () => {
  const content: MessageContent = {
    type: 'text',
    content: 'Hello world',
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    type: 'text',
    content: 'Hello world',
  })
})

test('serializes code content', () => {
  const content: MessageContent = {
    type: 'code',
    content: 'const x = 1',
    language: 'javascript',
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    type: 'code',
    content: 'const x = 1',
    language: 'javascript',
  })
})

test('serializes image content', () => {
  const content: MessageContent = {
    type: 'image',
    file: new Blob(['test'], { type: 'image/png' }),
    fileName: 'test.png',
    mediaType: 'image/png',
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    type: 'image',
    fileName: 'test.png',
    mediaType: 'image/png',
  })
})

test('handles unknown content type', () => {
  const content: MessageContent = {
    // @ts-ignore - Testing invalid input
    type: 'unknown',
    data: 'test',
  }
  // @ts-ignore - Testing invalid input
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    type: 'unknown',
    data: 'test',
  })
})
