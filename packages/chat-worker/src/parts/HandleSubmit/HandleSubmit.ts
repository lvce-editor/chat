import type { Message } from '../Message/Message.ts'
import { formatMessagesForApi } from '../FormatMessagesForApi/FormatMessagesForApi.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import { getNewContent } from '../GetNewContent/GetNewContent.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as UnwrapApiResponse from '../UnwrapApiResponse/UnwrapApiResponse.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
export const handleSubmit = async (id: number) => {
  const webView = WebViewStates.get(id)

  const newContent = getNewContent(webView.currentInput, webView.images)

  const message: Message = {
    role: MessageRole.Human,
    content: newContent,
    webViewId: id,
  }

  const newMessages = [...webView.messages, message]

  await Update.update(id, {
    messages: newMessages,
    images: [],
    currentInput: '',
    inputSource: InputSource.Script,
    previewImageUrl: '',
  })

  try {
    const formattedMessages = await formatMessagesForApi(newMessages)
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
      role: MessageRole.Ai,
      content: [
        {
          type: MessageContentType.Text,
          content:
            error instanceof TypeError && error.message === 'Failed to fetch'
              ? 'Error: E_OFFLINE: Unable to connect. Please check your internet connection and try again.'
              : `Error: ${error}`,
        },
      ],
      webViewId: id,
    }

    await Update.update(id, {
      ...webView,
      messages: [...newMessages, errorMessage],
    })
  }
}
