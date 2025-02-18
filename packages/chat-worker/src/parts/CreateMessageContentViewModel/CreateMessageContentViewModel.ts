import type {
  CodeMessageContent,
  ImageMessageContent,
  MessageContent,
  TextMessageContent,
} from '../MessageContent/MessageContent.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as IsFile from '../IsFile/IsFile.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as Tokenize from '../Tokenize/Tokenize.ts'

const createMessageContentImageViewModel = async (part: ImageMessageContent, webView: any): Promise<MessageBlockViewModel> => {
  if (!IsFile.isFile(part.file)) {
    return {
      type: MessageContentType.Image,
      content: '',
      display: {
        blobUrl: '#',
      },
    }
  }
  const blobUrl = await webView.port.invoke('createObjectUrl', part.file)
  return {
    type: MessageContentType.Image,
    content: '',
    display: {
      blobUrl,
    },
  }
}

const createMessageContentCodeViewModel = (part: CodeMessageContent): MessageBlockViewModel => {
  const tokens = Tokenize.tokenize(part.content, part.language || 'text')
  return {
    type: MessageContentType.Code,
    content: part.content,
    display: {
      language: part.language,
      tokens,
    },
  }
}

const createMessageContentTextViewModel = (part: TextMessageContent): MessageBlockViewModel => {
  return {
    type: MessageContentType.Text,
    content: part.content,
    display: {},
  }
}

export const createMessageContentViewModel = async (part: MessageContent, webView: any): Promise<MessageBlockViewModel> => {
  if (part.type === MessageContentType.Image) {
    return createMessageContentImageViewModel(part, webView)
  }
  if (part.type === MessageContentType.Code) {
    return createMessageContentCodeViewModel(part)
  }
  return createMessageContentTextViewModel(part)
}
