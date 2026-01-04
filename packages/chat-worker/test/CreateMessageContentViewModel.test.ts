import { test, expect } from '@jest/globals'
import type { MessageContent } from '../src/parts/MessageContent/MessageContent.ts'
import * as CreateMessageContentViewModel from '../src/parts/CreateMessageContentViewModel/CreateMessageContentViewModel.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('creates view model for code block with tokens', async () => {
  const part: MessageContent = {
    content: '```python\ndef hello():\n    print("Hello")\n```',
    type: MessageContentType.Text,
  }

  const [result] = await CreateMessageContentViewModel.createMessageContentViewModel(part, {})

  expect(result.type).toBe(MessageContentType.Code)
  expect(result.content).toBe('def hello():\n    print("Hello")')
  expect(result.display.language).toBe('python')
  expect(result.display.tokens).toEqual([
    { text: 'def', type: TokenType.Keyword },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'hello', type: TokenType.Identifier },
    { text: '(', type: TokenType.Text },
    { text: ')', type: TokenType.Text },
    { text: ':', type: TokenType.Text },
    { text: '\n    ', type: TokenType.Whitespace },
    { text: 'print', type: TokenType.Identifier },
    { text: '(', type: TokenType.Text },
    { text: '"Hello"', type: TokenType.String },
    { text: ')', type: TokenType.Text },
  ])
})
