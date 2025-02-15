// save image in cache for restoring image on reload
export const saveImageInCache = async (cacheName: string, cacheBaseUrl: string, file: File) => {
  try {
    const res = new Response(file, {
      headers: {
        'content-type': 'image/png',
      },
    })
    const cache = await caches.open(cacheName)
    const url = `${cacheBaseUrl}/${file.name}`
    await cache.put(url, res)
  } catch (error) {
    console.error(`Failed to save image in cache: ${error}`)
  }
}
