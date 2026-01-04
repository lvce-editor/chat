import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const tokenizeTypeScript = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0

  // TypeScript keywords
  const keywords = new Set([
    'let',
    'const',
    'var',
    'function',
    'class',
    'interface',
    'type',
    'if',
    'else',
    'switch',
    'case',
    'default',
    'for',
    'while',
    'do',
    'break',
    'continue',
    'return',
    'import',
    'export',
    'from',
    'as',
    'try',
    'catch',
    'finally',
    'throw',
    'null',
    'undefined',
    'true',
    'false',
    'public',
    'private',
    'protected',
    'readonly',
    'extends',
    'implements',
    'new',
    'this',
    'typeof',
    'instanceof',
    'in',
    'void',
  ])

  while (current < code.length) {
    const char = code[current]

    // Handle single-line comments
    if (char === '/' && code[current + 1] === '/') {
      let text = ''
      while (current < code.length && code[current] !== '\n') {
        text += code[current]
        current++
      }
      tokens.push({ text, type: TokenType.Comment })
      continue
    }

    // Handle multi-line comments
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

    // Handle strings with double quotes
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

      text += code[current]
      tokens.push({ text, type: TokenType.String })
      current++
      continue
    }

    // Handle numbers
    if (isNumber(char) || (char === '.' && isNumber(code[current + 1]))) {
      let text = ''
      while (current < code.length && (isNumber(code[current]) || code[current] === '.')) {
        text += code[current]
        current++
      }
      tokens.push({ text, type: TokenType.Number })
      continue
    }

    // Handle identifiers and keywords
    if (isAlpha(char) || char === '_' || char === '$') {
      let text = ''
      while (current < code.length && (isAlphaNumeric(code[current]) || code[current] === '_' || code[current] === '$')) {
        text += code[current]
        current++
      }
      const type = keywords.has(text) ? TokenType.Keyword : TokenType.Identifier
      tokens.push({ text, type })
      continue
    }

    // Handle operators
    if (isOperator(char)) {
      let text = char
      current++
      if (current < code.length && isOperator(code[current])) {
        text += code[current]
        current++
      }
      tokens.push({ text, type: TokenType.Operator })
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

function isNumber(char: string): boolean {
  return /[0-9]/.test(char)
}

function isAlphaNumeric(char: string): boolean {
  return /[a-z0-9]/i.test(char)
}

function isOperator(char: string): boolean {
  return /[+\-*/%=<>!&|^~?:]/.test(char)
}

function isDelimiter(char: string): boolean {
  return /[(){}[\],;.]/.test(char)
}
