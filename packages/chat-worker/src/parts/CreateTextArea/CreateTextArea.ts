import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const createTextArea = (): VirtualElement => {
  return {
    type: 'textarea',
    className: 'Input',
    name: 'Input',
    placeholder: 'Send a message...',
    events: {
      input: 'handleInput',
      keydown: 'handleKeyDown',
    },
  }
}
