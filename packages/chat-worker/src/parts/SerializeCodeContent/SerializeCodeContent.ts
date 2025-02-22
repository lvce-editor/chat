import type { CodeMessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const serializeCodeContent = (content: CodeMessageContent): SavedContent => {
  return {
    type: MessageContentType.Code,
    content: content.content,
    language: content.language || '',
  }
}
