import * as AddMessage from '../AddMessage/AddMessage.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import { formatMessagesForApi } from '../FormatMessagesForApi/FormatMessagesForApi.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import { getNewContent } from '../GetNewContent/GetNewContent.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = async (id: number, input: string) => {
  const webView = WebViewStates.get(id)
  const newContent = getNewContent(input, webView.images)

  // @ts-ignore
  webView.messages.push({
    role: 'human',
    content: newContent,
  })

  await AddMessage.addMessage(id, newContent, 'human')

  let currentMessage = ''
  const acc = new WritableStream({
    async start() {
      await AddMessage.addMessage(
        id,
        [
          {
            type: 'text',
            content: '',
          },
        ],
        'ai',
      )
    },

    async write(message) {
      currentMessage += message
      const blocks = FormatMessage.formatMessage(currentMessage)
      const messageVDom = RenderMessage.renderMessage(blocks, 'ai')
      await webView.port.invoke('updateMessage', messageVDom)
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

  const formattedMessages = await formatMessagesForApi(webView.messages)

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
