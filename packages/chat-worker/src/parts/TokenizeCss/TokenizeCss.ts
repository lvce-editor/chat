import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const tokenizeCss = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0

  // CSS properties and values
  const properties = new Set([
    'color',
    'background',
    'margin',
    'padding',
    'border',
    'font-size',
    'width',
    'height',
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'flex',
    'grid',
    'text-align',
    'align-items',
    'justify-content',
  ])

  while (current < code.length) {
    const char = code[current]

    // Handle comments
    if (char === '/' && code[current + 1] === '*') {
      let text = '/*'
      current += 2
      while (current < code.length && !(code[current - 1] === '*' && code[current] === '/')) {
        text += code[current]
        current++
      }
      if (current < code.length) {
        text += '/'
        current++
      }
      tokens.push({ type: TokenType.Comment, text })
      continue
    }

    // Handle selectors
    if (
      (tokens.length === 0 ||
        (tokens[tokens.length - 1].type === TokenType.Delimiter && tokens[tokens.length - 1].text === '}') ||
        tokens[tokens.length - 1].type === TokenType.Whitespace) &&
      (char === '.' || char === '#' || isAlpha(char))
    ) {
      let text = ''
      while (current < code.length && !isDelimiter(code[current]) && !isWhitespace(code[current])) {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.Selector, text })
      continue
    }

    // Handle properties
    if (isAlpha(char) && (current === 0 || isWhitespace(code[current - 1]) || code[current - 1] === '{')) {
      let text = ''
      while (current < code.length && (isAlphaNumeric(code[current]) || code[current] === '-') && code[current] !== ':') {
        text += code[current]
        current++
      }
      if (properties.has(text)) {
        tokens.push({ type: TokenType.Property, text })
      } else {
        tokens.push({ type: TokenType.Identifier, text })
      }
      continue
    }

    // Handle values
    if (char === ':') {
      tokens.push({ type: TokenType.Delimiter, text: char })
      current++

      // Skip whitespace after colon
      let whitespace = ''
      while (current < code.length && isWhitespace(code[current])) {
        whitespace += code[current]
        current++
      }
      if (whitespace) {
        tokens.push({ type: TokenType.Whitespace, text: whitespace })
      }

      // Capture value
      let text = ''
      while (current < code.length && code[current] !== ';' && code[current] !== '}') {
        text += code[current]
        current++
      }
      if (text) {
        tokens.push({ type: TokenType.Value, text: text.trim() })
      }
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

function isAlpha(char: string): boolean {
  return /[a-z]/i.test(char)
}

function isAlphaNumeric(char: string): boolean {
  return /[a-z0-9]/i.test(char)
}

function isDelimiter(char: string): boolean {
  return /[{}();,]/.test(char)
}
