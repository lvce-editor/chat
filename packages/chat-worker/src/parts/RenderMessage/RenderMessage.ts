import type { MessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetCodeBlockVirtualDom from '../GetCodeBlockVirtualDom/GetCodeBlockVirtualDom.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'

export const renderMessage = (viewModel: MessageViewModel): VirtualElement => {
  const { blocks, role } = viewModel
  const isError = blocks.some((block) => block.content.startsWith('Error:'))
  const messageElement: VirtualElement = {
    className: isError ? ClassNames.MessageError : (role === MessageRole.Human ? ClassNames.MessageHuman : ClassNames.MessageAi),
    type: 'div',
  }

  const wrappedMessage: VirtualElement = {
    children: [messageElement],
    className: isError
      ? ClassNames.MessageWrapperError
      : `${ClassNames.MessageWrapper} ${role === MessageRole.Human ? ClassNames.MessageWrapperHuman : ClassNames.MessageWrapperAi}`,
    type: 'div',
  }

  const blocksHtml = blocks.map((block) => {
    if (block.type === MessageContentType.List) {
      const items = block.items || []
      return {
        children: items.map((item) => ({
          className: ClassNames.MessageListItem,
          textContent: item,
          type: 'li',
        })),
        className: ClassNames.MessageList,
        type: block.ordered ? 'ol' : 'ul',
      }
    }
    if (block.type === MessageContentType.Code) {
      return GetCodeBlockVirtualDom.getCodeBlockVirtualDom(block, isError)
    }
    if (block.type === MessageContentType.Image) {
      // TODO create view model that creates object urls for images
      return {
        children: [
          {
            className: ClassNames.MessageImage,
            src: block.display.blobUrl,
            type: 'img',
          },
        ],
        className: ClassNames.ImageBlock,
        type: 'div',
      }
    }
    return {
      textContent: block.content,
      type: 'p',
    }
  })

  messageElement.children = blocksHtml
  return wrappedMessage
}
