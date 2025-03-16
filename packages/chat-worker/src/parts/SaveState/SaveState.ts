import type { SavedState } from '../SavedState/SavedState.ts'
import * as Id from '../Id/Id.ts'
import { serializeMessages } from '../SerializeMessages/SerializeMessages.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const saveState = (id: number): SavedState => {
  const actualId = id || Id.id
  const webView = WebViewStates.get(actualId)
  const { messages, scrollOffset, currentInput, focused, inputSource } = webView
  return {
    messages: serializeMessages(messages),
    scrollOffset,
    currentInput,
    focused,
    inputSource,
  }
}
