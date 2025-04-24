import type { Token } from '../Token/Token.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const tokenToVdom = (token: Token): VirtualElement => {
  return {
    type: 'span',
    className: `Token Token${token.type}`,
    children: [token.text],
  }
}
