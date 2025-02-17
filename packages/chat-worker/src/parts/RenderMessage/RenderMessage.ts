import type { MessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const renderMessage = (viewModel: MessageViewModel): VirtualElement => {
  const { role, blocks } = viewModel
  const isError = blocks.some((block) => block.content.startsWith('Error:'))
  const messageElement: VirtualElement = {
    type: 'div',
<<<<<<< HEAD
    className: isError ? 'MessageError' : (role === 'human' ? 'MessageHuman' : 'MessageAi'),
=======
    className: isError ? 'MessageError' : role === 'human' ? 'MessageHuman' : 'MessageAi',
>>>>>>> 24d5103dfb0e (feature: display error message if chat message error occurs)
  }

  const wrappedMessage: VirtualElement = {
    type: 'div',
    className: `MessageWrapper MessageWrapper--${role}${isError ? ' MessageWrapper--error' : ''}`,
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
      return {
        type: 'div',
        className: 'ImageBlock',
        children: [
          {
            type: 'img',
            className: 'MessageImage',
            src: block.display.blobUrl,
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
