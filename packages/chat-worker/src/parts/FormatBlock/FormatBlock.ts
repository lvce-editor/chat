import type * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as Tokenize from '../Tokenize/Tokenize.ts'

export const formatBlock = (block: FormatMessage.FormattedContentInternal): MessageBlockViewModel => {
  switch (block.type) {
    case MessageContentType.Code:
      return {
        type: MessageContentType.Code,
        content: block.content,
        display: {
          language: block.language,
          tokens: Tokenize.tokenize(block.content, block.language),
        },
      }
    case MessageContentType.List:
      return {
        type: MessageContentType.List,
        content: '',
        items: block.items,
        ordered: block.ordered,
        display: {},
      }
    default:
      return {
        type: MessageContentType.Text,
        content: block.content,
        display: {},
      }
  }
}
