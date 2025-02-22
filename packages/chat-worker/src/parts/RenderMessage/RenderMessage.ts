import type { MessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import * as GetCodeBlockVirtualDom from '../GetCodeBlockVirtualDom/GetCodeBlockVirtualDom.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'

export const renderMessage = (viewModel: MessageViewModel): VirtualElement => {
  const { role, blocks } = viewModel
  const isError = blocks.some((block) => block.content.startsWith('Error:'))
  const messageElement: VirtualElement = {
    type: 'div',
    className: isError ? 'MessageError' : (role === MessageRole.Human ? 'MessageHuman' : 'MessageAi'),
  }

  const wrappedMessage: VirtualElement = {
    type: 'div',
    className: isError ? 'MessageWrapperError' : `MessageWrapper MessageWrapper${role === MessageRole.Human ? 'Human' : 'Ai'}`,
    children: [messageElement],
  }

  const blocksHtml = blocks.map((block) => {
    if (block.type === MessageContentType.List) {
      const items = block.items || []
      return {
        type: block.ordered ? 'ol' : 'ul',
        className: 'MessageList',
        children: items.map((item) => ({
          type: 'li',
          className: 'MessageListItem',
          textContent: item,
        })),
      }
    }
    if (block.type === MessageContentType.Code) {
      return GetCodeBlockVirtualDom.getCodeBlockVirtualDom(block, isError)
    }
    if (block.type === MessageContentType.Image) {
      // TODO create view model that creates object urls for images
      return {
        type: 'div',
        className: 'ImageBlock',
        children: [
          {
            type: 'img',
            className: 'MessageImage',
            src: block.display.blobUrl,
          },
        ],
      }
    }
    return {
      type: 'p',
      textContent: block.content,
    }
  })

  messageElement.children = blocksHtml
  return wrappedMessage
}
