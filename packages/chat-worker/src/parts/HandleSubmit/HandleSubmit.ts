import type { Message } from '../Message/Message.ts'
import { execTool } from '../ExecTool/ExecTool.ts'
import * as FormatMessagesForApi from '../FormatMessagesForApi/FormatMessagesForApi.ts'
import * as GetChatResponse from '../GetChatResponse/GetChatResponse.ts'
import * as GetNewContent from '../GetNewContent/GetNewContent.ts'
import * as HandleApiResponse from '../HandleApiResponse/HandleApiResponse.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as UnwrapApiResponse from '../UnwrapApiResponse/UnwrapApiResponse.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const max = 50 // prevent endless loop
let current = 0

export const handleSubmit = async (id: number) => {
  const webView = WebViewStates.get(id)

  const newContent = GetNewContent.getNewContent(webView.currentInput, webView.images)

  const message: Message = {
    content: newContent,
    role: MessageRole.Human,
    webViewId: id,
  }

  const newMessages = [...webView.messages, message]

  await Update.update(id, {
    currentInput: '',
    images: [],
    inputSource: InputSource.Script,
    messages: newMessages,
    previewImageUrl: '',
  })

  try {
    const formattedMessages = await FormatMessagesForApi.formatMessagesForApi(newMessages)
    const response = await GetChatResponse.getChatResponse(
      formattedMessages,
      webView.apiKey,
      webView.modelId,
      webView.url,
      webView.anthropicVersion,
      webView.stream,
      webView.maxTokens,
      webView.tools,
    )
    const body = await UnwrapApiResponse.unwrapApiResponse(response)
    const { toolId, toolName, toolUseMessage } = await HandleApiResponse.handleApiResponse(id, body)
    if (toolId && toolName) {
      const parsed = JSON.parse(toolUseMessage || '{}')
      const result = await execTool(toolName, parsed, webView.modelId, webView.modelName)
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        content: [
          {
            content: JSON.stringify(result || null),
            tool_use_id: toolId,
            tool_use_name: toolName,
            type: MessageContentType.ToolResult,
          },
        ],
        role: MessageRole.Human,
        webViewId: id,
      }
      const newMessages = [...currentWebView.messages, newMessage]
      await Update.update(id, {
        messages: newMessages,
      })

      if (++current >= max) {
        return
      }

      // continue the conversion with tool result
      await handleSubmit(id)
    }
  } catch (error) {
    const errorMessage: Message = {
      content: [
        {
          content:
            error instanceof TypeError && error.message === 'Failed to fetch'
              ? 'Error: E_OFFLINE: Unable to connect. Please check your internet connection and try again.'
              : `Error: ${error}`,
          type: MessageContentType.Text,
        },
      ],
      role: MessageRole.Ai,
      webViewId: id,
    }

    await Update.update(id, {
      ...webView,
      messages: [...newMessages, errorMessage],
    })
  }
}
