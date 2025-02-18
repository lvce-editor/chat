import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

type State = 'initial' | 'inString' | 'inNumber' | 'inKeyword'

export const tokenizeJson = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0
  // @ts-ignore
  let state: State = 'initial'
  const stateStack: State[] = []

  while (current < code.length) {
    const char = code[current]

    // Handle strings
    if (char === '"') {
      let text = char
      current++
      state = 'inString'

      while (current < code.length && code[current] !== '"') {
        // Handle escaped characters
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
      state = stateStack.pop() || 'initial'
      continue
    }

    // Handle numbers
    if (isNumber(char) || (char === '-' && isNumber(code[current + 1]))) {
      let text = ''
      state = 'inNumber'

      // Handle negative numbers
      if (char === '-') {
        text += char
        current++
      }

      // Handle integer part
      while (current < code.length && isNumber(code[current])) {
        text += code[current]
        current++
      }

      // Handle decimal part
      if (current < code.length && code[current] === '.') {
        text += code[current]
        current++
        while (current < code.length && isNumber(code[current])) {
          text += code[current]
          current++
        }
      }

      // Handle exponent part
      if (current < code.length && (code[current] === 'e' || code[current] === 'E')) {
        text += code[current]
        current++
        if (current < code.length && (code[current] === '+' || code[current] === '-')) {
          text += code[current]
          current++
        }
        while (current < code.length && isNumber(code[current])) {
          text += code[current]
          current++
        }
      }

      tokens.push({ type: TokenType.Number, text })
      state = stateStack.pop() || 'initial'
      continue
    }

    // Handle keywords (true, false, null)
    if (isAlpha(char)) {
      let text = ''
      state = 'inKeyword'

      while (current < code.length && isAlpha(code[current])) {
        text += code[current]
        current++
      }

      if (text === 'true' || text === 'false' || text === 'null') {
        tokens.push({ type: TokenType.Keyword, text })
      } else {
        tokens.push({ type: TokenType.Text, text })
      }
      state = stateStack.pop() || 'initial'
      continue
    }

    // Handle delimiters
    if (isDelimiter(char)) {
      tokens.push({ type: TokenType.Delimiter, text: char })
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

function isNumber(char: string): boolean {
  return /[0-9]/.test(char)
}

function isAlpha(char: string): boolean {
  return /[a-z]/i.test(char)
}

function isDelimiter(char: string): boolean {
  return /[{}[\]:,]/.test(char)
}
