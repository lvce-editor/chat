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
    type: 'image',
    source: {
      type: 'base64',
      media_type: 'image/png',
      data: content,
    },
  }
}

const formatContentPartTextForApi = (block: TextMessageContent) => {
  return {
    type: 'text',
    text: block.content,
  }
}

const formatContentPartToolResultForApi = (block: ToolResultMessageContent) => {
  return {
    type: 'tool_result',
    tool_use_id: block.tool_use_id,
    content: block.content,
  }
}
const formatToolUseForApi = (block: ToolUseMessageContent) => {
  return {
    type: 'tool_use',
    id: block.tool_use_id,
    name: block.tool_use_name,
    input: block.input,
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

export const formatMessagesForApi = async (messages: readonly Message[]) => {
  const formattedMessages: any[] = []
  for (const message of messages) {
    formattedMessages.push(await formatMessageForApi(message))
  }
  return formattedMessages
}

const formatMessageForApi = async (message: Message) => {
  return {
    role: message.role === MessageRole.Human ? 'user' : 'assistant',
    content: await formatContentsForApi(message.content),
  }
}
