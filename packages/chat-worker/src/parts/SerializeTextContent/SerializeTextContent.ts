import type { TextMessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const serializeTextContent = (content: TextMessageContent): SavedContent => {
  return {
    content: content.content,
    type: MessageContentType.Text,
  }
}
