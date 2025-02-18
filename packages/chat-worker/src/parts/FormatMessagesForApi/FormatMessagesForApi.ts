import type { Message } from '../Message/Message.ts'
import type {
  CodeMessageContent,
  ImageMessageContent,
  MessageContent,
  TextMessageContent,
} from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'
import * as ToBase64 from '../ToBase64/ToBase64.ts'

const formatContentPartImageForApi = async (block: ImageMessageContent) => {
  const content = await ToBase64.toBase64(block.file)
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: block.mediaType,
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

const formatCodePartForApi = (block: CodeMessageContent) => {
  return {
    type: 'text',
    text: block.content,
  }
}

const formatContentPartForApi = (block: MessageContent) => {
  if (block.type === MessageContentType.Image) {
    return formatContentPartImageForApi(block)
  }
  if (block.type === MessageContentType.Text) {
    return formatContentPartTextForApi(block)
  }
  return formatCodePartForApi(block)
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
