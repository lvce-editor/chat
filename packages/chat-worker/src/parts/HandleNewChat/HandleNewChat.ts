import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import { id } from '../Id/Id.ts'

export const handleNewChat = async () => {
  const webView = WebViewStates.get(id)
  if (webView.messages.length === 0) {
    return
  }
  // @ts-ignore
  webView.messages = []
  await webView.port.invoke('clearMessages')
}
