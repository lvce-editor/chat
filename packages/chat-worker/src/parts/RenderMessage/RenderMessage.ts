import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import type { MessageBlock } from '../FormatMessage/FormatMessage.ts'

export const renderMessage = (message: string | MessageBlock[], role: 'human' | 'ai'): VirtualElement => {
  const messageElement: VirtualElement = {
    type: 'div',
    className: role === 'human' ? 'MessageHuman' : 'MessageAi',
  }

  if (typeof message === 'string') {
    return {
      ...messageElement,
      textContent: message,
    }
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
    return {
      type: 'p',
      textContent: block.content,
    }
  })

  return {
    ...messageElement,
    children: blocks,
  }
}
