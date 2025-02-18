import { test, expect } from '@jest/globals'
import type { CodeMessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as CreateMessageContentViewModel from '../src/parts/CreateMessageContentViewModel/CreateMessageContentViewModel.ts'

test('creates view model for code block with tokens', async () => {
  const part: CodeMessageContent = {
    type: 'code',
    content: 'def hello():\n    print("Hello")',
    language: 'python',
  }

  const result = await CreateMessageContentViewModel.createMessageContentViewModel(part, {})

  expect(result.type).toBe('code')
  expect(result.content).toBe('def hello():\n    print("Hello")')
  expect(result.display.language).toBe('python')
  expect(result.display.tokens).toEqual([
    { type: 'keyword', text: 'def' },
    { type: 'whitespace', text: ' ' },
    { type: 'identifier', text: 'hello' },
    { type: 'text', text: '(' },
    { type: 'text', text: ')' },
    { type: 'text', text: ':' },
    { type: 'whitespace', text: '\n    ' },
    { type: 'identifier', text: 'print' },
    { type: 'text', text: '(' },
    { type: 'string', text: '"Hello"' },
    { type: 'text', text: ')' },
  ])
})
