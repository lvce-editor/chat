import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'

export const serializeContent = (content: MessageContent): SavedContent => {
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
    default:
      return content
  }
}
