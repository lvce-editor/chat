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
    { text: '{', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"name"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '"John"', type: TokenType.String },
    { text: ',', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"age"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '30', type: TokenType.Number },
    { text: ',', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"isStudent"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'false', type: TokenType.Keyword },
    { text: '\n', type: TokenType.Whitespace },
    { text: '}', type: TokenType.Delimiter },
  ])
})

test('tokenizes JSON with arrays', () => {
  const code = `{
  "numbers": [1, 2.5, -3.14],
  "names": ["Alice", "Bob"]
}`
  const tokens = TokenizeJson.tokenizeJson(code)
  expect(tokens).toEqual([
    { text: '{', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"numbers"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '[', type: TokenType.Delimiter },
    { text: '1', type: TokenType.Number },
    { text: ',', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '2.5', type: TokenType.Number },
    { text: ',', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '-3.14', type: TokenType.Number },
    { text: ']', type: TokenType.Delimiter },
    { text: ',', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"names"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '[', type: TokenType.Delimiter },
    { text: '"Alice"', type: TokenType.String },
    { text: ',', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '"Bob"', type: TokenType.String },
    { text: ']', type: TokenType.Delimiter },
    { text: '\n', type: TokenType.Whitespace },
    { text: '}', type: TokenType.Delimiter },
  ])
})

test('tokenizes JSON with null and escaped strings', () => {
  const code = `{
  "data": null,
  "message": "Hello \\"World\\""
}`
  const tokens = TokenizeJson.tokenizeJson(code)
  expect(tokens).toEqual([
    { text: '{', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"data"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'null', type: TokenType.Keyword },
    { text: ',', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: '"message"', type: TokenType.String },
    { text: ':', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: String.raw`"Hello \"World\""`, type: TokenType.String },
    { text: '\n', type: TokenType.Whitespace },
    { text: '}', type: TokenType.Delimiter },
  ])
})
