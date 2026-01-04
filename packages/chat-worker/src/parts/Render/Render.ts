import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import type { WebView } from '../WebView/WebView.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'
import { createMessageViewModel } from '../CreateMessageViewModel/CreateMessageViewModel.ts'
import { renderMessage } from '../RenderMessage/RenderMessage.ts'

export const render = async (webView: WebView): Promise<VirtualElement> => {
  const { messages } = webView
  const viewModels = await Promise.all(messages.map(createMessageViewModel))
  const messageVDoms = viewModels.map(renderMessage)

  return {
    children: [
      {
        children: [
          {
            className: 'NewChatButton',
            events: {
              click: 'handleNewChat',
            },
            textContent: 'New Chat',
            type: 'button',
          },
        ],
        className: 'Header',
        type: 'div',
      },
      {
        children: [
          {
            children: messageVDoms,
            className: 'Output',
            type: 'div',
          },
        ],
        className: 'ContentWrapper',
        type: 'div',
      },
      {
        children: [createFormContent(webView.previewImageUrl)],
        className: 'Form',
        events: {
          submit: 'handleSubmit',
        },
        type: 'form',
      },
    ],
    className: 'App',
    type: 'div',
  }
}
