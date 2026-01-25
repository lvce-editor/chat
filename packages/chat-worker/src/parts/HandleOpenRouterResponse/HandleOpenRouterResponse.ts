import type { Message } from '../Message/Message.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as OpenRouterEventStream from '../OpenRouterEventStream/OpenRouterEventStream.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleOpenRouterResponse = async (id: number, body: ReadableStream): Promise<any> => {
  let currentMessage = ''
  let toolUseMessage = ''
  let inToolUse = false
  let toolId = ''
  let toolName = ''

  const acc = new WritableStream({
    async close() {
      if (inToolUse) {
        const currentWebView = WebViewStates.get(id)
        const parsed = JSON.parse(toolUseMessage || '{}')
        const newMessage: Message = {
          content: [
            {
              input: parsed,
              tool_use_id: toolId,
              tool_use_name: toolName,
              type: MessageContentType.ToolUse,
            },
          ],
          role: MessageRole.Ai,
          webViewId: id,
        }
        await Update.update(id, {
          messages: [...currentWebView.messages.slice(0, -1), newMessage],
        })
        return
      }
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        content: [
          {
            content: currentMessage,
            type: MessageContentType.Text,
          },
        ],
        role: MessageRole.Ai,
        webViewId: id,
      }
      await Update.update(id, {
        messages: [...currentWebView.messages.slice(0, -1), newMessage],
      })
    },

    async start() {
      const currentWebView = WebViewStates.get(id)

      await Update.update(id, {
        messages: [
          ...currentWebView.messages,
          {
            content: [],
            role: MessageRole.Ai,
            webViewId: id,
          },
        ],
      })
    },

    async write(message) {
      currentMessage += message
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        content: [
          {
            content: currentMessage,
            type: MessageContentType.Text,
          },
        ],
        role: MessageRole.Ai,
        webViewId: id,
      }
      await Update.update(id, {
        messages: [...currentWebView.messages.slice(0, -1), newMessage],
      })
    },
  })

  const messageStream = new TransformStream({
    async transform(chunk, controller) {
      // OpenAI/OpenRouter format: choices[0].delta.content or choices[0].delta.tool_calls
      const choice = chunk?.choices?.[0]
      const delta = choice?.delta

      if (delta?.tool_calls && delta.tool_calls.length > 0) {
        const toolCall = delta.tool_calls[0]
        if (toolCall.function?.name) {
          // Start of tool use
          inToolUse = true
          toolName = toolCall.function.name
          toolId = toolCall.id || ''
          const currentWebView = WebViewStates.get(id)
          const newMessage: Message = {
            content: [
              {
                input: {},
                tool_use_id: toolId,
                tool_use_name: toolName,
                type: MessageContentType.ToolUse,
              },
            ],
            role: MessageRole.Ai,
            webViewId: id,
          }
          await Update.update(id, {
            messages: [...currentWebView.messages, newMessage],
          })
        }
        if (toolCall.function?.arguments) {
          toolUseMessage += toolCall.function.arguments
        }
      } else if (delta?.content) {
        controller.enqueue(delta.content)
      }
    },
  })

  const stream = OpenRouterEventStream.openRouterEventStream(body)
  await stream.pipeThrough(messageStream).pipeTo(acc)
  return {
    toolId,
    toolName,
    toolUseMessage,
  }
}
