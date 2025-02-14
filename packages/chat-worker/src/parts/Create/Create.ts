import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import type { WebView } from '../WebView/WebView.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import { formatMessages } from '../FormatMessages/FormatMessages.ts'

export const create = async ({ port, savedState, webViewId, uri, id }) => {
  const apiKey = await globalThis.rpc.invoke('WebView.getSecret', 'secrets.claude')

  // TODO make these configurable
  const modelId = 'claude-3-5-haiku-20241022'
  const url = 'https://api.anthropic.com/v1/messages'
  const anthropicVersion = '2023-06-01'
  const maxTokens = 1024

  const webView: WebView = {
    time: 0,
    port,
    apiKey,
    modelId,
    url,
    anthropicVersion,
    stream: true,
    maxTokens,
    messages: savedState?.messages || [],
    scrollOffset: savedState?.scrollOffset || 0,
  }
  WebViewStates.set(id, webView)

  // Format and create message VDOMs from saved messages
  const messages = formatMessages(webView.messages)

  const savedMessageVDoms = messages.map((message) => {
    return RenderMessage.renderMessage(message.content, message.role)
  })

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
        children: [
          {
            type: 'div',
            className: 'FormContent',
            children: [
              {
                type: 'textarea',
                className: 'Input',
                name: 'Input',
                placeholder: 'Message...',
                events: {
                  keydown: 'handleKeyDown',
                  input: 'adjustHeight',
                },
              },
            ],
          },
        ],
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
