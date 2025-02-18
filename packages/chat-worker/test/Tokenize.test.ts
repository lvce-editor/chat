import { test, expect } from '@jest/globals'
import * as Tokenize from '../src/parts/Tokenize/Tokenize.ts'

test('tokenizes HTML code', () => {
  const code = '<div class="test">Hello</div>'
  const result = Tokenize.tokenize(code, 'html')
  expect(result).toEqual([
    { type: 'tag', text: '<div' },
    { type: 'whitespace', text: ' ' },
    { type: 'attribute', text: 'class' },
    { type: 'operator', text: '=' },
    { type: 'string', text: '"test"' },
    { type: 'tag', text: '>' },
    { type: 'text', text: 'Hello' },
    { type: 'tag', text: '</div' },
    { type: 'tag', text: '>' },
  ])
})

test('tokenizes Python code', () => {
  const code = 'def hello(name):\n    print("Hello, " + name)'
  const result = Tokenize.tokenize(code, 'python')
  expect(result).toEqual([
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
    { type: 'delimiter', text: ')' },
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
