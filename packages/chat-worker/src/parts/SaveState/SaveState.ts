import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import { id } from '../Id/Id.ts'

export const saveState = () => {
  const webView = WebViewStates.get(id)
  return {
    messages: webView.messages,
  }
}
