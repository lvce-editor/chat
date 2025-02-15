import type { Message } from '../Message/Message.ts'
import * as RestoreMessage from '../RestoreMessage/RestoreMessage.ts'

export const restoreMessages = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedState: any,
): Promise<readonly Message[]> => {
  const baseMessages = savedState?.messages || []
  const restored1 = await Promise.all(
    baseMessages.map((baseMessage) => {
      return RestoreMessage.restoreMessage(id, cacheName, cacheBaseUrl, baseMessage)
    }),
  )
  return restored1
}
