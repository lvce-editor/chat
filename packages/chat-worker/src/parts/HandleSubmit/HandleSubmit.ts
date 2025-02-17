import type { Message } from '../Message/Message.ts'
import * as AddMessage from '../AddMessage/AddMessage.ts'
import { formatMessagesForApi } from '../FormatMessagesForApi/FormatMessagesForApi.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import { getNewContent } from '../GetNewContent/GetNewContent.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
import * as UnwrapApiResponse from '../UnwrapApiResponse/UnwrapApiResponse.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = async (id: number, input: string) => {
  const webView = WebViewStates.get(id)
  const newContent = getNewContent(input, webView.images)

  // @ts-ignore
  webView.images = []

  const message: Message = {
    role: 'human',
    content: newContent,
    webViewId: id,
  }
  // @ts-ignore
  webView.messages.push(message)

  await AddMessage.addMessage(id, message)

  try {
    const formattedMessages = await formatMessagesForApi(webView.messages)

    const response = await GetChatResponse.getChatResponse(
      formattedMessages,
      webView.apiKey,
      webView.modelId,
      webView.url,
      webView.anthropicVersion,
      webView.stream,
      webView.maxTokens,
    )
    const body = await UnwrapApiResponse.unwrapApiResponse(response)
    await HandleApiResponse.handleApiResponse(id, body)
  } catch (error) {
    const errorMessage: Message = {
      role: 'ai',
      content: [
        {
          type: 'text',
          content: `Error: ${error}`,
        },
      ],
      webViewId: id,
    }
    // @ts-ignore
    webView.messages.push(errorMessage)
    await AddMessage.addMessage(id, errorMessage)
  }
}
