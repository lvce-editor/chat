import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { MessageBlockViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as IsFile from '../IsFile/IsFile.ts'

export const createMessageContentViewModel = async (part: MessageContent, webView: any): Promise<MessageBlockViewModel> => {
  if (part.type === 'image') {
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
  if (part.type === 'code') {
    return {
      type: 'code',
      content: part.content,
      display: {
        language: part.language,
      },
    }
  }
  return {
    type: 'text',
    content: part.content,
    display: {},
  }
}
