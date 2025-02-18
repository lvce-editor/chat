import type { Token } from '../Token/Token.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'
import * as TokenizePython from '../TokenizePython/TokenizePython.ts'
import * as TokenizeCss from '../TokenizeCss/TokenizeCss.ts'

export const tokenize = (code: string, language: string): readonly Token[] => {
  switch (language.toLowerCase()) {
    case 'html':
      return TokenizeHtml.tokenizeHtml(code)
    case 'python':
      return TokenizePython.tokenizePython(code)
    case 'css':
      return TokenizeCss.tokenizeCss(code)
    default:
      // For unsupported languages, just return the code as plain text
      return [
        {
          type: 'text',
          text: code,
        },
      ]
  }
}
