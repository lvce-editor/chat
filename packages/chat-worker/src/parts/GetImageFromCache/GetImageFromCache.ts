export const getImageFromCache = async (cacheName: string, cacheBaseUrl: string, fileName: string) => {
  try {
    const cache = await caches.open(cacheName)
    const url = `${cacheBaseUrl}/${fileName}`
    const response = await cache.match(url)
    return response
  } catch {
    return undefined
  }
}
