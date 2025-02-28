import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const getSelectVirtualDom = (): VirtualElement => {
  return {
    type: 'select',
    className: 'ModelSelect',
    name: 'ModelSelect',
    events: {
      change: 'handleModelSelect',
    },
    children: [
      {
        type: 'option',
        value: 'claude-3-5-haiku-20241022',
        textContent: 'Claude 3 Haiku',
      },
      {
        type: 'option',
        value: 'claude-3-5-sonnet-20241022',
        textContent: 'Claude 3 Sonnet',
      },
      {
        type: 'option',
        value: 'claude-3-opus-20240229',
        textContent: 'Claude 3 Opus',
      },
    ],
  }
}
