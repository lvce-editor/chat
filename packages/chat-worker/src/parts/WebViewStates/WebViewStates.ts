import type { WebView } from '../WebView/WebView.ts'
import { render } from '../Render/Render.ts'

const webViews = Object.create(null)

export const get = (id: number): WebView => {
  return webViews[id]
}

export const set = (id: number, webView: WebView) => {
  webViews[id] = webView
}

const deepEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const update = async (id: number, newWebView: Partial<WebView>) => {
  console.log({ newWebView })
  const oldWebView = get(id)
  const updatedWebView = {
    ...oldWebView,
    ...newWebView,
  }
  set(id, updatedWebView)

  // Render new VDOM
  const newVdom = await render(updatedWebView)
  const oldVdom = await render(oldWebView)

  // Skip render if vdom hasn't changed
  if (deepEqual(oldVdom, newVdom)) {
    return
  }

  await updatedWebView.port.invoke('render', newVdom)
}
