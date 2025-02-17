import type { WebView } from '../WebView/WebView.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as Render from '../Render/Render.ts'
import * as RestoreMessages from '../RestoreMessages/RestoreMessages.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = async ({ port, savedState, webViewId, uri, id }) => {
  const apiKey = await globalThis.rpc.invoke('WebView.getSecret', 'secrets.claude')
  const modelId = (await globalThis.rpc.invoke('WebView.getSecret', 'claude.modelId')) || 'claude-3-5-haiku-20241022'

  // TODO make these configurable
  const url = 'https://api.anthropic.com/v1/messages'
  const anthropicVersion = '2023-06-01'
  const maxTokens = 1024
  const cacheName = 'chat-image-cache'
  const cacheBaseUrl = 'https://example.com'

  const restoredMessages = await RestoreMessages.restoreMessages(id, cacheName, cacheBaseUrl, savedState)

  const webView: WebView = {
    time: 0,
    port,
    apiKey,
    modelId,
    url,
    anthropicVersion,
    stream: true,
    maxTokens,
    messages: restoredMessages,
    scrollOffset: savedState?.scrollOffset || 0,
    images: [],
    cacheName,
    cacheBaseUrl,
    currentInput: '',
    isScrolledToBottom: false,
    previewImageUrl: '',
    inputSource: InputSource.Script,
  }
  WebViewStates.set(id, webView)

  const newWebView: Partial<WebView> = {
    messages: restoredMessages,
    scrollOffset: savedState?.scrollOffset || 0,
    inputSource: InputSource.Script,
    currentInput: savedState.currentInput || '',
  }

  await WebViewStates.update(id, newWebView)

  const initialDom = await Render.render(webView)
  await port.invoke('initialize', initialDom)

  if (!apiKey) {
    await port.invoke('setError', 'Missing Api Key')
  }

  // Only restore scroll position if there were saved messages
  if (webView.messages.length > 0 && webView.scrollOffset) {
    await port.invoke('setScrollPosition', webView.scrollOffset)
  }

  return {}
}
