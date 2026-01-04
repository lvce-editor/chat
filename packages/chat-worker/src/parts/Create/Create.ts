import type { Message } from '../Message/Message.ts'
import type { WebView } from '../WebView/WebView.ts'
import * as Config from '../Config/Config.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { getTools } from '../GetTools/GetTools.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as RestoreMessages from '../RestoreMessages/RestoreMessages.ts'
import * as SupportedModelIds from '../SupportedModelIds/SupportedModelIds.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

// TODO add caching api for blobs to extension host api
// since electron has difficitulies with cache storage and custom procotols
// the normalized cache api can avoid some issues
export const create = async ({ id, port, savedState, uri, webViewId }) => {
  // @ts-ignore
  const { rpc } = globalThis
  const apiKey = await Config.getApiKey(rpc)
  const modelId = await Config.getModelId(rpc)
  const modelName = await Config.getModelName(modelId)
  if (!SupportedModelIds.supportedModelIds.includes(modelId)) {
    console.warn(`[chat-worker] model id ${modelId} is not officially supported`)
  }
  const url = Config.getUrl()
  const anthropicVersion = Config.getAnthropicVersion()
  const maxTokens = Config.getMaxTokens()
  const cacheName = Config.getCacheName()
  const cacheBaseUrl = Config.getCacheBaseUrl()

  const webView: WebView = {
    anthropicVersion,
    apiKey,
    cacheBaseUrl,
    cacheName,
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens,
    messages: [],
    modelId,
    modelName,
    port,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: true,
    time: 0,
    tools: [],
    url,
  }
  WebViewStates.set(id, webView)

  const restoredMessages = await RestoreMessages.restoreMessages(id, cacheName, cacheBaseUrl, savedState)

  const newWebView: Partial<WebView> = {
    currentInput: savedState?.currentInput || '',
    focused: savedState?.focused || false,
    inputSource: InputSource.Script,
    messages: restoredMessages,
    scrollOffset: savedState?.scrollOffset || 0,
    tools: getTools(),
  }

  await Update.update(id, newWebView)

  if (savedState?.focused) {
    await port.invoke('focusInput')
  }

  if (!apiKey) {
    const errorMessage: Message = {
      content: [
        {
          content: `Error: ${ErrorCodes.E_MISSING_API_KEY}: Missing API Key`,
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Ai,
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
