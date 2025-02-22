import type { MessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetCodeBlockVirtualDom from '../GetCodeBlockVirtualDom/GetCodeBlockVirtualDom.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'

export const renderMessage = (viewModel: MessageViewModel): VirtualElement => {
  const { role, blocks } = viewModel
  const isError = blocks.some((block) => block.content.startsWith('Error:'))
  const messageElement: VirtualElement = {
    type: 'div',
    className: isError ? ClassNames.MessageError : (role === MessageRole.Human ? ClassNames.MessageHuman : ClassNames.MessageAi),
  }

  const wrappedMessage: VirtualElement = {
    type: 'div',
    className: isError
      ? ClassNames.MessageWrapperError
      : `${ClassNames.MessageWrapper} ${role === MessageRole.Human ? ClassNames.MessageWrapperHuman : ClassNames.MessageWrapperAi}`,
    children: [messageElement],
  }

  const blocksHtml = blocks.map((block) => {
    if (block.type === MessageContentType.List) {
      const items = block.items || []
      return {
        type: block.ordered ? 'ol' : 'ul',
<<<<<<< HEAD
        className: ClassNames.MessageList,
=======
        className: 'MessageList',
>>>>>>> origin/main
        children: items.map((item) => ({
          type: 'li',
          className: ClassNames.MessageListItem,
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
        className: ClassNames.ImageBlock,
        children: [
          {
            type: 'img',
            className: ClassNames.MessageImage,
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
