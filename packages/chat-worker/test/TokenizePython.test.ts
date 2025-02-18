import { test, expect } from '@jest/globals'
import * as TokenizePython from '../src/parts/TokenizePython/TokenizePython.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic Python code', () => {
  const code = 'def hello(name):\n    print("Hello, " + name)'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: TokenType.Keyword, text: 'def' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'hello' },
    { type: TokenType.Text, text: '(' },
    { type: TokenType.Identifier, text: 'name' },
    { type: TokenType.Text, text: ')' },
    { type: TokenType.Text, text: ':' },
    { type: TokenType.Whitespace, text: '\n    ' },
    { type: TokenType.Identifier, text: 'print' },
    { type: TokenType.Text, text: '(' },
    { type: TokenType.String, text: '"Hello, "' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '+' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Identifier, text: 'name' },
    { type: TokenType.Text, text: ')' },
  ])
})

test('tokenizes Python comments', () => {
  const code = '# This is a comment\nx = 1  # inline comment'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: TokenType.Comment, text: '# This is a comment' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Identifier, text: 'x' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '1' },
    { type: TokenType.Whitespace, text: '  ' },
    { type: TokenType.Comment, text: '# inline comment' },
  ])
})

test('tokenizes Python strings', () => {
  const code = '"double quotes" \'single quotes\''
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: TokenType.String, text: '"double quotes"' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.String, text: "'single quotes'" },
  ])
})

test('tokenizes Python numbers', () => {
  const code = '42 3.14 .5'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: TokenType.Number, text: '42' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '3.14' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '.5' },
  ])
})

test('tokenizes Python operators', () => {
  const code = '+ - * / == != >= <='
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: TokenType.Operator, text: '+' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '-' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '*' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '/' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '==' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '!=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '>=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '<=' },
  ])
})
