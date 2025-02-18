import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleEnter = async (id: number): Promise<void> => {
  const webView = WebViewStates.get(id)
  if (!webView.currentInput || !webView.currentInput.trim()) {
    return
  }
  await HandleSubmit.handleSubmit(id)
}
