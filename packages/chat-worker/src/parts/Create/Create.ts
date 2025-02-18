import type { Message } from '../Message/Message.ts'
import type { WebView } from '../WebView/WebView.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as RestoreMessages from '../RestoreMessages/RestoreMessages.ts'
import * as Update from '../Update/Update.ts'
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

  const webView: WebView = {
    time: 0,
    port,
    apiKey,
    modelId,
    url,
    anthropicVersion,
    stream: true,
    maxTokens,
    messages: [],
    scrollOffset: 0,
    images: [],
    cacheName,
    cacheBaseUrl,
    currentInput: '',
    isScrolledToBottom: false,
    previewImageUrl: '',
    inputSource: InputSource.Script,
  }
  WebViewStates.set(id, webView)

  const restoredMessages = await RestoreMessages.restoreMessages(id, cacheName, cacheBaseUrl, savedState)

  const newWebView: Partial<WebView> = {
    messages: restoredMessages,
    scrollOffset: savedState?.scrollOffset || 0,
    inputSource: InputSource.Script,
    currentInput: savedState?.currentInput || '',
  }

  await Update.update(id, newWebView)

  if (!apiKey) {
    const errorMessage: Message = {
      role: MessageRole.Ai,
      content: [
        {
          type: MessageContentType.Text,
          content: `Error: ${ErrorCodes.E_MISSING_API_KEY}: Missing API Key`,
        },
      ],
      webViewId: id,
    }
    await Update.update(id, {
      messages: [...restoredMessages, errorMessage],
    })
  }

  // Only restore scroll position if there were saved messages
  if (webView.messages.length > 0 && webView.scrollOffset) {
    await port.invoke('setScrollPosition', webView.scrollOffset)
  }

  return {}
}
