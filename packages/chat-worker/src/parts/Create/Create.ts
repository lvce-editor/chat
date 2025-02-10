import { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = async ({ port, savedState, webViewId, uri, id }) => {
  const apiKey = await globalThis.rpc.invoke('WebView.getSecret', 'secrets.claude')

  const webView: WebView = {
    url: '',
    time: 0,
    port,
    apiKey,
  }
  WebViewStates.set(id, webView)
  await port.invoke('initialize')

  if (!apiKey) {
    await port.invoke('setError', 'Missing Api Key')
  }

  return {}
}
