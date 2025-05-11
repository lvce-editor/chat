import type { Message } from '../Message/Message.ts'
import { execTool } from '../ExecTool/ExecTool.ts'
import * as GetChatResponseStream from '../GetChatResponseStream/GetChatResponseStream.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as Update from '../Update/Update.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleApiResponse = async (id: number, body: ReadableStream) => {
  let currentMessage = ''
  let toolUseMessage = ''
  let inToolUse = false
  let toolId = ''

  const acc = new WritableStream({
    async start() {
      const currentWebView = WebViewStates.get(id)

      await Update.update(id, {
        messages: [
          ...currentWebView.messages,
          {
            role: MessageRole.Ai,
            content: [],
            webViewId: id,
          },
        ],
      })
    },

    async write(message) {
      currentMessage += message
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: currentMessage,
          },
        ],
        webViewId: id,
      }
      await Update.update(id, {
        messages: [...currentWebView.messages.slice(0, -1), newMessage],
      })
    },

    async close() {
      const currentWebView = WebViewStates.get(id)
      const newMessage: Message = {
        role: MessageRole.Ai,
        content: [
          {
            type: MessageContentType.Text,
            content: currentMessage,
          },
        ],
        webViewId: id,
      }
      await Update.update(id, {
        messages: [...currentWebView.messages.slice(0, -1), newMessage],
      })
    },
  })

  const messageStream = new TransformStream({
    async transform(chunk, controller) {
      if (chunk?.type === 'content_block_start' && chunk?.content_block?.type === 'tool_use') {
        // TODO handle tool use
        inToolUse = true
        toolId = chunk?.content_block?.name
      } else if (chunk?.type === 'content_block_delta') {
        if (inToolUse) {
          toolUseMessage += chunk?.delta?.partial_json
        } else {
          controller.enqueue(chunk.delta.text)
        }
      } else if (chunk?.type === 'content_block_stop' && inToolUse) {
        const parsed = JSON.parse(toolUseMessage)
        await execTool(toolId, parsed)
        console.log({ parsed })
        inToolUse = false
      }
    },
  })

  const stream = GetChatResponseStream.getChatResponseStream(body)
  await stream.pipeThrough(messageStream).pipeTo(acc)
}
