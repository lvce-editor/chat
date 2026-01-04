import { test, expect } from '@jest/globals'
import * as TokenizeToml from '../src/parts/TokenizeToml/TokenizeToml.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('tokenizes basic TOML', () => {
  const code = `# This is a comment
title = "My Config"

[server]
port = 8080
enabled = true`

  const tokens = TokenizeToml.tokenizeToml(code)
  expect(tokens).toEqual([
    { text: '# This is a comment', type: TokenType.Comment },
    { text: '\n', type: TokenType.Whitespace },
    { text: 'title', type: TokenType.Property },
    { text: ' ', type: TokenType.Whitespace },
    { text: '=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '"My Config"', type: TokenType.String },
    { text: '\n\n', type: TokenType.Whitespace },
    { text: '[server]', type: TokenType.Keyword },
    { text: '\n', type: TokenType.Whitespace },
    { text: 'port', type: TokenType.Property },
    { text: ' ', type: TokenType.Whitespace },
    { text: '=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '8080', type: TokenType.Number },
    { text: '\n', type: TokenType.Whitespace },
    { text: 'enabled', type: TokenType.Property },
    { text: ' ', type: TokenType.Whitespace },
    { text: '=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: 'true', type: TokenType.Keyword },
  ])
})

test('tokenizes TOML with nested sections and strings', () => {
  const code = `[database]
connection = "postgresql://user:pass@localhost"
timeout = 30`

  const tokens = TokenizeToml.tokenizeToml(code)
  expect(tokens).toEqual([
    { text: '[database]', type: TokenType.Keyword },
    { text: '\n', type: TokenType.Whitespace },
    { text: 'connection', type: TokenType.Property },
    { text: ' ', type: TokenType.Whitespace },
    { text: '=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '"postgresql://user:pass@localhost"', type: TokenType.String },
    { text: '\n', type: TokenType.Whitespace },
    { text: 'timeout', type: TokenType.Property },
    { text: ' ', type: TokenType.Whitespace },
    { text: '=', type: TokenType.Operator },
    { text: ' ', type: TokenType.Whitespace },
    { text: '30', type: TokenType.Number },
  ])
})
