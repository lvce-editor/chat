import type { Token } from '../Token/Token.ts'

// Then you could convert tokens to vdom like this:
export const tokensToVDOM = (tokens: readonly Token[]): readonly any[] => {
  return tokens.map((token) => {
    return {
      type: 'span',
      props: {
        className: `token-${token.type}`,
      },
      children: [token.text],
    }
  })
}
