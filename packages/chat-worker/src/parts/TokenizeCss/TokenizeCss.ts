import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

type State = 'initial' | 'inSelector' | 'inBlock'

export const tokenizeCss = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0
  let state: State = 'initial'
  const stateStack: State[] = []

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
      tokens.push({ text, type: TokenType.Comment })
      continue
    }

    // Handle opening block
    if (char === '{') {
      tokens.push({ text: char, type: TokenType.Delimiter })
      stateStack.push(state)
      state = 'inBlock'
      current++
      continue
    }

    // Handle closing block
    if (char === '}') {
      tokens.push({ text: char, type: TokenType.Delimiter })
      state = stateStack.pop() || 'initial'
      current++
      continue
    }

    // Handle selectors
    if ((state === 'initial' || state === 'inSelector') && (char === '.' || char === '#' || isAlpha(char))) {
      let text = ''
      while (current < code.length && !isDelimiter(code[current]) && !isWhitespace(code[current])) {
        text += code[current]
        current++
      }
      tokens.push({ text, type: TokenType.Selector })
      state = 'inSelector'
      continue
    }

    // Handle properties
    if (state === 'inBlock' && isAlpha(char)) {
      let text = ''
      while (current < code.length && (isAlphaNumeric(code[current]) || code[current] === '-')) {
        text += code[current]
        current++
      }
      if (properties.has(text)) {
        tokens.push({ text, type: TokenType.Property })
      } else {
        tokens.push({ text, type: TokenType.Identifier })
      }
      continue
    }

    // Handle values
    if (char === ':') {
      tokens.push({ text: char, type: TokenType.Delimiter })
      current++

      // Skip whitespace after colon
      let whitespace = ''
      while (current < code.length && isWhitespace(code[current])) {
        whitespace += code[current]
        current++
      }
      if (whitespace) {
        tokens.push({ text: whitespace, type: TokenType.Whitespace })
      }

      // Capture value
      let text = ''
      while (current < code.length && code[current] !== ';' && code[current] !== '}') {
        text += code[current]
        current++
      }
      if (text) {
        tokens.push({ text: text.trim(), type: TokenType.Value })
      }
      continue
    }

    // Handle delimiters
    if (isDelimiter(char)) {
      tokens.push({ text: char, type: TokenType.Delimiter })
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
