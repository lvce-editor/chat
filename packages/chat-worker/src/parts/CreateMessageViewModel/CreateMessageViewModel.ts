import type { Message } from '../Message/Message.ts'
import type { MessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import { createMessageContentViewModel } from '../CreateMessageContentViewModel/CreateMessageContentViewModel.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const createMessageViewModel = async (message: Message): Promise<MessageViewModel> => {
  const webView = WebViewStates.get(message.webViewId)
  const blockArrays = await Promise.all(message.content.map((part) => createMessageContentViewModel(part, webView)))

  return {
    role: message.role,
    webViewId: message.webViewId,
    blocks: blockArrays.flat(),
  }
}
