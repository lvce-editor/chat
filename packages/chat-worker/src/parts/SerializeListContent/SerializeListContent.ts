import type { ListMessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const serializeListContent = (content: ListMessageContent): SavedContent => {
  return {
    // @ts-ignore
    type: MessageContentType.List,
    items: content.items,
  }
}
