import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const createTextArea = (): VirtualElement => {
  return {
    className: 'Input',
    events: {
      input: 'handleInput',
      keydown: 'handleKeyDown',
    },
    name: 'Input',
    placeholder: 'Send a message...',
    type: 'textarea',
  }
}
