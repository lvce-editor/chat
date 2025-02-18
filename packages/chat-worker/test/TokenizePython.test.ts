import { test, expect } from '@jest/globals'
import * as TokenizePython from '../src/parts/TokenizePython/TokenizePython.ts'

test('tokenizes basic Python code', () => {
  const code = 'def hello(name):\n    print("Hello, " + name)'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: 'keyword', text: 'def' },
    { type: 'whitespace', text: ' ' },
    { type: 'identifier', text: 'hello' },
    { type: 'delimiter', text: '(' },
    { type: 'identifier', text: 'name' },
    { type: 'delimiter', text: ')' },
    { type: 'delimiter', text: ':' },
    { type: 'whitespace', text: '\n    ' },
    { type: 'identifier', text: 'print' },
    { type: 'delimiter', text: '(' },
    { type: 'string', text: '"Hello, "' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '+' },
    { type: 'whitespace', text: ' ' },
    { type: 'identifier', text: 'name' },
    { type: 'text', text: ')' },
  ])
})

test('tokenizes Python comments', () => {
  const code = '# This is a comment\nx = 1  # inline comment'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: 'comment', text: '# This is a comment' },
    { type: 'whitespace', text: '\n' },
    { type: 'identifier', text: 'x' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '=' },
    { type: 'whitespace', text: ' ' },
    { type: 'number', text: '1' },
    { type: 'whitespace', text: '  ' },
    { type: 'comment', text: '# inline comment' },
  ])
})

test('tokenizes Python strings', () => {
  const code = '"double quotes" \'single quotes\''
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: 'string', text: '"double quotes"' },
    { type: 'whitespace', text: ' ' },
    { type: 'string', text: "'single quotes'" },
  ])
})

test('tokenizes Python numbers', () => {
  const code = '42 3.14 .5'
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: 'number', text: '42' },
    { type: 'whitespace', text: ' ' },
    { type: 'number', text: '3.14' },
    { type: 'whitespace', text: ' ' },
    { type: 'number', text: '.5' },
  ])
})

test('tokenizes Python operators', () => {
  const code = '+ - * / == != >= <='
  const tokens = TokenizePython.tokenizePython(code)
  expect(tokens).toEqual([
    { type: 'operator', text: '+' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '-' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '*' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '/' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '==' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '!=' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '>=' },
    { type: 'whitespace', text: ' ' },
    { type: 'operator', text: '<=' },
  ])
})
