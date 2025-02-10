import { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = async ({ port, savedState, webViewId, uri, id }) => {
  const apiKey = await globalThis.rpc.invoke('WebView.getSecret', 'secrets.claude')

  // TODO make these configurable
  const modelId = 'claude-3-5-haiku-20241022'
  const url = 'https://api.anthropic.com/v1/messages'
  const anthropicVersion = '2023-06-01'

  const webView: WebView = {
    time: 0,
    port,
    apiKey,
    modelId,
    url,
    anthropicVersion,
  }
  WebViewStates.set(id, webView)
  await port.invoke('initialize')

  if (!apiKey) {
    await port.invoke('setError', 'Missing Api Key')
  }

  return {}
}
