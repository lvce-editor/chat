import { test, expect } from '@jest/globals'
import * as TokenizeCss from '../src/parts/TokenizeCss/TokenizeCss.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic CSS', () => {
  const code = `.header {
  color: red;
  font-size: 16px;
}`
  const tokens = TokenizeCss.tokenizeCss(code)
  expect(tokens).toEqual([
    { type: TokenType.Selector, text: '.header' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Delimiter, text: '{' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.Property, text: 'color' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Value, text: 'red' },
    { type: TokenType.Delimiter, text: ';' },
    { type: TokenType.Whitespace, text: '\n  ' },
    { type: TokenType.Property, text: 'font-size' },
    { type: TokenType.Delimiter, text: ':' },
    { type: TokenType.Value, text: '16px' },
    { type: TokenType.Delimiter, text: ';' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Delimiter, text: '}' },
  ])
})

test('tokenizes CSS comments', () => {
  const code = '/* Header styles */\n.header { color: blue; }'
  const tokens = TokenizeCss.tokenizeCss(code)
  expect(tokens).toEqual([
    { type: TokenType.Comment, text: '/* Header styles */' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Selector, text: '.header' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Delimiter, text: '{' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Property, text: 'color' },
    { type: TokenType.Delimiter, text: ':' },
    {
      text: ' ',
      type: 'Whitespace',
    },
    { type: TokenType.Value, text: 'blue' },
    { type: TokenType.Delimiter, text: ';' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Delimiter, text: '}' },
  ])
})
