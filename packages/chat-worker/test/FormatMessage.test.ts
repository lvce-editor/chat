import { test, expect } from '@jest/globals'
import * as FormatMessage from '../src/parts/FormatMessage/FormatMessage.ts'

test('formats plain text', () => {
  const text = 'Hello, world!'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'text',
      content: 'Hello, world!',
    },
  ])
})

test('formats single code block', () => {
  const text = '```javascript\nconst x = 1;\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'code',
      language: 'javascript',
      content: 'const x = 1;',
    },
  ])
})

test('formats mixed content', () => {
  const text = 'Here is some code:\n```javascript\nconst x = 1;\n```\nAnd here is more text.'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'text',
      content: 'Here is some code:',
    },
    {
      type: 'code',
      language: 'javascript',
      content: 'const x = 1;',
    },
    {
      type: 'text',
      content: 'And here is more text.',
    },
  ])
})

test('handles code block without language', () => {
  const text = '```\nplain text\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'code',
      language: 'text',
      content: 'plain text',
    },
  ])
})

test('handles multiple code blocks', () => {
  const text = '```javascript\nconst x = 1;\n```\nSome text\n```python\nprint("hello")\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'code',
      language: 'javascript',
      content: 'const x = 1;',
    },
    {
      type: 'text',
      content: 'Some text',
    },
    {
      type: 'code',
      language: 'python',
      content: 'print("hello")',
    },
  ])
})

test('handles partial code block at end', () => {
  const text = 'Here is some code:\n```javascript\nconst x = 1;'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'text',
      content: 'Here is some code:',
    },
    {
      type: 'code',
      language: 'javascript',
      content: 'const x = 1;',
    },
  ])
})

test.skip('handles code block without newline', () => {
  const text = '```javascript const x = 1;'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: 'code',
      language: 'javascript',
      content: 'const x = 1;',
    },
  ])
})

test('handles empty input', () => {
  const text = ''
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([])
})
