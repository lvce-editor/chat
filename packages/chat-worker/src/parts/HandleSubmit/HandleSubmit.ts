import * as AddMessage from '../AddMessage/AddMessage.ts'
<<<<<<< HEAD
import { formatMessagesForApi } from '../FormatMessagesForApi/FormatMessagesForApi.ts'
=======
import { formatMessagesForApi } from '../FormatMessages/FormatMessages.ts'
>>>>>>> origin/main
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import { getNewContent } from '../GetNewContent/GetNewContent.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
<<<<<<< HEAD
=======
import type { Message } from '../Message/Message.ts'
>>>>>>> origin/main
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = async (id: number, input: string) => {
  const webView = WebViewStates.get(id)
  const newContent = getNewContent(input, webView.images)

  const message: Message = {
    role: 'human',
    content: newContent,
  }
  // @ts-ignore
  webView.messages.push(message)

<<<<<<< HEAD
  await AddMessage.addMessage(id, newContent, 'human')
=======
  await AddMessage.addMessage(id, message)
>>>>>>> origin/main

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
<<<<<<< HEAD
  const stream = GetChatResponseStream.getChatResponseStream(body)
  await HandleApiResponse.handleApiResponse(id, stream)
=======
  await HandleApiResponse.handleApiResponse(id, body)
>>>>>>> origin/main
}
