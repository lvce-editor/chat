import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'

export const handleSubmit = async (id, input) => {
  const webView = WebViewStates.get(id)
  await webView.port.invoke('addMessage', input, 'human')
  await webView.port.invoke('clear')

  let currentMessage = ''
  const acc = new WritableStream({
    async start() {
      await webView.port.invoke('addMessage', '', 'ai')
    },

    async write(message) {
      currentMessage += message
      const blocks = FormatMessage.formatMessage(currentMessage)
      await webView.port.invoke('updateMessage', blocks)
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
