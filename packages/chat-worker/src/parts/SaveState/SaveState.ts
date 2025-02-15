import type { Message } from '../Message/Message.ts'
import type { MessageContent } from '../MessageContent/MessageContent.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import { id } from '../Id/Id.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const serializeContent = (content: MessageContent) => {
  switch (content.type) {
    case 'image': {
      return {
        type: content.type,
        mediaType: content.mediaType,
        fileName: content.file.name,
      }
    }
    case 'code':
    case 'text':
    default:
      return content
  }
}

const serializeMessage = (message: Message) => {
  return {
    role: message.role,
    content: message.content.map(serializeContent),
  }
}

export const saveState = (): SavedState => {
  const webView = WebViewStates.get(id)
  return {
    messages: webView.messages.map(serializeMessage),
    scrollOffset: webView.scrollOffset,
  }
}
