import { test, expect } from '@jest/globals'
import * as TokenizeTypeScript from '../src/parts/TokenizeTypeScript/TokenizeTypeScript.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic TypeScript code', () => {
  const code = 'function add(x: number, y: number): number {\n  return x + y;\n}'
  const tokens = TokenizeTypeScript.tokenizeTypeScript(code)
  expect(tokens).toEqual([
    { text: 'function', type: TokenType.Keyword },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'add', type: TokenType.Identifier },
    { text: '(', type: TokenType.Delimiter },
    { text: 'x', type: TokenType.Identifier },
    { text: ':', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'number', type: TokenType.Identifier },
    { text: ',', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'y', type: TokenType.Identifier },
    { text: ':', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'number', type: TokenType.Identifier },
    { text: ')', type: TokenType.Delimiter },
    { text: ':', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'number', type: TokenType.Identifier },
    { text: ' ', type: TokenType.Whitespace },
    { text: '{', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: 'return', type: TokenType.Keyword },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'x', type: TokenType.Identifier },
    { text: ' ', type: TokenType.Whitespace },
    { text: '+', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'y', type: TokenType.Identifier },
    { text: ';', type: TokenType.Delimiter },
    { text: '\n', type: TokenType.Whitespace },
    { text: '}', type: TokenType.Delimiter },
  ])
})
