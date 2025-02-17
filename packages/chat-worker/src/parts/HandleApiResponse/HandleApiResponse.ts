import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleApiResponse = async (id: number, body: ReadableStream) => {
  const webView = WebViewStates.get(id)
  let currentMessage = ''

  const acc = new WritableStream({
    async write(message) {
      currentMessage += message
      const content = FormatMessage.formatMessage(currentMessage)

      await WebViewStates.update(id, {
        messages: [
          ...webView.messages.slice(0, -1),
          {
            role: 'ai',
            content,
            webViewId: id,
          },
        ],
      })
    },

    async close() {
      const content = FormatMessage.formatMessage(currentMessage)
      await WebViewStates.update(id, {
        messages: [
          ...webView.messages.slice(0, -1),
          {
            role: 'ai',
            content,
            webViewId: id,
          },
        ],
      })
    },
  })

  const messageStream = new TransformStream({
    transform(chunk, controller) {
      if (chunk?.type === 'content_block_delta') {
        controller.enqueue(chunk.delta.text)
      }
    },
  })

  const stream = GetChatResponseStream.getChatResponseStream(body)
  await stream.pipeThrough(messageStream).pipeTo(acc)
}
