import { test, expect } from '@jest/globals'
import type { MessageViewModel } from '../src/parts/MessageViewModel/MessageViewModel.ts'
import * as MessageContentType from '../src/parts/MessageContentType/MessageContentType.ts'
import * as MessageRole from '../src/parts/MessageRole/MessageRole.ts'
import * as RenderMessage from '../src/parts/RenderMessage/RenderMessage.ts'

test('renders human message with text content', () => {
  const viewModel: MessageViewModel = {
    blocks: [
      {
        content: 'Hello world',
        display: {},
        type: MessageContentType.Text,
      },
    ],
    role: MessageRole.Human,
    webViewId: 1,
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    children: [
      {
        children: [
          {
            textContent: 'Hello world',
            type: 'p',
          },
        ],
        className: 'MessageHuman',
        type: 'div',
      },
    ],
    className: 'MessageWrapper MessageWrapperHuman',
    type: 'div',
  })
})

test('renders AI message with code block', () => {
  const viewModel: MessageViewModel = {
    blocks: [
      {
        content: 'const x = 1;',
        display: {
          language: 'javascript',
        },
        type: MessageContentType.Code,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    children: [
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: ['const x = 1;'],
                    type: 'span',
                  },
                ],
                className: 'CodeText',
                type: 'code',
              },
            ],
            className: 'CodeBlock language-javascript',
            type: 'pre',
          },
        ],
        className: 'MessageAi',
        type: 'div',
      },
    ],
    className: 'MessageWrapper MessageWrapperAi',
    type: 'div',
  })
})

test('renders message with image block', () => {
  const viewModel: MessageViewModel = {
    blocks: [
      {
        content: '',
        display: {
          blobUrl: 'blob:123',
        },
        type: MessageContentType.Image,
      },
    ],
    role: MessageRole.Human,
    webViewId: 1,
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    children: [
      {
        children: [
          {
            children: [
              {
                className: 'MessageImage',
                src: 'blob:123',
                type: 'img',
              },
            ],
            className: 'ImageBlock',
            type: 'div',
          },
        ],
        className: 'MessageHuman',
        type: 'div',
      },
    ],
    className: 'MessageWrapper MessageWrapperHuman',
    type: 'div',
  })
})

test('renders message with mixed content types', () => {
  const viewModel: MessageViewModel = {
    blocks: [
      {
        content: 'Here is some code:',
        display: {},
        type: MessageContentType.Text,
      },
      {
        content: 'console.log("hello");',
        display: {
          language: 'javascript',
        },
        type: MessageContentType.Code,
      },
      {
        content: 'And here is an image:',
        display: {},
        type: MessageContentType.Text,
      },
      {
        content: '',
        display: {
          blobUrl: 'blob:123',
        },
        type: MessageContentType.Image,
      },
    ],
    role: MessageRole.Ai,
    webViewId: 1,
  }

  const result = RenderMessage.renderMessage(viewModel)

  expect(result).toEqual({
    children: [
      {
        children: [
          {
            textContent: 'Here is some code:',
            type: 'p',
          },
          {
            children: [
              {
                children: [
                  {
                    children: ['console.log("hello");'],
                    type: 'span',
                  },
                ],
                className: 'CodeText',
                type: 'code',
              },
            ],
            className: 'CodeBlock language-javascript',
            type: 'pre',
          },
          {
            textContent: 'And here is an image:',
            type: 'p',
          },
          {
            children: [
              {
                className: 'MessageImage',
                src: 'blob:123',
                type: 'img',
              },
            ],
            className: 'ImageBlock',
            type: 'div',
          },
        ],
        className: 'MessageAi',
        type: 'div',
      },
    ],
    className: 'MessageWrapper MessageWrapperAi',
    type: 'div',
  })
})
