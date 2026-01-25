import type { Message } from '../Message/Message.ts'
import type {
  ImageMessageContent,
  MessageContent,
  TextMessageContent,
  ToolResultMessageContent,
  ToolUseMessageContent,
} from '../MessageContent/MessageContent.ts'
import * as ConvertImageToPng from '../ConvertImageToPng/ConvertImageToPng.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as ToBase64 from '../ToBase64/ToBase64.ts'

const formatContentPartImageForApi = async (block: ImageMessageContent) => {
  const pngFile = await ConvertImageToPng.convertImageToPng(block.file)
  const content = await ToBase64.toBase64(pngFile)
  return {
    image_url: {
      url: `data:image/png;base64,${content}`,
    },
    type: 'image_url',
  }
}

const formatContentPartTextForApi = (block: TextMessageContent) => {
  return {
    text: block.content,
    type: 'text',
  }
}

const formatContentPartToolResultForApi = (block: ToolResultMessageContent) => {
  return {
    content: block.content,
    tool_call_id: block.tool_use_id,
    type: 'tool_result',
  }
}

const formatToolUseForApi = (block: ToolUseMessageContent) => {
  return {
    function: {
      arguments: JSON.stringify(block.input),
      name: block.tool_use_name,
    },
    id: block.tool_use_id,
    type: 'function',
  }
}

const formatContentPartForApi = (block: MessageContent) => {
  if (block.type === MessageContentType.Image) {
    return formatContentPartImageForApi(block)
  }
  if (block.type === MessageContentType.ToolResult) {
    return formatContentPartToolResultForApi(block)
  }
  if (block.type === MessageContentType.ToolUse) {
    return formatToolUseForApi(block)
  }
  return formatContentPartTextForApi(block)
}

const formatContentsForApi = async (contents: readonly MessageContent[]) => {
  const formattedContents: any[] = []
  for (const content of contents) {
    formattedContents.push(await formatContentPartForApi(content))
  }
  return formattedContents
}

const formatMessageForApi = async (message: Message) => {
  // Handle tool result messages specially for OpenAI format
  if (message.content.length === 1 && message.content[0].type === MessageContentType.ToolResult) {
    const toolResult = message.content[0]
    return {
      content: toolResult.content,
      role: 'tool',
      tool_call_id: toolResult.tool_use_id,
    }
  }

  // Handle assistant messages with tool use
  if (message.role === MessageRole.Ai && message.content.some((c) => c.type === MessageContentType.ToolUse)) {
    const toolUses = message.content.filter((c) => c.type === MessageContentType.ToolUse)
    const textContent = message.content.filter((c) => c.type === MessageContentType.Text)
    return {
      content: textContent.length > 0 ? textContent.map((t) => t.content).join('') : null,
      role: 'assistant',
      tool_calls: toolUses.map((tu) => ({
        function: {
          arguments: JSON.stringify(tu.input),
          name: tu.tool_use_name,
        },
        id: tu.tool_use_id,
        type: 'function',
      })),
    }
  }

  return {
    content: await formatContentsForApi(message.content),
    role: message.role === MessageRole.Human ? 'user' : 'assistant',
  }
}

export const formatMessagesForOpenRouter = async (messages: readonly Message[]) => {
  const formattedMessages: any[] = []
  for (const message of messages) {
    formattedMessages.push(await formatMessageForApi(message))
  }
  return formattedMessages
}
