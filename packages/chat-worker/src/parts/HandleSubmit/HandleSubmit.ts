import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'

export const handleSubmit = async (id, input) => {
  const webView = WebViewStates.get(id)
  // TODO race condition
  await webView.port.invoke('addMessage', input)
  await webView.port.invoke('clear')
  const response = await GetChatResponse.getChatResponse(
    input,
    webView.apiKey,
    webView.modelId,
    webView.url,
    webView.anthropicVersion,
  )
  await webView.port.invoke('addMessage', response)
  return undefined
}
