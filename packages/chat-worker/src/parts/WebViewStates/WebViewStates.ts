import type { WebView } from '../WebView/WebView.ts'
import { render } from '../Render/Render.ts'

const webViews = Object.create(null)

export const get = (id: number): WebView => {
  return webViews[id]
}

export const set = (id: number, webView: WebView) => {
  webViews[id] = webView
}

export const update = async (id: number, newWebView: Partial<WebView>) => {
  const oldWebView = get(id)
  const updatedWebView = {
    ...oldWebView,
    ...newWebView,
  }
  set(id, updatedWebView)

  // Re-render entire UI
  const vdom = await render(updatedWebView)
  await updatedWebView.port.invoke('render', vdom)
}
