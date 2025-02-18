import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as TokensToVdom from '../TokensToVdom/TokensToVdom.ts'

export const getCodeBlockVirtualDom = (block: MessageBlockViewModel, isError: boolean): VirtualElement => {
  const codeContent = block.display.tokens
    ? TokensToVdom.tokensToVDOM(block.display.tokens)
    : [{ type: 'span', children: [block.content] }]

  return {
    type: 'pre',
    className: `CodeBlock language-${block.display.language}`,
    children: [
      {
        type: 'code',
        className: isError ? 'MessageCodeTextError' : 'CodeText',
        children: codeContent,
      },
    ],
  }
}
