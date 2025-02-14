import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'

export const addMessage = async (id: number, message: string, role: 'human' | 'ai') => {
  const webView = WebViewStates.get(id)
  const wasAtBottom = await webView.port.invoke('checkIsBottom')

  const messageVDom = RenderMessage.renderMessage(message, role)
  await webView.port.invoke('appendMessage', messageVDom)

  if (wasAtBottom) {
    await webView.port.invoke('setScrollTop')
  }

  // Update UI state
  await webView.port.invoke('updateNewChatButtonState')

  await webView.port.invoke('clear')
}
