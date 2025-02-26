import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const tokenizeToml = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0

  while (current < code.length) {
    const char = code[current]

    // Handle comments
    if (char === '#') {
      let text = ''
      while (current < code.length && code[current] !== '\n') {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.Comment, text })
      continue
    }

    // Handle section headers [section]
    if (char === '[') {
      let text = '['
      current++
      while (current < code.length && code[current] !== ']') {
        text += code[current]
        current++
      }
      if (current < code.length) {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.Keyword, text })
      continue
    }

    // Handle strings with quotes
    if (char === '"' || char === "'") {
      let text = char
      const quote = char
      current++

      while (current < code.length && code[current] !== quote) {
        if (code[current] === '\\' && current + 1 < code.length) {
          text += code[current] + code[current + 1]
          current += 2
          continue
        }
        text += code[current]
        current++
      }

      if (current < code.length) {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.String, text })
      continue
    }

    // Handle numbers
    if (isNumber(char) || (char === '-' && isNumber(code[current + 1]))) {
      let text = ''
      while (current < code.length && (isNumber(code[current]) || code[current] === '.' || code[current] === '-')) {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.Number, text })
      continue
    }

    // Handle boolean values
    if (char.toLowerCase() === 't' || char.toLowerCase() === 'f') {
      const possibleBool = code.slice(current, current + 5).toLowerCase()
      if (possibleBool.startsWith('true') || possibleBool.startsWith('false')) {
        const text = possibleBool.startsWith('true') ? 'true' : 'false'
        tokens.push({ type: TokenType.Keyword, text })
        current += text.length
        continue
      }
    }

    // Handle property keys
    if (isAlpha(char)) {
      let text = ''
      while (current < code.length && (isAlphaNumeric(code[current]) || code[current] === '_' || code[current] === '-')) {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.Property, text })
      continue
    }

    // Handle operators (=)
    if (char === '=') {
      tokens.push({ type: TokenType.Operator, text: char })
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
      tokens.push({ type: TokenType.Whitespace, text })
      continue
    }

    // Handle any other characters
    tokens.push({ type: TokenType.Text, text: char })
    current++
  }

  return tokens
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char)
}

function isAlpha(char: string): boolean {
  return /[a-z]/i.test(char)
}

function isNumber(char: string): boolean {
  return /[0-9]/.test(char)
}

function isAlphaNumeric(char: string): boolean {
  return /[a-z0-9]/i.test(char)
}
