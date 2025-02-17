import type { WebView } from '../WebView/WebView.ts'
import * as DeepEqual from '../DeepEqual/DeepEqual.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as Render from '../Render/Render.ts'

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

  // Update input value if source is script
  if (updatedWebView.inputSource === InputSource.Script && oldWebView.currentInput !== newWebView.currentInput) {
    await updatedWebView.port.invoke('setValue', 'Input', updatedWebView.currentInput)
  }

  // Render new VDOM
  const newVdom = await Render.render(updatedWebView)
  const oldVdom = await Render.render(oldWebView)

  // Skip render if vdom hasn't changed
  if (DeepEqual.deepEqual(oldVdom, newVdom)) {
    return
  }

  await updatedWebView.port.invoke('render', newVdom)
}
