import { test, expect } from '@jest/globals'
import * as TokenizeJson from '../src/parts/TokenizeJson/TokenizeJson.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic JSON', () => {
  const code = `{
  "name": "John",
  "age": 30,
  "isStudent": false
}`
  const tokens = TokenizeJson.tokenizeJson(code)
  expect(tokens).toEqual([
    { type: TokenType.Delimiter, text: '{' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"name"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.String, text: '"John"' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"age"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '30' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"isStudent"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Keyword, text: 'false' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Delimiter, text: '}' },
  ])
})

test('tokenizes JSON with arrays', () => {
  const code = `{
  "numbers": [1, 2.5, -3.14],
  "names": ["Alice", "Bob"]
}`
  const tokens = TokenizeJson.tokenizeJson(code)
  expect(tokens).toEqual([
    { type: TokenType.Delimiter, text: '{' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"numbers"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Delimiter, text: '[' },
    { type: TokenType.Number, text: '1' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '2.5' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '-3.14' },
    { type: TokenType.Delimiter, text: ']' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"names"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Delimiter, text: '[' },
    { type: TokenType.String, text: '"Alice"' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.String, text: '"Bob"' },
    { type: TokenType.Delimiter, text: ']' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Delimiter, text: '}' },
  ])
})

test('tokenizes JSON with null and escaped strings', () => {
  const code = `{
  "data": null,
  "message": "Hello \\"World\\""
}`
  const tokens = TokenizeJson.tokenizeJson(code)
  expect(tokens).toEqual([
    { type: TokenType.Delimiter, text: '{' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"data"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Keyword, text: 'null' },
    { type: TokenType.Delimiter, text: ',' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.String, text: '"message"' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.String, text: '"Hello \\"World\\""' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Delimiter, text: '}' },
  ])
})
