import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import * as TokensToVdom from '../TokensToVdom/TokensToVdom.ts'

export const getCodeBlockVirtualDom = (block: MessageBlockViewModel, isError: boolean): VirtualElement => {
  const codeContent = block.display.tokens
    ? TokensToVdom.tokensToVDOM(block.display.tokens)
    : [{ children: [block.content], type: 'span' }]

  return {
    children: [
      {
        children: codeContent,
        className: isError ? 'MessageCodeTextError' : 'CodeText',
        type: 'code',
      },
    ],
    className: `CodeBlock language-${block.display.language}`,
    type: 'pre',
  }
}
