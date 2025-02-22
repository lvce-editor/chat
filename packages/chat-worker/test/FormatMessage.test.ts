import { test, expect } from '@jest/globals'
import * as FormatMessage from '../src/parts/FormatMessage/FormatMessage.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'

test('formats plain text', () => {
  const text = 'Hello, world!'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Text,
      content: 'Hello, world!',
    },
  ])
})

test('formats single code block', () => {
  const text = '```javascript\nconst x = 1;\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Code,
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
      type: MessageContentType.Text,
      content: 'Here is some code:',
    },
    {
      type: MessageContentType.Code,
      language: 'javascript',
      content: 'const x = 1;',
    },
    {
      type: MessageContentType.Text,
      content: 'And here is more text.',
    },
  ])
})

test('handles code block without language', () => {
  const text = '```\nplain text\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Code,
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
      type: MessageContentType.Code,
      language: 'javascript',
      content: 'const x = 1;',
    },
    {
      type: MessageContentType.Text,
      content: 'Some text',
    },
    {
      type: MessageContentType.Code,
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
      type: MessageContentType.Text,
      content: 'Here is some code:',
    },
    {
      type: MessageContentType.Code,
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
      type: MessageContentType.Code,
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

test('formats list items', () => {
  const text = '- Item 1\n- Item 2\n- Item 3'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.List,
      items: ['Item 1', 'Item 2', 'Item 3'],
    },
  ])
})

test('formats mixed list and text content', () => {
  const text = 'Here is a list:\n- Item 1\n- Item 2\nAnd some text after.'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Text,
      content: 'Here is a list:',
    },
    {
      type: MessageContentType.List,
      items: ['Item 1', 'Item 2'],
    },
    {
      type: MessageContentType.Text,
      content: 'And some text after.',
    },
  ])
})

test('formats mixed list and code blocks', () => {
  const text = '- Item 1\n- Item 2\n```javascript\nconst x = 1;\n```\n- Item 3\n- Item 4'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.List,
      items: ['Item 1', 'Item 2'],
    },
    {
      type: MessageContentType.Code,
      language: 'javascript',
      content: 'const x = 1;',
    },
    {
      type: MessageContentType.List,
      items: ['Item 3', 'Item 4'],
    },
  ])
})

test('formats code block with list inside', () => {
  const text = '```markdown\n- Item 1\n- Item 2\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Code,
      language: 'markdown',
      content: '- Item 1\n- Item 2',
    },
  ])
})

test('formats multiple code blocks with different languages', () => {
  const text = '```javascript\nconst x = 1;\n```\nSome text\n```python\ndef hello():\n    print("hi")\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Code,
      language: 'javascript',
      content: 'const x = 1;',
    },
    {
      type: MessageContentType.Text,
      content: 'Some text',
    },
    {
      type: MessageContentType.Code,
      language: 'python',
      content: 'def hello():\n    print("hi")',
    },
  ])
})

test('formats code block with empty lines', () => {
  const text = '```python\ndef hello():\n\n    print("hi")\n\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.Code,
      language: 'python',
      content: 'def hello():\n\n    print("hi")',
    },
  ])
})

test('formats ordered list', () => {
  const text = '1. First item\n2. Second item\n3. Third item'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.List,
      items: ['First item', 'Second item', 'Third item'],
      ordered: true,
    },
  ])
})

test('formats mixed ordered and unordered lists', () => {
  const text = '1. First ordered\n2. Second ordered\n\nSome text\n\n- First unordered\n- Second unordered'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.List,
      items: ['First ordered', 'Second ordered'],
      ordered: true,
    },
    {
      type: MessageContentType.Text,
      content: 'Some text',
    },
    {
      type: MessageContentType.List,
      items: ['First unordered', 'Second unordered'],
      ordered: false,
    },
  ])
})

test('handles single ordered list item', () => {
  const text = '1. Single item'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.List,
      items: ['Single item'],
      ordered: true,
    },
  ])
})

test('handles ordered list with irregular numbers', () => {
  const text = '1. First\n5. Second\n10. Third'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      type: MessageContentType.List,
      items: ['First', 'Second', 'Third'],
      ordered: true,
    },
  ])
})
