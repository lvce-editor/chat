import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import { id } from '../Id/Id.ts'

export const handleNewChat = async () => {
  const webView = WebViewStates.get(id)
  webView.messages = []
  await webView.port.invoke('clearMessages')
}
