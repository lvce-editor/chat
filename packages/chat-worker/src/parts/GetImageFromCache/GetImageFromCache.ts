import * as GetCachePath from '../GetCachePath/GetCachePath.ts'

export const getImageFromCache = async (
  cacheName: string,
  cacheBaseUrl: string,
  fileName: string,
): Promise<Response | undefined> => {
  try {
    const cache = await caches.open(cacheName)
    const url = GetCachePath.getCachePath(cacheBaseUrl, fileName)
    const response = await cache.match(url)
    return response
  } catch (error) {
    console.error(`Error getting image from cache: ${error}`)
    return undefined
  }
}
