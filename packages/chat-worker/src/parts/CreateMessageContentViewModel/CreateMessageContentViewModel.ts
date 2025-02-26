import type { ImageMessageContent, MessageContent, TextMessageContent } from '../MessageContent/MessageContent.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import * as IsFile from '../IsFile/IsFile.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as Tokenize from '../Tokenize/Tokenize.ts'

const createMessageContentImageViewModel = async (part: ImageMessageContent, webView: any): Promise<MessageBlockViewModel[]> => {
  if (!IsFile.isFile(part.file)) {
    return [
      {
        type: MessageContentType.Image,
        content: '',
        display: {
          blobUrl: '#',
        },
      },
    ]
  }

  // TODO avoid mutation
  // Generate a cache key from the file
  const cacheKey = `${part.fileName}-${part.file.size}-${part.file.lastModified}`

  // Check cache first
  let blobUrl = webView.imageUrlCache.get(cacheKey)

  if (!blobUrl) {
    blobUrl = await webView.port.invoke('createObjectUrl', part.file)
    webView.imageUrlCache.set(cacheKey, blobUrl)
  }

  return [
    {
      type: MessageContentType.Image,
      content: '',
      display: {
        blobUrl,
      },
    },
  ]
}

const formatBlock = (block: FormatMessage.FormattedContentInternal): MessageBlockViewModel => {
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

const createMessageContentTextViewModel = async (part: TextMessageContent): Promise<MessageBlockViewModel[]> => {
  const formattedBlocks = FormatMessage.formatMessage(part.content)
  return formattedBlocks.map(formatBlock)
}

export const createMessageContentViewModel = async (part: MessageContent, webView: any): Promise<MessageBlockViewModel[]> => {
  if (part.type === MessageContentType.Image) {
    return createMessageContentImageViewModel(part, webView)
  }
  return createMessageContentTextViewModel(part)
}
