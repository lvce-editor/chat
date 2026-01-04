import type { Message } from '../Message/Message.ts'
import { emptyMessage } from '../EmptyMessage/EmptyMessage.ts'
import * as RestoreContent from '../RestoreContent/RestoreContent.ts'

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
    content: await Promise.all(
      savedMessage.content.map((content) => {
        return RestoreContent.restoreContent(id, cacheName, cacheBaseUrl, content)
      }),
    ),
    webViewId: id,
  }
}
