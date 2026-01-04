import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleScroll = async (id: number, scrollOffset: number) => {
  const webView = WebViewStates.get(id)
  const isScrolledToBottom = await webView.port.invoke('checkIsBottom')

  await Update.update(id, {
    isScrolledToBottom,
    scrollOffset,
  })
}
