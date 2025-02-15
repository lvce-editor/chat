import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import type { WebView } from '../WebView/WebView.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'
import { createMessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'
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

  const restoredMessages = await RestoreMessages.restoreMessages(id, savedState)

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
  }
  WebViewStates.set(id, webView)

  const viewModels = await Promise.all(webView.messages.map(createMessageViewModel))
  const savedMessageVDoms = viewModels.map(RenderMessage.renderMessage)

  const initialDom: VirtualElement = {
    type: 'div',
    className: 'App',
    children: [
      {
        type: 'div',
        className: 'Header',
        children: [
          {
            type: 'button',
            className: 'NewChatButton',
            textContent: 'New Chat',
            events: {
              click: 'handleNewChat',
            },
          },
        ],
      },
      {
        type: 'div',
        className: 'ContentWrapper',
        children: [
          {
            type: 'div',
            className: 'Output',
            children: savedMessageVDoms,
          },
        ],
      },
      {
        type: 'form',
        className: 'Form',
        events: {
          submit: 'handleSubmit',
        },
        children: [createFormContent()],
      },
    ],
  }

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
