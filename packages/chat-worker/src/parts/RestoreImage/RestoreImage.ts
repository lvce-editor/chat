import * as GetImageFromCache from '../GetImageFromCache/GetImageFromCache.ts'
import type { ImageMessageContent } from '../MessageContent/MessageContent.ts'
import * as ResponseToFile from '../ResponseToFile/ResponseToFile.ts'

export const restoreImage = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedContent: any,
): Promise<ImageMessageContent> => {
  if (savedContent.type === 'image') {
    const image = await GetImageFromCache.getImageFromCache(cacheName, cacheBaseUrl, savedContent.fileName)
    if (!image) {
      return savedContent
    }
    const file = await ResponseToFile.responseToFile(image, savedContent.fileName, savedContent.mediaType)
    return {
      ...savedContent,
      file,
    }
  }
  return savedContent
}
