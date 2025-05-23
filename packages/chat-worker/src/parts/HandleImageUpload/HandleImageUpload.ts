import * as SaveImageInCache from '../SaveImageInCache/SaveImageInCache.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleImageUpload = async (id: number, fileList: FileList) => {
  if (!fileList) {
    return
  }
  const file = fileList.item(0)
  if (!file) {
    return
  }

  const webView = WebViewStates.get(id)
  await SaveImageInCache.saveImageInCache(webView.cacheName, webView.cacheBaseUrl, file)
  const blobUrl = await webView.port.invoke('createObjectUrl', file)

  await Update.update(id, {
    images: [...webView.images, file],
    previewImageUrl: blobUrl,
  })
}
