import { test, expect } from '@jest/globals'
import type { MessageViewModel } from '../src/parts/MessageViewModel/MessageViewModel.ts'
import * as RenderMessage from '../src/parts/RenderMessage/RenderMessage.ts'

test('renders human message with text content', () => {
  const viewModel: MessageViewModel = {
    role: 'human',
    webViewId: 1,
    blocks: [
      {
        type: 'text',
        content: 'Hello world',
        display: {},
      },
    ],
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    type: 'div',
    className: 'MessageWrapper MessageWrapperHuman',
    children: [
      {
        type: 'div',
        className: 'MessageHuman',
        children: [
          {
            type: 'p',
            textContent: 'Hello world',
          },
        ],
      },
    ],
  })
})

test('renders AI message with code block', () => {
  const viewModel: MessageViewModel = {
    role: 'ai',
    webViewId: 1,
    blocks: [
      {
        type: 'code',
        content: 'const x = 1;',
        display: {
          language: 'javascript',
        },
      },
    ],
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    type: 'div',
    className: 'MessageWrapper MessageWrapperAi',
    children: [
      {
        type: 'div',
        className: 'MessageAi',
        children: [
          {
            type: 'pre',
            className: 'CodeBlock language-javascript',
            children: [
              {
                type: 'code',
                className: 'CodeText',
                textContent: 'const x = 1;',
              },
            ],
          },
        ],
      },
    ],
  })
})

test('renders message with image block', () => {
  const viewModel: MessageViewModel = {
    role: 'human',
    webViewId: 1,
    blocks: [
      {
        type: 'image',
        content: '',
        display: {
          blobUrl: 'blob:123',
        },
      },
    ],
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    type: 'div',
    className: 'MessageWrapper MessageWrapperHuman',
    children: [
      {
        type: 'div',
        className: 'MessageHuman',
        children: [
          {
            type: 'div',
            className: 'ImageBlock',
            children: [
              {
                type: 'img',
                className: 'MessageImage',
                src: 'blob:123',
              },
            ],
          },
        ],
      },
    ],
  })
})

test('renders message with mixed content types', () => {
  const viewModel: MessageViewModel = {
    role: 'ai',
    webViewId: 1,
    blocks: [
      {
        type: 'text',
        content: 'Here is some code:',
        display: {},
      },
      {
        type: 'code',
        content: 'console.log("hello");',
        display: {
          language: 'javascript',
        },
      },
      {
        type: 'text',
        content: 'And here is an image:',
        display: {},
      },
      {
        type: 'image',
        content: '',
        display: {
          blobUrl: 'blob:123',
        },
      },
    ],
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    type: 'div',
    className: 'MessageWrapper MessageWrapperAi',
    children: [
      {
        type: 'div',
        className: 'MessageAi',
        children: [
          {
            type: 'p',
            textContent: 'Here is some code:',
          },
          {
            type: 'pre',
            className: 'CodeBlock language-javascript',
            children: [
              {
                type: 'code',
                className: 'CodeText',
                children: [
                  {
                    children: ['console.log("hello");'],
                    type: 'span',
                  },
                ],
              },
            ],
          },
          {
            type: 'p',
            textContent: 'And here is an image:',
          },
          {
            type: 'div',
            className: 'ImageBlock',
            children: [
              {
                type: 'img',
                className: 'MessageImage',
                src: 'blob:123',
              },
            ],
          },
        ],
      },
    ],
  })
})
