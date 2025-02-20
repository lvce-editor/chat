import type { WebView } from '../WebView/WebView.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const diff = (a: WebView, b: WebView): readonly number[] => {
  const diffs: number[] = []
  if (a.messages !== b.messages || a.images !== b.images || a.previewImageUrl !== b.previewImageUrl) {
    diffs.push(DiffType.Dom)
  }
  if (b.inputSource === InputSource.Script && a.currentInput !== b.currentInput) {
    diffs.push(DiffType.InputValue)
  }
  if (b.inputSource === InputSource.Script && b.focused) {
    diffs.push(DiffType.Focus)
  }
  return diffs
}
