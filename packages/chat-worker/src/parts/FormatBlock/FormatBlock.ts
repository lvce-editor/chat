import type * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as Tokenize from '../Tokenize/Tokenize.ts'

export const formatBlock = (block: FormatMessage.FormattedContentInternal): MessageBlockViewModel => {
  switch (block.type) {
    case MessageContentType.Code:
      return {
        content: block.content,
        display: {
          language: block.language,
          tokens: Tokenize.tokenize(block.content, block.language),
        },
        type: MessageContentType.Code,
      }
    case MessageContentType.List:
      return {
        content: '',
        display: {},
        items: block.items,
        ordered: block.ordered,
        type: MessageContentType.List,
      }
    default:
      return {
        content: block.content,
        display: {},
        type: MessageContentType.Text,
      }
  }
}
