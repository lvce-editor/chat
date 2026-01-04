import { test, expect } from '@jest/globals'
import * as FormatMessage from '../src/parts/FormatMessage/FormatMessage.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'

test('formats plain text', () => {
  const text = 'Hello, world!'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'Hello, world!',
      type: MessageContentType.Text,
    },
  ])
})

test('formats single code block', () => {
  const text = '```javascript\nconst x = 1;\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
    },
  ])
})

test('formats mixed content', () => {
  const text = 'Here is some code:\n```javascript\nconst x = 1;\n```\nAnd here is more text.'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'Here is some code:',
      type: MessageContentType.Text,
    },
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
    },
    {
      content: 'And here is more text.',
      type: MessageContentType.Text,
    },
  ])
})

test('handles code block without language', () => {
  const text = '```\nplain text\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'plain text',
      language: 'text',
      type: MessageContentType.Code,
    },
  ])
})

test('handles multiple code blocks', () => {
  const text = '```javascript\nconst x = 1;\n```\nSome text\n```python\nprint("hello")\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
    },
    {
      content: 'Some text',
      type: MessageContentType.Text,
    },
    {
      content: 'print("hello")',
      language: 'python',
      type: MessageContentType.Code,
    },
  ])
})

test('handles partial code block at end', () => {
  const text = 'Here is some code:\n```javascript\nconst x = 1;'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'Here is some code:',
      type: MessageContentType.Text,
    },
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
    },
  ])
})

test.skip('handles code block without newline', () => {
  const text = '```javascript const x = 1;'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
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
      items: ['Item 1', 'Item 2', 'Item 3'],
      ordered: false,
      type: MessageContentType.List,
    },
  ])
})

test('formats mixed list and text content', () => {
  const text = 'Here is a list:\n- Item 1\n- Item 2\nAnd some text after.'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'Here is a list:',
      type: MessageContentType.Text,
    },
    {
      items: ['Item 1', 'Item 2'],
      ordered: false,
      type: MessageContentType.List,
    },
    {
      content: 'And some text after.',
      type: MessageContentType.Text,
    },
  ])
})

test('formats mixed list and code blocks', () => {
  const text = '- Item 1\n- Item 2\n```javascript\nconst x = 1;\n```\n- Item 3\n- Item 4'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: ['Item 1', 'Item 2'],
      ordered: false,
      type: MessageContentType.List,
    },
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
    },
    {
      items: ['Item 3', 'Item 4'],
      ordered: false,
      type: MessageContentType.List,
    },
  ])
})

test('formats code block with list inside', () => {
  const text = '```markdown\n- Item 1\n- Item 2\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: '- Item 1\n- Item 2',
      language: 'markdown',
      type: MessageContentType.Code,
    },
  ])
})

test('formats multiple code blocks with different languages', () => {
  const text = '```javascript\nconst x = 1;\n```\nSome text\n```python\ndef hello():\n    print("hi")\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'const x = 1;',
      language: 'javascript',
      type: MessageContentType.Code,
    },
    {
      content: 'Some text',
      type: MessageContentType.Text,
    },
    {
      content: 'def hello():\n    print("hi")',
      language: 'python',
      type: MessageContentType.Code,
    },
  ])
})

test('formats code block with empty lines', () => {
  const text = '```python\ndef hello():\n\n    print("hi")\n\n```'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'def hello():\n\n    print("hi")',
      language: 'python',
      type: MessageContentType.Code,
    },
  ])
})

test('formats ordered list', () => {
  const text = '1. First item\n2. Second item\n3. Third item'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: ['First item', 'Second item', 'Third item'],
      ordered: true,
      type: MessageContentType.List,
    },
  ])
})

test('formats mixed ordered and unordered lists', () => {
  const text = '1. First ordered\n2. Second ordered\n\nSome text\n\n- First unordered\n- Second unordered'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: ['First ordered', 'Second ordered'],
      ordered: true,
      type: MessageContentType.List,
    },
    {
      content: 'Some text',
      type: MessageContentType.Text,
    },
    {
      items: ['First unordered', 'Second unordered'],
      ordered: false,
      type: MessageContentType.List,
    },
  ])
})

test('handles single ordered list item', () => {
  const text = '1. Single item'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: ['Single item'],
      ordered: true,
      type: MessageContentType.List,
    },
  ])
})

test('handles ordered list with irregular numbers', () => {
  const text = '1. First\n5. Second\n10. Third'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: ['First', 'Second', 'Third'],
      ordered: true,
      type: MessageContentType.List,
    },
  ])
})

test('formats checkbox list items', () => {
  const text = '- [ ] Task 1\n- [ ] Task 2\n- [x] Task 3'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: ['Task 1', 'Task 2', 'Task 3'],
      ordered: false,
      type: MessageContentType.List,
    },
  ])
})

test.skip('formats nested lists', () => {
  const text = '1. First level\n   - Second level A\n   - Second level B\n2. Back to first'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: [
        {
          children: [
            {
              items: [{ content: 'Second level A' }, { content: 'Second level B' }],
              ordered: false,
              type: MessageContentType.List,
            },
          ],
          content: 'First level',
        },
        {
          content: 'Back to first',
        },
      ],
      ordered: true,
      type: MessageContentType.List,
    },
  ])
})

test.skip('formats deeply nested lists', () => {
  const text = '1. Level 1\n   - Level 2\n     1. Level 3\n        - Level 4\n2. Back to 1'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      items: [
        {
          children: [
            {
              items: [
                {
                  children: [
                    {
                      items: [
                        {
                          children: [
                            {
                              items: [{ content: 'Level 4' }],
                              ordered: false,
                              type: MessageContentType.List,
                            },
                          ],
                          content: 'Level 3',
                        },
                      ],
                      ordered: true,
                      type: MessageContentType.List,
                    },
                  ],
                  content: 'Level 2',
                },
              ],
              ordered: false,
              type: MessageContentType.List,
            },
          ],
          content: 'Level 1',
        },
        {
          content: 'Back to 1',
        },
      ],
      ordered: true,
      type: MessageContentType.List,
    },
  ])
})

test.skip('formats bold text', () => {
  const text = 'Hello **Northern Australia** and world'
  const blocks = FormatMessage.formatMessage(text)
  expect(blocks).toEqual([
    {
      content: 'Hello ',
      display: {},
      type: MessageContentType.Text,
    },
    {
      content: 'Northern Australia',
      display: {
        bold: true,
      },
      type: MessageContentType.Text,
    },
    {
      content: ' and world',
      display: {},
      type: MessageContentType.Text,
    },
  ])
})
