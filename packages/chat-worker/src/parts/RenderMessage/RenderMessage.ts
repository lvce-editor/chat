import type { MessageBlock } from '../FormatMessage/FormatMessage.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const renderMessage = (message: string | MessageBlock[], role: 'human' | 'ai'): VirtualElement => {
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
    // @ts-ignore
    if (block.type === 'image') {
      return {
        type: 'div',
        className: 'ImageBlock',
        children: [
          {
            type: 'img',
            className: 'MessageImage',
            // @ts-ignore
            src: block.blobUrl,
          },
        ],
      }
    }
    return {
      type: 'p',
      // @ts-ignore
      textContent: block.content || block.text,
    }
  })

  messageElement.children = blocks
  return wrappedMessage
}
