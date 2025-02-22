import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as SerializeImageContent from '../SerializeImageContent/SerializeImageContent.ts'
import * as SerializeTextContent from '../SerializeTextContent/SerializeTextContent.ts'

export const serializeContent = (content: MessageContent): SavedContent => {
  switch (content.type) {
    case MessageContentType.Image:
      return SerializeImageContent.serializeImageContent(content)
    case MessageContentType.Text:
      return SerializeTextContent.serializeTextContent(content)
    default:
      return content as any
  }
}
