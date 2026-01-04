import type { Token } from '../Token/Token.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const tokenToVdom = (token: Token): VirtualElement => {
  return {
    children: [token.text],
    className: `Token Token${token.type}`,
    type: 'span',
  }
}
