import type { BaseMessageContent } from '../MessageContent/MessageContent.ts'

export interface Message {
  readonly role: 'human' | 'ai'
  readonly content: readonly BaseMessageContent[]
}
