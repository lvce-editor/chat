import type { Message } from '../Message/Message.ts'
import type { MessageContent } from '../MessageContent/MessageContent.ts'
import { emptyMessage } from '../EmptyMessage/EmptyMessage.ts'
import * as RestoreImage from '../RestoreImage/RestoreImage.ts'

const restoreContent = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedContent: any,
): Promise<MessageContent> => {
  if (savedContent.type === 'image') {
    return RestoreImage.restoreImage(id, cacheName, cacheBaseUrl, savedContent)
  }
  return savedContent
}

export const restoreMessage = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedMessage: any,
): Promise<Message> => {
  if (!savedMessage) {
    return emptyMessage
  }
  if (!savedMessage.content) {
    return emptyMessage
  }
  if (!Array.isArray(savedMessage.content)) {
    return emptyMessage
  }
  return {
    ...savedMessage,
    webViewId: id,
    content: await Promise.all(
      savedMessage.content.map((content) => {
        return restoreContent(id, cacheName, cacheBaseUrl, content)
      }),
    ),
  }
}
