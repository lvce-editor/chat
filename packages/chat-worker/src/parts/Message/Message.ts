import { MessageContent } from '../MessageContent/MessageContent.ts'

export interface Message {
  readonly role: 'human' | 'ai'
  readonly content: readonly MessageContent[]
}
