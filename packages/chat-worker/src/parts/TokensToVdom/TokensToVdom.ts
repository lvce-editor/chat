import type { Token } from '../Token/Token.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

const tokenToVdom = (token: Token): VirtualElement => {
  return {
    type: 'span',
    className: `Token Token${token.type}`,
    children: [token.text],
  }
}

// Then you could convert tokens to vdom like this:
export const tokensToVDOM = (tokens: readonly Token[]): readonly any[] => {
  return tokens.map(tokenToVdom)
}
