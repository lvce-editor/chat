import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleInput = async (id: number, input: string): Promise<void> => {
  console.log({ input })
  await WebViewStates.update(id, (webView) => ({
    ...webView,
    currentInput: input,
  }))
}
