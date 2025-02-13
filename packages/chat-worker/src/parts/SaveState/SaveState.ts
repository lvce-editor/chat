import type { SavedState } from '../SavedState/SavedState.ts'
import { id } from '../Id/Id.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const saveState = (): SavedState => {
  const webView = WebViewStates.get(id)
  return {
    messages: webView.messages,
    scrollOffset: webView.scrollOffset,
  }
}
