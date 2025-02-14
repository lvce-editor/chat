import type { Message } from '../Message/Message.ts'

export const formatMessages = (messages: readonly Message[]) => {
  return messages.map((message) => ({
    role: message.role === 'human' ? 'user' : 'assistant',
    content: Array.isArray(message.content)
      ? message.content.map((block) => {
          if (block.type === 'image') {
            return {
              type: 'image',
              source: {
                type: 'base64',
                media_type: block.mediaType,
                data: block.content,
              },
            }
          }
          if (block.type === 'text') {
            return {
              type: 'text',
              text: block.content,
            }
          }
          return {
            type: 'text',
            text: block.content,
          }
        })
      : message.content,
  }))
}
