import { test, expect } from '@jest/globals'
import * as Tokenize from '../src/parts/Tokenize/Tokenize.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes HTML code', () => {
  const code = '<div class="test">Hello</div>'
  const result = Tokenize.tokenize(code, 'html')
  expect(result).toEqual([
    { type: TokenType.Tag, text: '<div' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Attribute, text: 'class' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.String, text: '"test"' },
    { type: TokenType.Tag, text: '>' },
    { type: TokenType.Text, text: 'Hello' },
    { type: TokenType.Tag, text: '</div' },
    { type: TokenType.Tag, text: '>' },
  ])
})

test.skip('tokenizes Python code', () => {
  const code = 'def hello(name):\n    print("Hello, " + name)'
  const result = Tokenize.tokenize(code, 'python')
  expect(result).toEqual([
    { type: TokenType.Keyword, text: 'def' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'hello' },
    { type: TokenType.Delimiter, text: '(' },
    { type: TokenType.Identifier, text: 'name' },
    { type: TokenType.Delimiter, text: ')' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Whitespace, text: '\n    ' },
    { type: TokenType.Identifier, text: 'print' },
    { type: TokenType.Delimiter, text: '(' },
    { type: TokenType.String, text: '"Hello, "' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '+' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'name' },
    { type: TokenType.Delimiter, text: ')' },
  ])
})

test('handles unsupported language', () => {
  const code = 'some random code'
  const result = Tokenize.tokenize(code, 'unsupported')
  expect(result).toEqual([
    {
      type: 'text',
      text: 'some random code',
    },
  ])
})
