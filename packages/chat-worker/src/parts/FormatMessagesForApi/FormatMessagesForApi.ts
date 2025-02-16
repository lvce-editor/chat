import type { Message } from '../Message/Message.ts'
import type { CodeMessageContent, ImageMessageContent, MessageContent, TextMessageContent } from '../MessageContent/MessageContent.ts'
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
  if (block.type === 'image') {
    return formatContentPartImageForApi(block)
  }
  if (block.type === 'text') {
    return formatContentPartTextForApi(block)
  }
  return formatCodePartForApi(block)
}

const formatContentsForApi = async (content: readonly MessageContent[]) => {
  return Array.isArray(content) ? await Promise.all(content.map(formatContentPartForApi)) : content
}

const formatMessageForApi = async (message: Message) => {
  return {
    role: message.role === 'human' ? 'user' : 'assistant',
    content: await formatContentsForApi(message.content),
  }
}

export const formatMessagesForApi = async (messages: readonly Message[]) => {
  return await Promise.all(messages.map(formatMessageForApi))
}
