import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleNewChat = async (id: number) => {
  await WebViewStates.update(id, (webView) => ({
    ...webView,
    messages: [],
    currentInput: '',
    images: [],
    previewImageUrl: '',
  }))
}
