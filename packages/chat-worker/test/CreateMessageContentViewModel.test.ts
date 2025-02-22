import { test, expect } from '@jest/globals'
import type { MessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as CreateMessageContentViewModel from '../src/parts/CreateMessageContentViewModel/CreateMessageContentViewModel.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('creates view model for code block with tokens', async () => {
  const part: MessageContent = {
    type: MessageContentType.Text,
    content: '```python\ndef hello():\n    print("Hello")\n```',
  }

  const [result] = await CreateMessageContentViewModel.createMessageContentViewModel(part, {})

  expect(result.type).toBe(MessageContentType.Code)
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
