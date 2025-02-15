import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'

export const createInitialDom = (savedMessageVDoms: VirtualElement[]): VirtualElement => {
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
}
