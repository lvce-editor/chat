import type { Message } from '../Message/Message.ts'
import { emptyMessage } from '../EmptyMessage/EmptyMessage.ts'
import * as RestoreImage from '../RestoreImage/RestoreImage.ts'

const restoreContent = async (id: number, cacheName: string, cacheBaseUrl: string, savedContent: any) => {
  if (savedContent.type === 'image') {
    return RestoreImage.restoreImage(id, cacheName, cacheBaseUrl, savedContent)
  }
  return savedContent
}

const restoreMessage = async (id: number, cacheName: string, cacheBaseUrl: string, savedMessage: any): Promise<Message> => {
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

export const restoreMessages = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedState: any,
): Promise<readonly Message[]> => {
  const baseMessages = savedState?.messages || []
  const restored1 = await Promise.all(
    baseMessages.map((baseMessage) => {
      return restoreMessage(id, cacheName, cacheBaseUrl, baseMessage)
    }),
  )
  return restored1
}
