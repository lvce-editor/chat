import type { ImageContent } from '../MessageTypes/MessageTypes.ts'
import * as GetImageFromCache from '../GetImageFromCache/GetImageFromCache.ts'

export const restoreImage = async (
  id: number,
  cacheName: string,
  cacheBaseUrl: string,
  savedContent: any,
): Promise<ImageContent> => {
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
