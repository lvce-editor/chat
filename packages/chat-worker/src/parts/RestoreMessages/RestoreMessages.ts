import type { Message } from '../Message/Message.ts'
import { emptyMessage } from '../EmptyMessage/EmptyMessage.ts'
import * as GetImageFromCache from '../GetImageFromCache/GetImageFromCache.ts'

const restoreContent = async (id: number, cacheName: string, cacheBaseUrl: string, savedContent: any) => {
  if (savedContent.type === 'image') {
    const image = await GetImageFromCache.getImageFromCache(cacheName, cacheBaseUrl, savedContent.fileName)
    if (!image) {
      return savedContent
    }
    const blob = await image.blob()
    return {
      ...savedContent,
      file: blob,
    }
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
