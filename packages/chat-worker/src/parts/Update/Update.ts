import type { WebView } from '../WebView/WebView.ts'
import * as Diff from '../Diff/Diff.ts'
import * as GetRenderCommands from '../GetRenderCommands/GetRenderCommands.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const update = async (id: number, newWebView: Partial<WebView>) => {
  const oldWebView = WebViewStates.get(id)
  if (!oldWebView) {
    throw new Error(`webview ${id} not found`)
  }
  const updatedWebView: WebView = {
    ...oldWebView,
    ...newWebView,
  }
  WebViewStates.set(id, updatedWebView)

  const diffs = Diff.diff(oldWebView, updatedWebView)

  if (diffs.length === 0) {
    return
  }

  const commands = await GetRenderCommands.getRenderCommands(oldWebView, updatedWebView, diffs)

  for (const item of commands) {
    if (item.length === 0) {
      continue
    }
    await updatedWebView.port.invoke(...item)
  }
}
