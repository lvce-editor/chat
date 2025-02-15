import * as AddMessage from '../AddMessage/AddMessage.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import { createMessageViewModel } from '../MessageViewModel/MessageViewModel.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleApiResponse = async (id: number, body: ReadableStream) => {
  const webView = WebViewStates.get(id)

  let currentMessage = ''
  const acc = new WritableStream({
    async start() {
      await AddMessage.addMessage(id, {
        role: 'ai',
        content: [
          {
            type: 'text',
            content: '',
          },
        ],
      })
    },

    async write(message) {
      currentMessage += message
      const content = FormatMessage.formatMessage(currentMessage)
      const model = await createMessageViewModel({
        role: 'ai',
        content,
      })
      const messageVDom = RenderMessage.renderMessage(model)
      await webView.port.invoke('updateMessage', messageVDom)
    },

    async close() {
      // Add AI message to state once complete
      const content = FormatMessage.formatMessage(currentMessage)
      // @ts-ignore
      webView.messages.push({
        role: 'ai',
        content,
      })
    },
  })

  const messageStream = new TransformStream({
    transform(chunk, controller) {
      if (chunk && chunk.type && chunk.type === 'content_block_delta') {
        controller.enqueue(chunk.delta.text)
      }
    },
  })
  const stream = GetChatResponseStream.getChatResponseStream(body)
  await stream.pipeThrough(messageStream).pipeTo(acc)
}
