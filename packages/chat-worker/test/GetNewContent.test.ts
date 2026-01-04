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
      content: 'Hello world',
      type: MessageContentType.Text,
    },
  ])
})

test('returns image content when only images provided', () => {
  const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('', [mockFile])
  expect(result).toEqual([
    {
      file: mockFile,
      fileName: 'test.png',
      mediaType: 'image/png',
      type: MessageContentType.Image,
    },
  ])
})

test('returns both image and text content when both provided', () => {
  const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('Hello world', [mockFile])
  expect(result).toEqual([
    {
      file: mockFile,
      fileName: 'test.png',
      mediaType: 'image/png',
      type: MessageContentType.Image,
    },
    {
      content: 'Hello world',
      type: MessageContentType.Text,
    },
  ])
})

test('handles multiple images', () => {
  const mockFile1 = new File(['test1'], 'test1.png', { type: 'image/png' })
  const mockFile2 = new File(['test2'], 'test2.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('Hello world', [mockFile1, mockFile2])
  expect(result).toEqual([
    {
      file: mockFile1,
      fileName: 'test1.png',
      mediaType: 'image/png',
      type: MessageContentType.Image,
    },
    {
      file: mockFile2,
      fileName: 'test2.png',
      mediaType: 'image/png',
      type: MessageContentType.Image,
    },
    {
      content: 'Hello world',
      type: MessageContentType.Text,
    },
  ])
})

test('creates text content from input', () => {
  const result = GetNewContent.getNewContent('Hello', [])

  expect(result).toEqual([
    {
      content: 'Hello',
      type: MessageContentType.Text,
    },
  ])
})

test('creates image content from files', () => {
  const file = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('', [file])

  expect(result).toEqual([
    {
      file,
      fileName: 'test.png',
      mediaType: 'image/png',
      type: MessageContentType.Image,
    },
  ])
})

test('creates mixed content from input and files', () => {
  const file = new File(['test'], 'test.png', { type: 'image/png' })
  const result = GetNewContent.getNewContent('Hello', [file])

  expect(result).toEqual([
    {
      file,
      fileName: 'test.png',
      mediaType: 'image/png',
      type: MessageContentType.Image,
    },
    {
      content: 'Hello',
      type: MessageContentType.Text,
    },
  ])
})

test('returns empty array when no input or files', () => {
  const result = GetNewContent.getNewContent('', [])
  expect(result).toEqual([])
})
