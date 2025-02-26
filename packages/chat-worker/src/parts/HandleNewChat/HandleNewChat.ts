import * as InputSource from '../InputSource/InputSource.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleNewChat = async (id: number) => {
  const webView = WebViewStates.get(id)

  // TODO maybe can revoke url directly after image has been displayed
  // Cleanup old URLs
  for (const url of webView.imageUrlCache.values()) {
    await webView.port.invoke('revokeObjectUrl', url)
  }

  await Update.update(id, {
    messages: [],
    currentInput: '',
    images: [],
    imageUrlCache: new Map(),
    previewImageUrl: '',
    focused: true,
    inputSource: InputSource.Script,
  })
}
