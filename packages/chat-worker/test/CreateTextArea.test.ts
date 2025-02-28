import { test, expect } from '@jest/globals'
import * as CreateTextArea from '../src/parts/CreateTextArea/CreateTextArea.ts'

test('creates textarea virtual dom', () => {
  const result = CreateTextArea.createTextArea()

  expect(result).toEqual({
    type: 'textarea',
    className: 'Input',
    name: 'Input',
    placeholder: 'Send a message...',
    events: {
      input: 'handleInput',
      keydown: 'handleKeyDown',
    },
  })
})
