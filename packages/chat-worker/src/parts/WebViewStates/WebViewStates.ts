import * as Diff from '../Diff/Diff.ts'
import * as GetRenderCommands from '../GetRenderCommands/GetRenderCommands.ts'
import type { WebView } from '../WebView/WebView.ts'

const webViews = Object.create(null)

export const get = (id: number): WebView => {
  return webViews[id]
}

export const set = (id: number, webView: WebView) => {
  webViews[id] = webView
}

export const update = async (id: number, newWebView: Partial<WebView>) => {
  const oldWebView = get(id)
  const updatedWebView: WebView = {
    ...oldWebView,
    ...newWebView,
  }
  set(id, updatedWebView)

  const diffs = Diff.diff(oldWebView, updatedWebView)

  console.log({ diffs })
  if (diffs.length === 0) {
    return
  }

  const commands = await GetRenderCommands.getRenderCommands(oldWebView, updatedWebView, diffs)

  console.log({ commands })
  for (const item of commands) {
    if (item.length === 0) {
      continue
    }
    await updatedWebView.port.invoke(...item)
  }
}
