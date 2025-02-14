import * as AddMessage from '../AddMessage/AddMessage.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = async (id, input) => {
  const webView = WebViewStates.get(id)

  // Add human message to state
  // @ts-ignore
  webView.messages.push({
    role: 'human',
    content: input,
  })

  await AddMessage.addMessage(id, input, 'human')

  let currentMessage = ''
  const acc = new WritableStream({
    async start() {
      await AddMessage.addMessage(id, '', 'ai')
    },

    async write(message) {
      currentMessage += message
      const blocks = FormatMessage.formatMessage(currentMessage)
      await webView.port.invoke('updateMessage', blocks)
    },

    async close() {
      // Add AI message to state once complete
      // @ts-ignore
      webView.messages.push({
        role: 'ai',
        content: FormatMessage.formatMessage(currentMessage),
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

  const formattedMessages = webView.messages.map((message) => ({
    role: message.role === 'human' ? 'user' : 'assistant',
    content: Array.isArray(message.content) ? message.content.map((block) => block.content).join('\n') : message.content,
  }))

  const body = await GetChatResponse.getChatResponse(
    formattedMessages,
    webView.apiKey,
    webView.modelId,
    webView.url,
    webView.anthropicVersion,
    webView.stream,
    webView.maxTokens,
  )
  const stream = GetChatResponseStream.getChatResponseStream(body)
  await stream.pipeThrough(messageStream).pipeTo(acc)
}
