import type { Message } from '../Message/Message.ts'
import * as GetImageFromCache from '../GetImageFromCache/GetImageFromCache.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const restoreContent = async (id: number, savedContent: any) => {
  if (savedContent.type === 'image') {
    const webView = WebViewStates.get(id)
    const image = await GetImageFromCache.getImageFromCache(webView.cacheName, webView.cacheBaseUrl, savedContent.fileName)
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

const emptyMessage: Message = {
  role: 'human',
  webViewId: 0,
  content: [],
}

const restoreMessage = async (id: number, savedMessage: any) => {
  if (!savedMessage) {
    return emptyMessage
  }
  if (!savedMessage.type) {
    return emptyMessage
  }
  if (savedMessage.content) {
    return emptyMessage
  }
  return {
    ...savedMessage,
    webViewId: id,
    content: await Promise.all(
      savedMessage.content.map((content) => {
        return restoreContent(id, content)
      }),
    ),
  }
}

export const restoreMessages = async (id: number, savedState: any): Promise<readonly Message[]> => {
  const baseMessages = savedState.messages || []
  const restored1 = await Promise.all(
    baseMessages.map((baseMessage) => {
      return restoreMessage(id, baseMessage)
    }),
  )
  return restored1
}
