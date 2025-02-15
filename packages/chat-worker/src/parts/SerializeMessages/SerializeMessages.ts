import type { Message } from '../Message/Message.ts'
import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent, SavedMessage } from '../SavedMessage/SavedMessage.ts'

const serializeContent = (content: MessageContent): SavedContent => {
  switch (content.type) {
    case 'image': {
      return {
        type: content.type,
        mediaType: content.mediaType,
        fileName: content.fileName,
      }
    }
    case 'code':
      return {
        type: content.type,
        content: content.content,
        language: content.language || '',
      }
    case 'text':
    default:
      return content
  }
}

const serializeMessage = (message: Message): SavedMessage => {
  return {
    role: message.role,
    content: message.content.map(serializeContent),
  }
}

export const serializeMessages = (messages: readonly Message[]): readonly SavedMessage[] => {
  return messages.map(serializeMessage)
}
