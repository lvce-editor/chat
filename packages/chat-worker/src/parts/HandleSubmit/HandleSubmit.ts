import type { BaseMessageContent } from '../MessageContent/MessageContent.ts'
import * as AddMessage from '../AddMessage/AddMessage.ts'
import * as FormatMessage from '../FormatMessage/FormatMessage.ts'
import { formatMessages } from '../FormatMessages/FormatMessages.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import * as RenderMessage from '../RenderMessage/RenderMessage.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = async (id, input, file) => {
  const webView = WebViewStates.get(id)
  const content: BaseMessageContent[] = []

  if (file) {
    const blob = new Blob([file.data], { type: file.type })
    const blobUrl = URL.createObjectURL(blob)
    content.push({
      type: 'image',
      content: file.data,
      // @ts-ignore
      blobUrl,
    })
  }

  if (input) {
    content.push({
      type: 'text',
      content: input,
    })
  }

  // @ts-ignore
  webView.messages.push({
    role: 'human',
    content,
  })

  // @ts-ignore
  await AddMessage.addMessage(id, content, 'human')

  let currentMessage = ''
  const acc = new WritableStream({
    async start() {
      await AddMessage.addMessage(id, '', 'ai')
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

  const formattedMessages = formatMessages(webView.messages)

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
