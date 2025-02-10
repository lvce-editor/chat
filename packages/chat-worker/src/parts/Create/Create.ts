import { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = async ({ port, savedState, webViewId, uri, id }) => {
  const webView: WebView = {
    url: '',
    time: 0,
    port,
  }
  WebViewStates.set(id, webView)
  await port.invoke('initialize')

  return {}
}
