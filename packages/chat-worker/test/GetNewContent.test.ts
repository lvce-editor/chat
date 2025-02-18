import { test, expect } from '@jest/globals'
import * as GetNewContent from '../src/parts/GetNewContent/GetNewContent.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'

test('returns empty array when no input and no images', () => {
  const result = GetNewContent.getNewContent('', [])
  expect(result).toEqual([])
})

test('returns text content when only text input provided', () => {
  const result = GetNewContent.getNewContent('Hello world', [])
  expect(result).toEqual([
    {
      type: 'text',
      content: 'Hello world',
    },
  ])
})

test('returns image content when only images provided', () => {
  const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('', [mockFile])
  expect(result).toEqual([
    {
      type: 'image',
      file: mockFile,
      mediaType: 'image/png',
      fileName: 'test.png',
    },
  ])
})

test('returns both image and text content when both provided', () => {
  const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('Hello world', [mockFile])
  expect(result).toEqual([
    {
      type: 'image',
      file: mockFile,
      mediaType: 'image/png',
      fileName: 'test.png',
    },
    {
      type: 'text',
      content: 'Hello world',
    },
  ])
})

test('handles multiple images', () => {
  const mockFile1 = new File(['test1'], 'test1.png', { type: 'image/png' })
  const mockFile2 = new File(['test2'], 'test2.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('Hello world', [mockFile1, mockFile2])
  expect(result).toEqual([
    {
      type: MessageContentType.Image,
      file: mockFile1,
      mediaType: 'image/png',
      fileName: 'test1.png',
    },
    {
      type: MessageContentType.Image,
      file: mockFile2,
      mediaType: 'image/png',
      fileName: 'test2.png',
    },
    {
      type: MessageContentType.Text,
      content: 'Hello world',
    },
  ])
})

test('creates text content from input', () => {
  const result = GetNewContent.getNewContent('Hello', [])

  expect(result).toEqual([
    {
      type: MessageContentType.Text,
      content: 'Hello',
    },
  ])
})

test('creates image content from files', () => {
  const file = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('', [file])

  expect(result).toEqual([
    {
      type: MessageContentType.Image,
      file,
      mediaType: 'image/png',
      fileName: 'test.png',
    },
  ])
})

test('creates mixed content from input and files', () => {
  const file = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('Hello', [file])

  expect(result).toEqual([
    {
      type: MessageContentType.Image,
      file,
      mediaType: 'image/png',
      fileName: 'test.png',
    },
    {
      type: MessageContentType.Text,
      content: 'Hello',
    },
  ])
})

test('returns empty array when no input or files', () => {
  const result = GetNewContent.getNewContent('', [])
  expect(result).toEqual([])
})
