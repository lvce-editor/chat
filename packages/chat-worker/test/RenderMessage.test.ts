import { test, expect } from '@jest/globals'
import type { MessageViewModel } from '../src/parts/MessageViewModel/MessageViewModel.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as MessageRole from '../src/parts/MessageRole/MessageRole.ts'
import * as RenderMessage from '../src/parts/RenderMessage/RenderMessage.ts'

test('renders human message with text content', () => {
  const viewModel: MessageViewModel = {
    role: MessageRole.Human,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Text,
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
    role: MessageRole.Ai,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Code,
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
                children: [
                  {
                    children: ['const x = 1;'],
                    type: 'span',
                  },
                ],
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
    role: MessageRole.Human,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Image,
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
    role: MessageRole.Ai,
    webViewId: 1,
    blocks: [
      {
        type: MessageContentType.Text,
        content: 'Here is some code:',
        display: {},
      },
      {
        type: MessageContentType.Code,
        content: 'console.log("hello");',
        display: {
          language: 'javascript',
        },
      },
      {
        type: MessageContentType.Text,
        content: 'And here is an image:',
        display: {},
      },
      {
        type: MessageContentType.Image,
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
