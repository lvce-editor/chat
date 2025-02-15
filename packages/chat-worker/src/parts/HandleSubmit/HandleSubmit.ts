import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as AddMessage from '../AddMessage/AddMessage.ts'
import { formatMessagesForApi } from '../FormatMessages/FormatMessages.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const getNewContent = (input: string, images: readonly File[]): readonly MessageContent[] => {
  const newContent: MessageContent[] = []
  for (const file of images) {
    newContent.push({
      type: 'image',
      file,
      mediaType: 'image/png',
    })
  }

  if (input) {
    newContent.push({
      type: 'text',
      content: input,
    })
  }
  return newContent
}

export const handleSubmit = async (id: number, input: string) => {
  const webView = WebViewStates.get(id)
  const newContent = getNewContent(input, webView.images)

  // @ts-ignore
  webView.messages.push({
    role: 'human',
    content: newContent,
  })

  await AddMessage.addMessage(id, newContent, 'human')

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
  await HandleApiResponse.handleApiResponse(id, stream)
}
