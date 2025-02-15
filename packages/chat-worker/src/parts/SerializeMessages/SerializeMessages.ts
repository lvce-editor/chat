import type { Message } from '../Message/Message.ts'
import type { MessageContent } from '../MessageContent/MessageContent.ts'

const serializeContent = (content: MessageContent) => {
  switch (content.type) {
    case 'image': {
      return {
        type: content.type,
        mediaType: content.mediaType,
        fileName: content.file.name,
      }
    }
    case 'code':
    case 'text':
    default:
      return content
  }
}

const serializeMessage = (message: Message) => {
  return {
    role: message.role,
    content: message.content.map(serializeContent),
  }
}

export const serializeMessages = (messages: readonly Message[]): readonly any[] => {
  return messages.map(serializeMessage)
}
