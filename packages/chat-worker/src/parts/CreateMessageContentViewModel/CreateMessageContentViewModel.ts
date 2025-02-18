import type {
  CodeMessageContent,
  ImageMessageContent,
  MessageContent,
  TextMessageContent,
} from '../MessageContent/MessageContent.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as IsFile from '../IsFile/IsFile.ts'

const createMessageContentImageViewModel = async (part: ImageMessageContent, webView: any): Promise<MessageBlockViewModel> => {
  if (!IsFile.isFile(part.file)) {
    return {
      type: 'image',
      content: '',
      display: {
        blobUrl: '#',
      },
    }
  }
  const blobUrl = await webView.port.invoke('createObjectUrl', part.file)
  return {
    type: 'image',
    content: '',
    display: {
      blobUrl,
    },
  }
}

const createMessageContentCodeViewModel = (part: CodeMessageContent): MessageBlockViewModel => {
  return {
    type: 'code',
    content: part.content,
    display: {
      language: part.language,
    },
  }
}

const createMessageContentTextViewModel = (part: TextMessageContent): MessageBlockViewModel => {
  return {
    type: 'text',
    content: part.content,
    display: {},
  }
}

export const createMessageContentViewModel = async (part: MessageContent, webView: any): Promise<MessageBlockViewModel> => {
  if (part.type === 'image') {
    return createMessageContentImageViewModel(part, webView)
  }
  if (part.type === 'code') {
    return createMessageContentCodeViewModel(part)
  }
  return createMessageContentTextViewModel(part)
}
