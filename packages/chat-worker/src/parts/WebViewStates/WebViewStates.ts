import type { WebView } from '../WebView/WebView.ts'
import { render } from '../Render/Render.ts'

const webViews = Object.create(null)

export const get = (id: number): WebView => {
  return webViews[id]
}

export const set = (id: number, webView: WebView) => {
  webViews[id] = webView
}

export const update = async (id: number, updater: (webView: WebView) => WebView) => {
  const oldWebView = get(id)
  const newWebView = updater(oldWebView)
  set(id, newWebView)

  // Re-render entire UI
  const vdom = await render(newWebView)
  await newWebView.port.invoke('render', vdom)
}
