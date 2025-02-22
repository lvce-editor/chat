import type { ImageMessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const serializeImageContent = (content: ImageMessageContent): SavedContent => {
  return {
    type: MessageContentType.Image,
    mediaType: content.mediaType,
    fileName: content.fileName,
  }
}
