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
    { text: '.header', type: TokenType.Selector },
    { text: ' ', type: TokenType.Whitespace },
    { text: '{', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: 'color', type: TokenType.Property },
    { text: ':', type: TokenType.Delimiter },
    {
      text: ' ',
      type: 'Whitespace',
    },
    { text: 'red', type: TokenType.Value },
    { text: ';', type: TokenType.Delimiter },
    { text: '\n  ', type: TokenType.Whitespace },
    { text: 'font-size', type: TokenType.Property },
    { text: ':', type: TokenType.Delimiter },
    {
      text: ' ',
      type: 'Whitespace',
    },
    { text: '16px', type: TokenType.Value },
    { text: ';', type: TokenType.Delimiter },
    { text: '\n', type: TokenType.Whitespace },
    { text: '}', type: TokenType.Delimiter },
  ])
})

test('tokenizes CSS comments', () => {
  const code = '/* Header styles */\n.header { color: blue; }'
  const tokens = TokenizeCss.tokenizeCss(code)
  expect(tokens).toEqual([
    { text: '/* Header styles */', type: TokenType.Comment },
    { text: '\n', type: TokenType.Whitespace },
    { text: '.header', type: TokenType.Selector },
    { text: ' ', type: TokenType.Whitespace },
    { text: '{', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'color', type: TokenType.Property },
    { text: ':', type: TokenType.Delimiter },
    {
      text: ' ',
      type: 'Whitespace',
    },
    { text: 'blue', type: TokenType.Value },
    { text: ';', type: TokenType.Delimiter },
    { text: ' ', type: TokenType.Whitespace },
    { text: '}', type: TokenType.Delimiter },
  ])
})
