import type { Message } from '../Message/Message.ts'
import type { ParsedMessage, ParsedMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const parseMessage = (message: Message): ParsedMessage => {
  const blocks = message.content.flatMap((content): readonly ParsedMessageContent[] => {
    if (content.type === MessageContentType.Image) {
      return [
        {
          file: content.file,
          fileName: content.fileName,
          mediaType: content.mediaType,
          type: MessageContentType.Image,
        },
      ]
    }
    if (content.type === MessageContentType.ToolResult) {
      return []
    }
    if (content.type === MessageContentType.ToolUse) {
      return []
    }
    return FormatMessage.formatMessage(content.content)
  })

  return {
    blocks,
    role: message.role,
    webViewId: message.webViewId,
  }
}
