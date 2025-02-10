import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = (id, input) => {
  const webView = WebViewStates.get(id)
  console.log({ webView, input })
  return undefined
}
