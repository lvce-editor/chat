import type { Message } from '../Message/Message.ts'
import { formatMessagesForApi } from '../FormatMessagesForApi/FormatMessagesForApi.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import { getNewContent } from '../GetNewContent/GetNewContent.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
import * as UnwrapApiResponse from '../UnwrapApiResponse/UnwrapApiResponse.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = async (id: number, input: string) => {
  const webView = WebViewStates.get(id)
  const newContent = getNewContent(input, webView.images)

  const message: Message = {
    role: 'human',
    content: newContent,
    webViewId: id,
  }

  await WebViewStates.update(id, (webView) => ({
    ...webView,
    messages: [...webView.messages, message],
    images: [],
    currentInput: '',
    previewImageUrl: undefined,
  }))

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

    await WebViewStates.update(id, (webView) => ({
      ...webView,
      messages: [...webView.messages, errorMessage],
    }))
  }
}
