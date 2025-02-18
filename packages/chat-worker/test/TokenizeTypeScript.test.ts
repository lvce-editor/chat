import { test, expect } from '@jest/globals'
import * as TokenizeTypeScript from '../src/parts/TokenizeTypeScript/TokenizeTypeScript.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic TypeScript code', () => {
  const code = 'function add(x: number, y: number): number {\n  return x + y;\n}'
  const tokens = TokenizeTypeScript.tokenizeTypeScript(code)
  expect(tokens).toEqual([
    { type: TokenType.Keyword, text: 'function' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'add' },
    { type: TokenType.Delimiter, text: '(' },
    { type: TokenType.Identifier, text: 'x' },
    { type: TokenType.Operator, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'number' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'y' },
    { type: TokenType.Operator, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'number' },
    { type: TokenType.Delimiter, text: ')' },
    { type: TokenType.Operator, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'number' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Delimiter, text: '{' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.Keyword, text: 'return' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'x' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '+' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'y' },
    { type: TokenType.Delimiter, text: ';' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Delimiter, text: '}' },
  ])
})
