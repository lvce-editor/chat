import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import { Message } from '../Message/Message.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleApiResponse = async (id: number, body: ReadableStream) => {
  let currentMessage = ''

  const acc = new WritableStream({
    async start() {
      const currentWebView = WebViewStates.get(id)

      await Update.update(id, {
        messages: [
          ...currentWebView.messages,
          {
            role: MessageRole.Ai,
            content: [],
            webViewId: id,
          },
        ],
      })
    },

    async write(message) {
      currentMessage += message
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: currentMessage,
          },
        ],
        webViewId: id,
      }
      await Update.update(id, {
        messages: [...currentWebView.messages.slice(0, -1), newMessage],
      })
    },

    async close() {
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: currentMessage,
          },
        ],
        webViewId: id,
      }
      await Update.update(id, {
        messages: [...currentWebView.messages.slice(0, -1), newMessage],
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
