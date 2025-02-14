import type { Message } from '../Message/Message.ts'

export const formatMessages = (messages: readonly Message[]) => {
  return messages.map((message) => ({
    role: message.role === 'human' ? 'user' : 'assistant',
    content: Array.isArray(message.content) ? message.content.map((block) => block.content).join('\n') : message.content,
  }))
}
