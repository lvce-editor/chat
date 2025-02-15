import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const renderMessage = (message: readonly MessageContent[], role: 'human' | 'ai'): VirtualElement => {
  const messageElement: VirtualElement = {
    type: 'div',
    className: role === 'human' ? 'MessageHuman' : 'MessageAi',
  }

  const wrappedMessage: VirtualElement = {
    type: 'div',
    className: `MessageWrapper MessageWrapper--${role}`,
    children: [messageElement],
  }

  if (typeof message === 'string') {
    messageElement.textContent = message
    return wrappedMessage
  }

  const blocks = message.map((block) => {
    if (block.type === 'code') {
      return {
        type: 'pre',
        className: `CodeBlock language-${block.language}`,
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

  messageElement.children = blocks
  return wrappedMessage
}
