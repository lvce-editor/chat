import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const addMessage = async (id: number, message: string, role: 'human' | 'ai') => {
  const webView = WebViewStates.get(id)
  const wasAtBottom = await webView.port.invoke('checkIsBottom')
  await webView.port.invoke('addMessage', message, role)
  if (wasAtBottom) {
    await webView.port.invoke('setScrollTop')
  }

  // Update UI state
  await webView.port.invoke('updateNewChatButtonState')

  await webView.port.invoke('clear')
}
