import type { Message } from '../Message/Message.ts'
import type { MessageContent } from '../MessageContent/MessageContent.ts'
import { createMessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const addMessage = async (id: number, message: Message) => {
  const webView = WebViewStates.get(id)
  const wasAtBottom = await webView.port.invoke('checkIsBottom')

  const viewModel = await createMessageViewModel(message)
  const messageVDom = RenderMessage.renderMessage(viewModel)
  await webView.port.invoke('appendMessage', messageVDom)

  if (wasAtBottom) {
    await webView.port.invoke('setScrollTop')
  }

  // Update UI state
  await webView.port.invoke('updateNewChatButtonState')

  await webView.port.invoke('clear')
}
