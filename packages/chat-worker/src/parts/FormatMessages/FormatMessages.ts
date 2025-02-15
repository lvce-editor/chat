import type { Message } from '../Message/Message.ts'

const formatContentPartImageForApi = (block) => {
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: block.mediaType,
      data: block.content,
    },
  }
}

const formatContentPartTextForApi = (block) => {
  return {
    type: 'text',
    text: block.content,
  }
}

const formatContentPartForApi = (block) => {
  if (block.type === 'image') {
    return formatContentPartImageForApi(block)
  }
  if (block.type === 'text') {
    return formatContentPartTextForApi(block)
  }
  return formatContentPartTextForApi(block)
}

const formatContentsForApi = (content) => {
  return Array.isArray(content) ? content.map(formatContentPartForApi) : content
}

const formatMessageForApi = (message) => {
  return {
    role: message.role === 'human' ? 'user' : 'assistant',
    content: formatContentsForApi(message.content),
  }
}

export const formatMessagesForApi = (messages: readonly Message[]) => {
  return messages.map(formatMessageForApi)
}
