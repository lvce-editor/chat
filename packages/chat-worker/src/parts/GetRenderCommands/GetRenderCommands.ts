import type { WebView } from '../WebView/WebView.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as Render from '../Render/Render.ts'

const getRenderCommandsDom = async (oldWebView: WebView, newWebView: WebView): Promise<readonly any[]> => {
  const newVdom = await Render.render(newWebView)
  return ['render', newVdom]
}

const getRenderCommandsValue = (oldWebView: WebView, newWebView: WebView): readonly any[] => {
  if (newWebView.inputSource === InputSource.User || oldWebView.currentInput === newWebView.currentInput) {
    return []
  }
  return ['setValue', 'Input', newWebView.currentInput]
}

const getRenderCommandsFocus = (oldWebView: WebView, newWebView: WebView): readonly any[] => {
  if (newWebView.inputSource === InputSource.User || !newWebView.focused) {
    return []
  }
  return ['focusInput']
}

export const getRenderCommands = async (
  oldWebView: WebView,
  newWebView: WebView,
  diffs: readonly number[],
): Promise<readonly any[]> => {
  const renderCommands: any[] = []
  for (const diff of diffs) {
    switch (diff) {
      case DiffType.Dom:
        renderCommands.push(await getRenderCommandsDom(oldWebView, newWebView))
        break
      case DiffType.InputValue:
        renderCommands.push(getRenderCommandsValue(oldWebView, newWebView))
        break
      case DiffType.Focus:
        renderCommands.push(getRenderCommandsFocus(oldWebView, newWebView))
        break
      default:
        break
    }
  }
  return renderCommands
}
