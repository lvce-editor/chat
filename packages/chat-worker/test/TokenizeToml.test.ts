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
    { type: TokenType.Comment, text: '# This is a comment' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Property, text: 'title' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.String, text: '"My Config"' },
    { type: TokenType.Whitespace, text: '\n\n' },
    { type: TokenType.Keyword, text: '[server]' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Property, text: 'port' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '8080' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Property, text: 'enabled' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Keyword, text: 'true' },
  ])
})

test('tokenizes TOML with nested sections and strings', () => {
  const code = `[database]
connection = "postgresql://user:pass@localhost"
timeout = 30`

  const tokens = TokenizeToml.tokenizeToml(code)
  expect(tokens).toEqual([
    { type: TokenType.Keyword, text: '[database]' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Property, text: 'connection' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.String, text: '"postgresql://user:pass@localhost"' },
    { type: TokenType.Whitespace, text: '\n' },
    { type: TokenType.Property, text: 'timeout' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Operator, text: '=' },
    { type: TokenType.Whitespace, text: ' ' },
    { type: TokenType.Number, text: '30' },
  ])
})
