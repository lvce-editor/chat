import type { Message } from '../Message/Message.ts'

// View-specific model with display-ready data
export interface MessageViewModel {
  readonly role: 'human' | 'ai'
  readonly blocks: readonly MessageBlockViewModel[]
}

export interface MessageBlockViewModel {
  readonly type: 'text' | 'code' | 'image'
  readonly content: string
  readonly display: {
    readonly blobUrl?: string
    readonly language?: string
    readonly className?: string
  }
}

export const createMessageViewModel = async (message: Message): Promise<MessageViewModel> => {
  const blocks: readonly MessageBlockViewModel[] = await Promise.all(
    message.content.map(async (part) => {
      if (part.type === 'image') {
        const blobUrl = 'todo'
        return {
          type: 'image',
          content: '',
          display: {
            blobUrl,
          },
        }
      }
      if (part.type === 'code') {
        return {
          type: 'code',
          content: part.content,
          display: {
            language: part.language,
          },
        }
      }
      return {
        type: 'text',
        content: part.content,
        display: {},
      }
    }),
  )

  return {
    role: message.role,

    blocks,
  }
}
