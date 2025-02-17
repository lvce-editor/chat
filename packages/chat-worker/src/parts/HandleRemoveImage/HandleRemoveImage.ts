import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleRemoveImage = async (id: number) => {
  await WebViewStates.update(id, (webView) => ({
    ...webView,
    images: [],
    previewImageUrl: '',
  }))
}
