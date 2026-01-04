import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const tokenizeHtml = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0

  while (current < code.length) {
    const char = code[current]

    // Handle tags
    if (char === '<') {
      let text = char
      current++

      while (current < code.length && code[current] !== '>' && !isWhitespace(code[current])) {
        text += code[current]
        current++
      }

      tokens.push({ text, type: TokenType.Tag })
      continue
    }

    // Handle tag endings
    if (char === '>') {
      tokens.push({ text: char, type: TokenType.Tag })
      current++
      continue
    }

    // Handle attributes
    if (isAlpha(char)) {
      let text = ''

      while (current < code.length && (isAlphaNumeric(code[current]) || code[current] === '-')) {
        text += code[current]
        current++
      }

      if (current < code.length && code[current] === '=') {
        tokens.push({ text, type: TokenType.Attribute })
        tokens.push({ text: '=', type: TokenType.Operator })
        current++
      } else {
        tokens.push({ text, type: TokenType.Text })
      }
      continue
    }

    // Handle attribute values
    if (char === '"') {
      let text = char
      current++

      while (current < code.length && code[current] !== '"') {
        text += code[current]
        current++
      }

      text += code[current]
      tokens.push({ text, type: TokenType.String })
      current++
      continue
    }

    // Handle whitespace
    if (isWhitespace(char)) {
      let text = ''

      while (current < code.length && isWhitespace(code[current])) {
        text += code[current]
        current++
      }

      tokens.push({ text, type: TokenType.Whitespace })
      continue
    }

    // Handle any other characters
    tokens.push({ text: char, type: TokenType.Text })
    current++
  }

  return tokens
}

// Helper functions
function isWhitespace(char) {
  return /\s/.test(char)
}

function isAlpha(char) {
  return /[a-z]/i.test(char)
}

function isAlphaNumeric(char) {
  return /[a-z0-9]/i.test(char)
}
