import type { WebView } from '../WebView/WebView.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import { createMessageViewModel } from '../CreateMessageViewModel/CreateMessageViewModel.ts'
import { renderMessage } from '../RenderMessage/RenderMessage.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'

export const render = async (webView: WebView): Promise<VirtualElement> => {
  const viewModels = await Promise.all(webView.messages.map(createMessageViewModel))
  const messageVDoms = viewModels.map(renderMessage)

  return {
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
            children: messageVDoms,
          },
        ],
      },
      {
        type: 'form',
        className: 'Form',
        events: {
          submit: 'handleSubmit',
        },
        // @ts-ignore
        children: [createFormContent(webView.previewImageUrl)],
      },
    ],
  }
}
