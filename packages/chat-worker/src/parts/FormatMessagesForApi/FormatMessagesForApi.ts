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
    source: {
      data: content,
      media_type: 'image/png',
      type: 'base64',
    },
    type: 'image',
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
    tool_use_id: block.tool_use_id,
    type: 'tool_result',
  }
}
const formatToolUseForApi = (block: ToolUseMessageContent) => {
  return {
    id: block.tool_use_id,
    input: block.input,
    name: block.tool_use_name,
    type: 'tool_use',
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
    content: await formatContentsForApi(message.content),
    role: message.role === MessageRole.Human ? 'user' : 'assistant',
  }
}
