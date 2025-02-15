import * as AddMessage from '../AddMessage/AddMessage.ts'
import { formatMessagesForApi } from '../FormatMessagesForApi/FormatMessagesForApi.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import { getNewContent } from '../GetNewContent/GetNewContent.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
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
