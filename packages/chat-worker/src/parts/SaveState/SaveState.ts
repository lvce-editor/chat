import type { SavedState } from '../SavedState/SavedState.ts'
import { id } from '../Id/Id.ts'
import { serializeMessages } from '../SerializeMessages/SerializeMessages.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const saveState = (): SavedState => {
  const webView = WebViewStates.get(id)
  const { messages, scrollOffset, currentInput, focused, inputSource } = webView
  return {
    messages: serializeMessages(messages),
    scrollOffset,
    currentInput,
    focused,
    inputSource,
  }
}
