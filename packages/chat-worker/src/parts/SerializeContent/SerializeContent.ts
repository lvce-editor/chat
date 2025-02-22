import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const serializeContent = (content: MessageContent): SavedContent => {
  switch (content.type) {
    case MessageContentType.Image: {
      return {
        type: MessageContentType.Image,
        mediaType: content.mediaType,
        fileName: content.fileName,
      }
    }
    case MessageContentType.Code:
      return {
        type: MessageContentType.Code,
        content: content.content,
        language: content.language || '',
      }
    case MessageContentType.List: {
      return {
        type: MessageContentType.Code,
        content: '',
        language: '',
      }
    }
    default:
      return content
  }
}
