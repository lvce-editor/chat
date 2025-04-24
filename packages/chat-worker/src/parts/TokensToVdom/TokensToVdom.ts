import type { Token } from '../Token/Token.ts'
import { tokenToVdom } from '../TokenToVdom/TokenToVdom.ts'

export const tokensToVDOM = (tokens: readonly Token[]): readonly any[] => {
  return tokens.map(tokenToVdom)
}
