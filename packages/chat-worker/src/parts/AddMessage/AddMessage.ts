import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const addMessage = async (id: number, message: any, role: 'human' | 'ai' = 'ai') => {
  const webView = WebViewStates.get(id)

  // Add message to DOM
  await webView.port.invoke('addMessage', message, role)

  // Fix scroll position if needed
  // @ts-ignore
  const wrapper = document.querySelector('.ContentWrapper')
  if (wrapper && isAtBottom(wrapper)) {
    // @ts-ignore
    await webView.port.invoke('fixScroll')
  }

  // Update UI state
  await webView.port.invoke('updateNewChatButtonState')
}

const isAtBottom = (element) => {
  const { scrollTop, scrollHeight, clientHeight } = element
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 10
}
