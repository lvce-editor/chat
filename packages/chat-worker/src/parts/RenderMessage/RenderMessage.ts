import type { MessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const renderMessage = (viewModel: MessageViewModel): VirtualElement => {
  const { role, blocks } = viewModel
  const messageElement: VirtualElement = {
    type: 'div',
    className: role === 'human' ? 'MessageHuman' : 'MessageAi',
  }

  const wrappedMessage: VirtualElement = {
    type: 'div',
    className: `MessageWrapper MessageWrapper--${role}`,
    children: [messageElement],
  }

  const blocksHtml = blocks.map((block) => {
    if (block.type === 'code') {
      return {
        type: 'pre',
        className: `CodeBlock language-${block.display.language}`,
        children: [
          {
            type: 'code',
            className: 'CodeText',
            textContent: block.content,
          },
        ],
      }
    }
    if (block.type === 'image') {
      // TODO create view model that creates object urls for images
      const src = 'todo' // TODO
      return {
        type: 'div',
        className: 'ImageBlock',
        children: [
          {
            type: 'img',
            className: 'MessageImage',
            src,
          },
        ],
      }
    }
    return {
      type: 'p',
      textContent: block.content,
    }
  })

  messageElement.children = blocksHtml
  return wrappedMessage
}
