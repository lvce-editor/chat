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
}
