import { test, expect } from '@jest/globals'
import type { MessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as SerializeContent from '../src/parts/SerializeContent/SerializeContent.ts'

test('serializes text content', () => {
  const content: MessageContent = {
    content: 'Hello world',
    type: MessageContentType.Text,
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    content: 'Hello world',
    type: MessageContentType.Text,
  })
})

test('serializes image content', () => {
  const content: MessageContent = {
    file: new File(['test'], 'test.png', { type: 'image/png' }),
    fileName: 'test.png',
    mediaType: 'image/png',
    type: MessageContentType.Image,
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    fileName: 'test.png',
    mediaType: 'image/png',
    type: MessageContentType.Image,
  })
})

test('handles unknown content type', () => {
  const content: MessageContent = {
    data: 'test',
    // @ts-ignore - Testing invalid input
    type: 'unknown',
  }
  // @ts-ignore - Testing invalid input
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    data: 'test',
    type: 'unknown',
  })
})
