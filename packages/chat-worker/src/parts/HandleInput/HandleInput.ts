import { id } from '../Id/Id.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleInput = async (input: string) => {
  const webView = WebViewStates.get(id)
  // Store the current input value in the webview state
  // @ts-ignore
  webView.currentInput = input
}
