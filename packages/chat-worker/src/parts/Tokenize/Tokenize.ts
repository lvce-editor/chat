import type { Token } from '../Token/Token.ts'
import * as TokenizeCss from '../TokenizeCss/TokenizeCss.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'
import * as TokenizeJson from '../TokenizeJson/TokenizeJson.ts'
import * as TokenizePython from '../TokenizePython/TokenizePython.ts'
import * as TokenizeToml from '../TokenizeToml/TokenizeToml.ts'
import * as TokenizeTypeScript from '../TokenizeTypeScript/TokenizeTypeScript.ts'

export const tokenize = (code: string, language: string): readonly Token[] => {
  switch (language.toLowerCase()) {
    case 'html':
      return TokenizeHtml.tokenizeHtml(code)
    case 'python':
      return TokenizePython.tokenizePython(code)
    case 'css':
      return TokenizeCss.tokenizeCss(code)
    case 'json':
      return TokenizeJson.tokenizeJson(code)
    case 'toml':
      return TokenizeToml.tokenizeToml(code)
    case 'typescript':
    case 'javascript':
    case 'jsx':
    case 'tsx':
      return TokenizeTypeScript.tokenizeTypeScript(code)
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
