import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleInput = async (id: number, input: string): Promise<void> => {
  await WebViewStates.update(id, (webView) => ({
    ...webView,
    currentInput: input,
  }))
}
