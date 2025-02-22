import { test, expect } from '@jest/globals'
import type { MessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as SerializeContent from '../src/parts/SerializeContent/SerializeContent.ts'

test('serializes text content', () => {
  const content: MessageContent = {
    type: MessageContentType.Text,
    content: 'Hello world',
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    type: MessageContentType.Text,
    content: 'Hello world',
  })
})

test('serializes image content', () => {
  const content: MessageContent = {
    type: MessageContentType.Image,
    file: new File(['test'], 'test.png', { type: 'image/png' }),
    fileName: 'test.png',
    mediaType: 'image/png',
  }
  const result = SerializeContent.serializeContent(content)
  expect(result).toEqual({
    type: MessageContentType.Image,
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
