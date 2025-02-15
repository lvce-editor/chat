import type { WebView } from '../WebView/WebView.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleImageUpload = async (id: number, file: File | undefined) => {
  const webView = WebViewStates.get(id)
  if (!file) {
    return
  }
  const blobUrl = await webView.port.invoke('createObjectUrl', file)
  const formContent = createFormContent(blobUrl)
  await webView.port.invoke('updateForm', formContent)
  const newState: WebView = {
    ...webView,
    images: [...webView.images, file],
  }
  WebViewStates.set(id, newState)
}
