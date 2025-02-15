import type { Message } from '../Message/Message.ts'
import { toBase64 } from '../ToBase64/ToBase64.ts'

// API-specific model with API-ready data
export interface MessageApiModel {
  readonly role: 'user' | 'assistant'
  readonly content: readonly MessagePartApiModel[]
}

export interface MessagePartApiModel {
  readonly type: 'text' | 'image'
  readonly text?: string
  readonly source?: {
    readonly type: 'base64'
    readonly media_type: string
    readonly data: string
  }
}

export const createMessageApiModel = async (message: Message): Promise<MessageApiModel> => {
  const content: readonly MessagePartApiModel[] = await Promise.all(
    message.content.map(async (part) => {
      if (part.type === 'image') {
        const base64Data = await toBase64(part.file)
        return {
          type: 'image',
          source: {
            type: 'base64',
            media_type: part.mediaType,
            data: base64Data,
          },
        }
      }
      return {
        type: 'text',
        text: part.content,
      }
    }),
  )

  return {
    role: message.role === 'human' ? 'user' : 'assistant',
    content,
  }
}
