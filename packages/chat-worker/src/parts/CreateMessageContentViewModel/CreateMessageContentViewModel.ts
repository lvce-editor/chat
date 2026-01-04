import type {
  ImageMessageContent,
  MessageContent,
  TextMessageContent,
  ToolResultMessageContent,
  ToolUseMessageContent,
} from '../MessageContent/MessageContent.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import * as IsFile from '../IsFile/IsFile.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as Tokenize from '../Tokenize/Tokenize.ts'

const createMessageContentImageViewModel = async (
  part: ImageMessageContent,
  webView: any,
): Promise<readonly MessageBlockViewModel[]> => {
  if (!IsFile.isFile(part.file)) {
    return [
      {
        content: '',
        display: {
          blobUrl: '#',
        },
        type: MessageContentType.Image,
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
      content: '',
      display: {
        blobUrl,
      },
      type: MessageContentType.Image,
    },
  ]
}

const formatBlock = (block: FormatMessage.FormattedContentInternal): MessageBlockViewModel => {
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

const createMessageContentToolResultViewModel = (part: ToolResultMessageContent): readonly MessageBlockViewModel[] => {
  return [
    {
      content: `(tool-result) ${part.tool_use_name}`,
      display: {},
      type: MessageContentType.Text,
    },
  ]
}

const createMessageContentToolUseViewModel = (part: ToolUseMessageContent): readonly MessageBlockViewModel[] => {
  return [
    {
      content: `(tool-use) ${part.tool_use_name}`,
      display: {},
      type: MessageContentType.Text,
    },
  ]
}

const createMessageContentTextViewModel = async (part: TextMessageContent): Promise<readonly MessageBlockViewModel[]> => {
  const formattedBlocks = FormatMessage.formatMessage(part.content)
  return formattedBlocks.map(formatBlock)
}

export const createMessageContentViewModel = async (
  part: MessageContent,
  webView: any,
): Promise<readonly MessageBlockViewModel[]> => {
  if (part.type === MessageContentType.Image) {
    return createMessageContentImageViewModel(part, webView)
  }
  if (part.type === MessageContentType.ToolResult) {
    return createMessageContentToolResultViewModel(part)
  }
  if (part.type === MessageContentType.ToolUse) {
    return createMessageContentToolUseViewModel(part)
  }
  return createMessageContentTextViewModel(part)
}
