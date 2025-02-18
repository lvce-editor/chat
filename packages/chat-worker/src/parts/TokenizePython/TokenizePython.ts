import type { Token } from '../Token/Token.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const tokenizePython = (code: string): readonly Token[] => {
  const tokens: Token[] = []
  let current = 0

  // Python keywords
  const keywords = new Set([
    'def',
    'class',
    'if',
    'else',
    'elif',
    'while',
    'for',
    'in',
    'return',
    'import',
    'from',
    'as',
    'try',
    'except',
    'finally',
    'raise',
    'None',
    'True',
    'False',
    'and',
    'or',
    'not',
    'is',
    'lambda',
    'with',
    'global',
    'nonlocal',
  ])

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

    // Handle strings (both single and double quotes)
    if (char === '"' || char === "'") {
      const quote = char
      let text = char
      current++

      while (current < code.length && code[current] !== quote) {
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
    if (isNumber(char) || (char === '.' && isNumber(code[current + 1]))) {
      let text = ''
      while (current < code.length && (isNumber(code[current]) || code[current] === '.')) {
        text += code[current]
        current++
      }
      tokens.push({ type: TokenType.Number, text })
      continue
    }

    // Handle identifiers and keywords
    if (isAlpha(char) || char === '_') {
      let text = ''
      while (current < code.length && (isAlphaNumeric(code[current]) || code[current] === '_')) {
        text += code[current]
        current++
      }

      const type = keywords.has(text) ? TokenType.Keyword : TokenType.Identifier
      tokens.push({ type, text })
      continue
    }

    // Handle operators
    if (isOperator(char)) {
      let text = char
      current++

      // Handle multi-character operators like ==, >=, <=, !=
      if (current < code.length && isOperator(code[current])) {
        text += code[current]
        current++
      }

      tokens.push({ type: TokenType.Operator, text })
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

// Helper functions
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
  return /[+\-*/%=<>!&|^~]/.test(char)
}

function isDelimiter(char: string): boolean {
  return /\[\(\)\[\]{}:;,.]/.test(char)
}
