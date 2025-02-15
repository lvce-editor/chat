import type { WebView } from '../WebView/WebView.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

// save image in cache for restoring image on reload
const saveImageInCache = async (file: File) => {
  try {
    const res = new Response(file, {
      headers: {
        'content-type': 'image/png',
      },
    })
    const cacheName = 'chat-image-cache'
    const cache = await caches.open(cacheName)
    const url = 'https://example.com/image-1.png'
    await cache.put(url, res)
  } catch {}
}

export const handleImageUpload = async (id: number, file: File | undefined) => {
  const webView = WebViewStates.get(id)
  if (!file) {
    return
  }
  await saveImageInCache(file)
  const blobUrl = await webView.port.invoke('createObjectUrl', file)
  const formContent = createFormContent(blobUrl)
  await webView.port.invoke('updateForm', formContent)
  const newState: WebView = {
    ...webView,
    images: [...webView.images, file],
  }
  WebViewStates.set(id, newState)
}
