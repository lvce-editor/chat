import { FormattedContentInternal } from '../FormattedContentInternal/FormattedContentInternal.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as Tokenize from '../Tokenize/Tokenize.ts'

export const formatBlock = (block: FormattedContentInternal): MessageBlockViewModel => {
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
    case MessageContentType.InlineCode:
      return {
        type: MessageContentType.InlineCode,
        content: block.text,
        display: {},
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
