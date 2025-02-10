import { WebView } from '../WebView/WebView.ts'

const webViews = Object.create(null)

export const get = (id: number): WebView => {
  return webViews[id]
}

export const set = (id: number, webView: WebView) => {
  webViews[id] = webView
}
