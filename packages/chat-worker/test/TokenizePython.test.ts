import { test, expect } from '@jest/globals'
import * as TokenizePython from '../src/parts/TokenizePython/TokenizePython.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic Python code', () => {
  const code = 'def hello(name):\n    print("Hello, " + name)'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { text: 'def', type: TokenType.Keyword },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'hello', type: TokenType.Identifier },
    { text: '(', type: TokenType.Text },
    { text: 'name', type: TokenType.Identifier },
    { text: ')', type: TokenType.Text },
    { text: ':', type: TokenType.Text },
    { text: '\n    ', type: TokenType.Whitespace },
    { text: 'print', type: TokenType.Identifier },
    { text: '(', type: TokenType.Text },
    { text: '"Hello, "', type: TokenType.String },
    { text: ' ', type: TokenType.Whitespace },
    { text: '+', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'name', type: TokenType.Identifier },
    { text: ')', type: TokenType.Text },
  ])
})

test('tokenizes Python comments', () => {
  const code = '# This is a comment\nx = 1  # inline comment'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { text: '# This is a comment', type: TokenType.Comment },
    { text: '\n', type: TokenType.Whitespace },
    { text: 'x', type: TokenType.Identifier },
    { text: ' ', type: TokenType.Whitespace },
    { text: '=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '1', type: TokenType.Number },
    { text: '  ', type: TokenType.Whitespace },
    { text: '# inline comment', type: TokenType.Comment },
  ])
})

test('tokenizes Python strings', () => {
  const code = '"double quotes" \'single quotes\''
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { text: '"double quotes"', type: TokenType.String },
    { text: ' ', type: TokenType.Whitespace },
    { text: "'single quotes'", type: TokenType.String },
  ])
})

test('tokenizes Python numbers', () => {
  const code = '42 3.14 .5'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { text: '42', type: TokenType.Number },
    { text: ' ', type: TokenType.Whitespace },
    { text: '3.14', type: TokenType.Number },
    { text: ' ', type: TokenType.Whitespace },
    { text: '.5', type: TokenType.Number },
  ])
})

test('tokenizes Python operators', () => {
  const code = '+ - * / == != >= <='
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { text: '+', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '-', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '*', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '/', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '==', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '!=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '>=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '<=', type: TokenType.Operator },
  ])
})
