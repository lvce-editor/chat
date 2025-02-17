import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleScroll = async (id: number, scrollOffset: number) => {
  await WebViewStates.update(id, (webView) => ({
    ...webView,
    scrollOffset,
    isScrolledToBottom: scrollOffset >= document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }))
}
