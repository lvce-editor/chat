import type { ImageMessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const serializeImageContent = (content: ImageMessageContent): SavedContent => {
  return {
    fileName: content.fileName,
    mediaType: content.mediaType,
    type: MessageContentType.Image,
  }
}
