import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as RestoreImage from '../RestoreImage/RestoreImage.ts'

export const restoreContent = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedContent: any,
): Promise<MessageContent> => {
  if (savedContent.type === MessageContentType.Image) {
    return RestoreImage.restoreImage(id, cacheName, cacheBaseUrl, savedContent)
  }
  return savedContent
}
