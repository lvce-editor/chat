import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedContent } from '../SavedMessage/SavedMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as SerializeCodeContent from '../SerializeCodeContent/SerializeCodeContent.ts'
import * as SerializeImageContent from '../SerializeImageContent/SerializeImageContent.ts'
import * as SerializeListContent from '../SerializeListContent/SerializeListContent.ts'
import * as SerializeTextContent from '../SerializeTextContent/SerializeTextContent.ts'

export const serializeContent = (content: MessageContent): SavedContent => {
  switch (content.type) {
    case MessageContentType.Image:
      return SerializeImageContent.serializeImageContent(content)
    case MessageContentType.Code:
      return SerializeCodeContent.serializeCodeContent(content)
    case MessageContentType.Text:
      return SerializeTextContent.serializeTextContent(content)
    case MessageContentType.List:
      return SerializeListContent.serializeListContent(content)
    default:
      return content as any
  }
}
