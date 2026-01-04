import { test, expect } from '@jest/globals'
import * as Tokenize from '../src/parts/Tokenize/Tokenize.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes HTML code', () => {
  const code = '<div class="test">Hello</div>'
  const result = Tokenize.tokenize(code, 'html')
  expect(result).toEqual([
    { text: '<div', type: TokenType.Tag },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'class', type: TokenType.Attribute },
    { text: '=', type: TokenType.Operator },
    { text: '"test"', type: TokenType.String },
    { text: '>', type: TokenType.Tag },
    { text: 'Hello', type: TokenType.Text },
    { text: '</div', type: TokenType.Tag },
    { text: '>', type: TokenType.Tag },
  ])
})

test.skip('tokenizes Python code', () => {
  const code = 'def hello(name):\n    print("Hello, " + name)'
  const result = Tokenize.tokenize(code, 'python')
  expect(result).toEqual([
    { text: 'def', type: TokenType.Keyword },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'hello', type: TokenType.Identifier },
    { text: '(', type: TokenType.Delimiter },
    { text: 'name', type: TokenType.Identifier },
    { text: ')', type: TokenType.Delimiter },
    { text: ':', type: TokenType.Delimiter },
    { text: '\n    ', type: TokenType.Whitespace },
    { text: 'print', type: TokenType.Identifier },
    { text: '(', type: TokenType.Delimiter },
    { text: '"Hello, "', type: TokenType.String },
    { text: ' ', type: TokenType.Whitespace },
    { text: '+', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'name', type: TokenType.Identifier },
    { text: ')', type: TokenType.Delimiter },
  ])
})

test('handles unsupported language', () => {
  const code = 'some random code'
  const result = Tokenize.tokenize(code, 'unsupported')
  expect(result).toEqual([
    {
      text: 'some random code',
      type: 'text',
    },
  ])
})
