import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleScroll = async (id: number, scrollOffset: number) => {
  const webView = WebViewStates.get(id)
  // @ts-ignore
  webView.scrollOffset = scrollOffset
}
