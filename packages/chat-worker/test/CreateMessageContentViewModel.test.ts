import { test, expect } from '@jest/globals'
import type { CodeMessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as CreateMessageContentViewModel from '../src/parts/CreateMessageContentViewModel/CreateMessageContentViewModel.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

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
    { type: TokenType.Keyword, text: 'def' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'hello' },
    { type: TokenType.Text, text: '(' },
    { type: TokenType.Text, text: ')' },
    { type: TokenType.Text, text: ':' },
    { type: TokenType.Whitespace, text: '\n    ' },
    { type: TokenType.Identifier, text: 'print' },
    { type: TokenType.Text, text: '(' },
    { type: TokenType.String, text: '"Hello"' },
    { type: TokenType.Text, text: ')' },
  ])
})
