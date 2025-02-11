import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'

export const handleSubmit = async (id, input) => {
  const webView = WebViewStates.get(id)
  // TODO race condition
  await webView.port.invoke('addMessage', input)
  await webView.port.invoke('clear')

  const acc = new WritableStream({
    async start() {
      await webView.port.invoke('addMessage', '')
    },

    async write(message) {
      await webView.port.invoke('appendMessage', message)
    },
  })

  const messageStream = new TransformStream({
    transform(chunk, controller) {
      if (chunk && chunk.type && chunk.type === 'content_block_delta') {
        controller.enqueue(chunk.delta.text)
      }
    },
  })

  const body = await GetChatResponse.getChatResponse(
    input,
    webView.apiKey,
    webView.modelId,
    webView.url,
    webView.anthropicVersion,
    webView.stream,
  )
  const stream = GetChatResponseStream.getChatResponseStream(body)
  await stream.pipeThrough(messageStream).pipeTo(acc)
  return undefined
}
